import { prisma } from "@/lib/database/prisma";
import { Image as ImageIcon } from "lucide-react";
import GalleryUploadButton from "@/components/admin/GalleryUploadButton";
import DeleteMenu from "@/components/admin/DeleteMenu";

export default async function AdminGalleryPage() {
  const galleryItems = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500 mt-1">Upload and manage event photos and videos</p>
        </div>
        <GalleryUploadButton />
      </div>

      {galleryItems.length === 0 ? (
        <div className="bg-white border border-dashed rounded-2xl p-16 text-center shadow-sm">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Gallery items will appear here after uploading. Use the button above to add photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className="group rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition relative">
              <div className="absolute top-2 right-2 z-10 bg-white/80 rounded-full shadow-sm backdrop-blur-sm">
                <DeleteMenu endpoint={`/api/admin/gallery/${item.id}`} itemType="image" />
              </div>
              {item.type === "Image" ? (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img src={item.url} alt={item.description || "Event photo"} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
              ) : (
                <div className="aspect-video bg-gray-900">
                  <video src={item.url} controls className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4 bg-white">
                {item.description && <p className="text-sm text-gray-700 mb-1">{item.description}</p>}
                <p className="text-xs text-gray-400">{item.event.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
