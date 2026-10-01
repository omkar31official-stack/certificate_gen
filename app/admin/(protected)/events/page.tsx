import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { Plus, Calendar as CalendarIcon, MapPin } from "lucide-react";
import DeleteMenu from "@/components/admin/DeleteMenu";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">Manage all your organization's events</p>
        </div>
        <Link 
          href="/admin/events/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center shadow-sm"
        >
          <Plus className="w-5 h-5 mr-1" /> Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow p-6 group h-full flex flex-col relative">
            <Link href={`/admin/events/${event.id}`} className="absolute inset-0 z-0"></Link>
            <div className="flex justify-between items-start mb-4 relative z-10 pointer-events-none">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 line-clamp-2">
                {event.name}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                event.status === "Ongoing" ? "bg-green-100 text-green-700" :
                event.status === "Draft" ? "bg-gray-100 text-gray-700" :
                event.status === "Completed" ? "bg-purple-100 text-purple-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {event.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-6 flex-grow text-sm text-gray-600 relative z-10 pointer-events-none">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                {event.startDate ? new Date(event.startDate).toLocaleDateString() : "No date set"}
              </div>
              {event.venue && (
                <div className="flex items-center line-clamp-1">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t flex justify-between items-center text-sm text-gray-500 relative z-10">
              <span className="pointer-events-none">Manage Event →</span>
              <DeleteMenu endpoint={`/api/events/${event.id}`} itemType="event" />
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="col-span-full bg-white border border-dashed rounded-xl p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first event.</p>
            <Link 
              href="/admin/events/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-1" /> Create Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
