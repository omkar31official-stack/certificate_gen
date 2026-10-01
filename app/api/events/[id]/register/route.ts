import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { fullName, email, phone } = await req.json();

    if (!fullName || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "Upcoming" && event.status !== "Registration Open") {
      return NextResponse.json({ error: "Registration is closed for this event" }, { status: 400 });
    }

    // Check for duplicate registration
    const existing = await prisma.participant.findUnique({
      where: { eventId_email: { eventId: id, email } },
    });

    if (existing) {
      return NextResponse.json({ error: "You have already registered for this event" }, { status: 409 });
    }

    await prisma.participant.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        eventId: id,
        status: "Registered",
      },
    });

    return NextResponse.json({ success: true, message: "Registration successful" });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
