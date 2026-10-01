import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

export default async function PublicEventsPage() {
  const events = await prisma.event.findMany({
    where: { 
      status: { in: ["Upcoming", "Registration Open", "Ongoing", "Completed"] }
    }, 
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Upcoming Events</h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Discover and participate in the latest open-source workshops and hackathons hosted by SLUG.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active events</h3>
            <p className="text-gray-500">Check back later for new workshops and hackathons!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition">
                {event.posterUrl ? (
                  <div className="h-48 bg-gray-200 overflow-hidden relative">
                    <img src={event.posterUrl} alt={event.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.description}</p>
                  
                  <div className="mt-auto space-y-2 mb-6">
                    {event.startDate && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                    )}
                    {event.venue && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        {event.venue}
                      </div>
                    )}
                  </div>

                  <Link href={`/events/${event.id}`} className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition">
                    View Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
