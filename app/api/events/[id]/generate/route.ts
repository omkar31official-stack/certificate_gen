import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/database/prisma";
import { generateCertificateId, generateCertificatePdf } from "@/lib/certificates/generator";
import { uploadToCloudinary } from "@/lib/storage/cloudinary";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { mappedData, templateFields, templateUrl } = await req.json();

    if (!mappedData || mappedData.length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    if (!templateUrl) {
      return NextResponse.json({ error: "No template provided" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // Download the template buffer from the Cloudinary URL
    let templateBuffer: Buffer;
    let mimeType = 'application/pdf';
    try {
      const resp = await fetch(templateUrl);
      const arrayBuffer = await resp.arrayBuffer();
      templateBuffer = Buffer.from(arrayBuffer);
      mimeType = resp.headers.get('content-type') || 'application/pdf';
    } catch (e) {
      return NextResponse.json({ error: "Failed to download template image" }, { status: 500 });
    }

    let template = await prisma.certificateTemplate.findFirst({ where: { eventId: event.id } });
    if (!template) {
      template = await prisma.certificateTemplate.create({
        data: { name: "Default Template", eventId: event.id, fields: templateFields || [] }
      });
    }
    const templateId = template.id; 
    
    let processed = 0;
    
    // We process synchronously here to upload and queue. 
    // In a massive scale (10,000+), this should also be chunked or a background job itself.
    // For normal scale (<1000), this works within 60s function limits.
    for (const row of mappedData) {
      const email = row.Email || row.email;
      const fullName = row.FullName || row.name || "Participant";

      if (!email) continue;

      let participant = await prisma.participant.findUnique({ 
        where: { eventId_email: { eventId: event.id, email } } 
      });
      
      if (!participant) {
        participant = await prisma.participant.create({
          data: { fullName, email, eventId: event.id, customData: row }
        });
      }

      const certId = generateCertificateId();
      
      // Inject real values into template fields
      const filledFields = templateFields.map((f: any) => {
        let val = f.value;
        val = val.replace('{{full_name}}', fullName);
        val = val.replace('{{email}}', email);
        val = val.replace('{{certificate_id}}', certId);
        // Add more dynamic mapping here if needed
        return { ...f, value: val };
      });

      // Generate the PDF in memory
      let pdfBuffer: Buffer;
      try {
        pdfBuffer = await generateCertificatePdf(templateBuffer, filledFields, mimeType);
      } catch (e) {
        console.error("Failed to generate PDF for", email, e);
        continue;
      }

      // Upload to Cloudinary for permanent storage
      let pdfUrl = "";
      try {
        const uploadResult = await uploadToCloudinary(pdfBuffer, `slug_certificates/${event.id}`);
        pdfUrl = uploadResult.url;
      } catch (e) {
        console.error("Cloudinary upload failed for", email, e);
        continue;
      }

      // Save to database
      const certificate = await prisma.certificate.create({
        data: {
          certificateId: certId,
          participantId: participant.id,
          eventId: event.id,
          templateId: templateId,
          pdfUrl: pdfUrl,
          status: "Valid"
        }
      });
      
      // Create the Email Queue Job (EmailLog with status 'Pending')
      await prisma.emailLog.create({
        data: {
          eventId: event.id,
          certificateId: certificate.id,
          recipientEmail: email,
          status: "Pending"
        }
      });
      
      processed++;
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: `Generated and queued ${processed} certificates for event ${event.id}`,
        adminId: session.user?.email || "system"
      }
    });

    return NextResponse.json({ success: true, message: `Successfully generated and queued ${processed} certificates!` });

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Failed to queue certificates" }, { status: 500 });
  }
}
