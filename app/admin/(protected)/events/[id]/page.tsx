import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, FileBadge, Settings, Mail, Upload } from "lucide-react";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      _count: {
        select: { participants: true, certificates: true, emailCampaigns: true }
      }
    }
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/events" className="text-gray-500 hover:text-gray-900 bg-white p-2 rounded-full border shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
          <div className="flex space-x-3 mt-2 text-sm text-gray-500">
            <span>{event.category}</span>
            <span>•</span>
            <span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}</span>
            <span>•</span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              event.status === "Ongoing" ? "bg-green-100 text-green-700" :
              event.status === "Draft" ? "bg-gray-100 text-gray-700" :
              "bg-blue-100 text-blue-700"
            }`}>
              {event.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 font-medium">Participants</h3>
            <Users className="text-blue-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{event._count.participants}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 font-medium">Certificates</h3>
            <FileBadge className="text-purple-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{event._count.certificates}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 font-medium">Email Campaigns</h3>
            <Mail className="text-orange-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{event._count.emailCampaigns}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" /> Participant Management
            </h3>
          </div>
          <div className="p-6 space-y-4 flex-grow flex flex-col justify-center">
            <p className="text-gray-600">Upload your Excel or CSV file containing participant details.</p>
            <Link href={`/admin/events/${event.id}/participants/import`} className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium py-3 px-4 rounded-lg flex items-center justify-center border border-blue-200 transition">
              <Upload className="w-5 h-5 mr-2" /> Import Excel / CSV
            </Link>
            <Link href={`/admin/events/${event.id}/participants`} className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center border transition">
              View All Participants
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center">
              <FileBadge className="w-5 h-5 mr-2 text-purple-600" /> Certificate Generation
            </h3>
          </div>
          <div className="p-6 space-y-4 flex-grow flex flex-col justify-center">
            <p className="text-gray-600">Design your template, map fields, and generate bulk PDFs.</p>
            <Link href={`/admin/events/${event.id}/certificates/wizard`} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition shadow-sm">
              Launch Generator Wizard
            </Link>
            <Link href={`/admin/events/${event.id}/templates`} className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center border transition">
              Manage Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
