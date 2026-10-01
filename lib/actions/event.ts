"use server";

import { prisma } from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const venue = formData.get("venue") as string;
  const category = formData.get("category") as string;
  const organizer = formData.get("organizer") as string;
  
  if (!name) {
    throw new Error("Event name is required");
  }

  const event = await prisma.event.create({
    data: {
      name,
      description,
      venue,
      category,
      organizer,
      startDate: startDateStr ? new Date(startDateStr) : null,
      endDate: endDateStr ? new Date(endDateStr) : null,
      status: "Upcoming",
    },
  });

  revalidatePath("/admin/events");
  redirect(`/admin/events/${event.id}`);
}
