import { prisma } from "@/lib/database/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";

export default async function PublicEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event || event.status === "Draft" || event.status === "Archived") {
    notFound();
  }

  const isRegistrationOpen = event.status === "Upcoming" || event.status === "Registration Open";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/events" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </Link>
        
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {event.posterUrl ? (
            <div className="h-64 sm:h-96 w-full relative">
              <img src={event.posterUrl} alt={event.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          )}

          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">{event.name}</h1>
                <p className="text-xl text-gray-500">{event.category || "General Event"}</p>
              </div>
              {isRegistrationOpen && (
                <Link href={`/register/${event.id}`} className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition flex-shrink-0">
                  Register Now
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {event.startDate && (
                <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl border">
                  <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Date</p>
                    <p>{new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {event.venue && (
                <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl border">
                  <MapPin className="w-6 h-6 mr-3 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p>{event.venue}</p>
                  </div>
                </div>
              )}
              {event.registrationDeadline && (
                <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl border md:col-span-2">
                  <Clock className="w-6 h-6 mr-3 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Registration Deadline</p>
                    <p>{new Date(event.registrationDeadline).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Event</h2>
              <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap">
                {event.description || "No description provided."}
              </div>
            </div>
            
            {event.organizer && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Organized By</h3>
                <p className="text-gray-900 font-medium">{event.organizer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
