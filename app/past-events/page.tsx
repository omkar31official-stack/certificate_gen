import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

export default async function PastEventsPage() {
  const events = await prisma.event.findMany({
    where: { status: "Completed" },
    orderBy: { endDate: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Past Events</h1>
          <p className="mt-4 text-xl text-gray-500">A look back at our previous workshops and hackathons.</p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
            <p className="text-gray-500">Completed events will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition group">
                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300">
                  {event.posterUrl && <img src={event.posterUrl} alt={event.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2">{event.name}</h3>
                  {event.endDate && (
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.endDate).toLocaleDateString()}
                    </div>
                  )}
                  {event.venue && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.venue}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
