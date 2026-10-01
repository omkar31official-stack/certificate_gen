import { prisma } from "@/lib/database/prisma";
import Link from "next/link";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Announcements</h1>
          <p className="mt-4 text-lg text-gray-500">Stay updated with the latest news from SLUG.</p>
        </div>

        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements</h3>
            <p className="text-gray-500">Check back later for updates!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl border shadow-sm p-8">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{a.title}</h2>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-4">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap mb-4">{a.content}</p>
                <Link href={`/events/${a.eventId}`} className="text-blue-600 text-sm font-medium hover:underline">
                  {a.event.name} →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
