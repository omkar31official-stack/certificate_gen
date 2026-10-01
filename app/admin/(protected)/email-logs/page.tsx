import { prisma } from "@/lib/database/prisma";
import { Mail, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import ProcessQueueButton from "@/components/admin/ProcessQueueButton";

export default async function EmailLogsPage() {
  const logs = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      event: true,
      certificate: { include: { participant: true } },
    },
  });

  const counts = {
    total: logs.length,
    sent: logs.filter((l) => l.status === "Sent").length,
    pending: logs.filter((l) => l.status === "Pending").length,
    failed: logs.filter((l) => l.status === "Failed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Logs</h1>
          <p className="text-gray-500 mt-1">Track all certificate emails sent through the platform</p>
        </div>
        <ProcessQueueButton />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{counts.sent}</p>
          <p className="text-xs text-gray-500">Sent</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{counts.failed}</p>
          <p className="text-xs text-gray-500">Failed</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  <div className="font-medium text-gray-900">{log.certificate?.participant?.fullName || "—"}</div>
                  <div className="text-gray-500">{log.recipientEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{log.event.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    log.status === "Sent" ? "bg-green-100 text-green-700" :
                    log.status === "Failed" ? "bg-red-100 text-red-700" :
                    log.status === "Processing" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {log.status === "Sent" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {log.status === "Failed" && <XCircle className="w-3 h-3 mr-1" />}
                    {log.status === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{log.retryCount}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-red-500 max-w-xs truncate">{log.error || "—"}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>No email logs yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
