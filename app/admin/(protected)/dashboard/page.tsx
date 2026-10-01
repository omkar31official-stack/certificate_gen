import { prisma } from "@/lib/database/prisma";
import { Users, FileBadge, Calendar, Mail, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const eventsCount = await prisma.event.count();
  const certsCount = await prisma.certificate.count();
  const participantCount = await prisma.participant.count();
  const emailsSent = await prisma.emailLog.count({ where: { status: "Sent" } });
  
  const recentLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/admin/events/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition">
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Events</p>
            <p className="text-2xl font-bold">{eventsCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Participants</p>
            <p className="text-2xl font-bold">{participantCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <FileBadge className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Certificates Generated</p>
            <p className="text-2xl font-bold">{certsCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Emails Sent</p>
            <p className="text-2xl font-bold">{emailsSent}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm mt-8">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">Recent Activity</h3>
        </div>
        <div className="p-6">
          {recentLogs.length > 0 ? (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 text-sm">
                  {log.action.includes("failed") || log.action.includes("delete") ? (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{log.action}</p>
                    <p className="text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}
