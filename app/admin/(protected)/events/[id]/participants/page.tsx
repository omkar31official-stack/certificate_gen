import Link from "next/link";
import { ArrowLeft, UserPlus, FileSpreadsheet } from "lucide-react";
import { prisma } from "@/lib/database/prisma";
import DeleteMenu from "@/components/admin/DeleteMenu";

export default async function ParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const participants = await prisma.participant.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href={`/admin/events/${id}`} className="text-gray-500 hover:text-gray-900 bg-white p-2 rounded-full border shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Event Participants</h1>
        </div>
        <div className="flex space-x-3">
          <Link href={`/admin/events/${id}/participants/import`} className="bg-white border text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg flex items-center transition shadow-sm">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Import
          </Link>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition shadow-sm">
            <UserPlus className="w-4 h-4 mr-2" /> Add Participant
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {participants.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No participants found for this event.</p>
            <Link href={`/admin/events/${id}/participants/import`} className="text-blue-600 font-medium hover:underline">
              Import from Excel/CSV
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 font-semibold text-gray-600 text-sm">Name</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Email</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Date Added</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {participants.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-900 font-medium">{p.fullName}</td>
                    <td className="p-4 text-gray-500">{p.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <DeleteMenu endpoint={`/api/events/${id}/participants/${p.id}`} itemType="participant" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
