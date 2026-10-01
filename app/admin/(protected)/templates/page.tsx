import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { Plus, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import DeleteMenu from "@/components/admin/DeleteMenu";

export default async function TemplatesPage() {
  const templates = await prisma.certificateTemplate.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      event: true,
      _count: { select: { certificates: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificate Templates</h1>
          <p className="text-gray-500 mt-1">Manage certificate templates across all events</p>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white border border-dashed rounded-2xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Templates are created when you upload a certificate background through the Certificate Generator Wizard on an event page.
          </p>
          <Link href="/admin/events" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium inline-flex items-center transition">
            Go to Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl border shadow-sm overflow-hidden group hover:shadow-md transition relative">
              <div className="absolute top-2 right-2 z-10 bg-white/80 rounded-full shadow-sm backdrop-blur-sm">
                <DeleteMenu endpoint={`/api/admin/templates/${template.id}`} itemType="template" />
              </div>
              <div className="h-40 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center relative">
                {template.imageUrl ? (
                  <img src={template.imageUrl} alt={template.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  {template.event ? template.event.name : "Global Template"}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{template._count.certificates} certificates generated</span>
                  <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
