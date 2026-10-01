import { prisma } from "@/lib/database/prisma";
import { BarChart3, Calendar, Users, FileBadge, Mail, ShieldCheck } from "lucide-react";

export default async function AnalyticsPage() {
  const [events, participants, certificates, emailsSent, emailsFailed, verifications] = await Promise.all([
    prisma.event.count(),
    prisma.participant.count(),
    prisma.certificate.count(),
    prisma.emailLog.count({ where: { status: "Sent" } }),
    prisma.emailLog.count({ where: { status: "Failed" } }),
    prisma.verificationLog.count(),
  ]);

  const recentEvents = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: { select: { participants: true, certificates: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Platform-wide statistics from real database data</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Events", value: events, icon: Calendar, color: "blue" },
          { label: "Participants", value: participants, icon: Users, color: "green" },
          { label: "Certificates", value: certificates, icon: FileBadge, color: "purple" },
          { label: "Emails Sent", value: emailsSent, icon: Mail, color: "orange" },
          { label: "Emails Failed", value: emailsFailed, icon: Mail, color: "red" },
          { label: "Verifications", value: verifications, icon: ShieldCheck, color: "teal" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-5 rounded-xl border shadow-sm">
              <Icon className={`w-5 h-5 text-${stat.color}-500 mb-2`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">Event Breakdown</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificates</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700">{event.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{event._count.participants}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{event._count.certificates}</td>
              </tr>
            ))}
            {recentEvents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>No event data available.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
