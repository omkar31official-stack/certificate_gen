import { prisma } from "@/lib/database/prisma";
import { notFound } from "next/navigation";
import RegistrationForm from "@/components/registration/RegistrationForm";

export default async function EventRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });

  if (!event || event.status === "Draft" || event.status === "Archived") {
    notFound();
  }

  const isRegistrationOpen = event.status === "Upcoming" || event.status === "Registration Open";

  return <RegistrationForm eventId={event.id} eventName={event.name} isOpen={isRegistrationOpen} />;
}
