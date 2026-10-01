import { prisma } from "@/lib/database/prisma";
import { Bell } from "lucide-react";
import NewAnnouncementForm from "@/components/admin/NewAnnouncementForm";
import DeleteMenu from "@/components/admin/DeleteMenu";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 mt-1">Create and manage public announcements</p>
        </div>
        <NewAnnouncementForm />
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white border border-dashed rounded-2xl p-16 text-center shadow-sm">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Announcements will appear here. Click &quot;New Announcement&quot; to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border shadow-sm p-6 relative group">
              <div className="absolute top-4 right-4">
                <DeleteMenu endpoint={`/api/admin/announcements/${a.id}`} itemType="announcement" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 pr-10">{a.title}</h3>
              <p className="text-sm text-blue-600 mb-3">{a.event.name}</p>
              <p className="text-gray-600 whitespace-pre-wrap text-sm">{a.content}</p>
              <p className="text-xs text-gray-400 mt-4">{new Date(a.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
