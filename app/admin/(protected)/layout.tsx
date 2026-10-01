import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/certificates", label: "Certificates" },
    { href: "/admin/templates", label: "Templates" },
    { href: "/admin/email-logs", label: "Email Logs" },
    { href: "/admin/announcements", label: "Announcements" },
    { href: "/admin/gallery", label: "Gallery" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/audit-logs", label: "Audit Logs" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex md:flex-col flex-shrink-0">
        <div className="p-6 border-b">
          <Link href="/admin/dashboard">
            <h2 className="font-bold text-xl tracking-tight text-blue-600">SLUG Admin</h2>
          </Link>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded-md hover:bg-gray-100 font-medium text-sm text-gray-700 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-40">
        <Link href="/admin/dashboard">
          <h2 className="font-bold text-xl tracking-tight text-blue-600">SLUG Admin</h2>
        </Link>
        <details className="relative">
          <summary className="p-2 bg-gray-100 rounded-md cursor-pointer list-none font-medium text-sm">Menu</summary>
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 py-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
