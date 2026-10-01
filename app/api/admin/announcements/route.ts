import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/database/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, content, eventId } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // If no eventId provided, use the first event or create a system-level one
    let targetEventId = eventId;
    if (!targetEventId) {
      const firstEvent = await prisma.event.findFirst({ orderBy: { createdAt: "desc" } });
      if (!firstEvent) {
        return NextResponse.json({ error: "Create an event first before posting announcements" }, { status: 400 });
      }
      targetEventId = firstEvent.id;
    }

    const announcement = await prisma.announcement.create({
      data: { title, content, eventId: targetEventId, isPublic: true },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error: any) {
    console.error("Announcement creation error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
