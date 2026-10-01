import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/database/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { participants } = await req.json();

    if (!participants || !Array.isArray(participants)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    for (const p of participants) {
      if (!p.email) continue;
      
      const exists = await prisma.participant.findUnique({
        where: { eventId_email: { eventId: id, email: p.email } }
      });
      
      if (!exists) {
        await prisma.participant.create({
          data: {
            fullName: p.fullName || "Unknown",
            email: p.email,
            eventId: id
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to import" }, { status: 500 });
  }
}
