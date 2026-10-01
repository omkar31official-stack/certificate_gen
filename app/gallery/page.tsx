import { prisma } from "@/lib/database/prisma";
import { Image as ImageIcon } from "lucide-react";

export default async function GalleryPage() {
  const galleryItems = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">Event Gallery</h1>
          <p className="text-xl text-gray-500">
            Memories from our past workshops and hackathons.
          </p>
        </div>

        {galleryItems.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Event photos and videos will appear here once they are uploaded by the organizing team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="group rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition">
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
    </div>
  );
}
