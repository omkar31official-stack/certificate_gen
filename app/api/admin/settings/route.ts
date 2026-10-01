import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/database/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Upsert the single settings record
    const existing = await prisma.systemSettings.findFirst();
    
    if (existing) {
      await prisma.systemSettings.update({
        where: { id: existing.id },
        data: {
          organizationName: body.organizationName || existing.organizationName,
          shortName: body.shortName || existing.shortName,
          contactEmail: body.contactEmail || existing.contactEmail,
        },
      });
    } else {
      await prisma.systemSettings.create({
        data: {
          organizationName: body.organizationName || "SLUG",
          shortName: body.shortName || "SLUG",
          contactEmail: body.contactEmail,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Settings save error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.systemSettings.findFirst();
  return NextResponse.json(settings || {});
}
