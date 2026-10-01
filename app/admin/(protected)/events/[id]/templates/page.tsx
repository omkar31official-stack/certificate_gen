import Link from "next/link";
import { ArrowLeft, FileImage, Plus } from "lucide-react";
import { prisma } from "@/lib/database/prisma";

export default async function EventTemplatesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const templates = await prisma.certificateTemplate.findMany({
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
          <h1 className="text-3xl font-bold text-gray-900">Event Templates</h1>
        </div>
        <Link href={`/admin/events/${id}/certificates/wizard`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New Template
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-full bg-white p-12 border rounded-2xl shadow-sm text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 text-gray-400 flex items-center justify-center rounded-full mb-4">
              <FileImage className="w-6 h-6" />
            </div>
            <p className="text-gray-500 mb-4">No templates created for this event yet.</p>
            <Link href={`/admin/events/${id}/certificates/wizard`} className="text-blue-600 font-medium hover:underline">
              Create your first template
            </Link>
          </div>
        ) : (
          templates.map(t => (
            <div key={t.id} className="bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-100 border-b flex items-center justify-center text-gray-400">
                <FileImage className="w-12 h-12" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">{t.name}</h3>
                <p className="text-sm text-gray-500">Created: {new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
