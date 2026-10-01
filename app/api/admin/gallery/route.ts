import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/database/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { url, type, description, eventId } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // If no eventId, use the first available event
    let targetEventId = eventId;
    if (!targetEventId) {
      const firstEvent = await prisma.event.findFirst({ orderBy: { createdAt: "desc" } });
      if (!firstEvent) {
        return NextResponse.json({ error: "Create an event first" }, { status: 400 });
      }
      targetEventId = firstEvent.id;
    }

    const item = await prisma.galleryItem.create({
      data: { url, type: type || "Image", description, eventId: targetEventId },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("Gallery upload error:", error);
    return NextResponse.json({ error: "Failed to add gallery item" }, { status: 500 });
  }
}
