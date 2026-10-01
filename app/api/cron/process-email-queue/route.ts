import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { sendEmail } from "@/lib/email/mailer";

export async function GET(req: NextRequest) {
  // Protect cron endpoint using Vercel's secret or a local dev token
  const authHeader = req.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const batchSize = 100;
    
    // Fetch pending or eligible failed jobs
    const jobs = await prisma.emailLog.findMany({
      where: {
        OR: [
          { status: "Pending" },
          { status: "Failed", retryCount: { lt: 3 } }
        ]
      },
      include: {
        certificate: {
          include: {
            participant: true,
            event: true
          }
        }
      },
      take: batchSize,
      orderBy: { createdAt: "asc" }
    });

    if (jobs.length === 0) {
      return NextResponse.json({ success: true, message: "No jobs in queue" });
    }

    let processed = 0;
    let failed = 0;

    for (const job of jobs) {
      // Lock the job by marking it as Processing
      await prisma.emailLog.update({
        where: { id: job.id },
        data: { status: "Processing" }
      });

      try {
        if (!job.certificate || !job.certificate.pdfUrl || job.certificate.pdfUrl === "sent_via_email") {
          throw new Error("Missing PDF URL");
        }

        const participant = job.certificate.participant;
        const event = job.certificate.event;

        await sendEmail({
          to: job.recipientEmail,
          subject: `Your Certificate for ${event.name}`,
          html: `<p>Hello ${participant.fullName},</p><p>Congratulations! Please find the link to your official certificate for <strong>${event.name}</strong>.</p><p><a href="${job.certificate.pdfUrl}" target="_blank">View Certificate</a></p><p>Or verify it using ID: ${job.certificate.certificateId}</p><p>Best,<br>SLUG Team</p>`,
        });

        // Update as Sent
        await prisma.emailLog.update({
          where: { id: job.id },
          data: { status: "Sent", error: null }
        });
        
        processed++;
      } catch (err: any) {
        console.error(`Job ${job.id} failed:`, err);
        // Mark as Failed and increment retry count
        await prisma.emailLog.update({
          where: { id: job.id },
          data: { 
            status: "Failed", 
            error: err.message || "Unknown error",
            retryCount: job.retryCount + 1
          }
        });
        failed++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed, 
      failed,
      message: `Processed ${processed} jobs successfully. ${failed} failed.` 
    });

  } catch (error: any) {
    console.error("Cron execution error:", error);
    return NextResponse.json({ error: "Cron execution failed" }, { status: 500 });
  }
}
