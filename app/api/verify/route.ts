import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
  }

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: id },
      include: {
        participant: true,
        event: true,
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found. Please check the ID and try again." }, { status: 404 });
    }

    // Log the verification
    try {
      await prisma.verificationLog.create({
        data: { certificateId: certificate.id },
      });
    } catch {
      // Non-critical
    }

    return NextResponse.json({
      certificateId: certificate.certificateId,
      participant: certificate.participant.fullName,
      event: certificate.event.name,
      status: certificate.status,
      issuedAt: certificate.createdAt.toISOString(),
      pdfUrl: certificate.pdfUrl,
    });
  } catch (error: any) {
    console.error("Verification API error:", error);
    return NextResponse.json({ error: "Verification service unavailable. Please try again." }, { status: 500 });
  }
}
