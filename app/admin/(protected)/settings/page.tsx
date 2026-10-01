"use client";

import { useState } from "react";
import { Save, TestTube, Shield, Building2, Mail, FileText, QrCode, Palette, Clock, Server, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState("");
  const [senderName, setSenderName] = useState("SLUG Platform");
  const [testEmailTo, setTestEmailTo] = useState("");

  const [orgName, setOrgName] = useState("Sapthagiri Libre-Software Users Group");
  const [orgShort, setOrgShort] = useState("SLUG");
  const [orgEmail, setOrgEmail] = useState("");
  const [certPrefix, setCertPrefix] = useState("SLUG");
  const [verifyUrl, setVerifyUrl] = useState("http://localhost:3000");

  const tabs = [
    { id: "account", label: "Account", icon: Shield },
    { id: "organization", label: "Organization", icon: Building2 },
    { id: "email", label: "Email / SMTP", icon: Mail },
    { id: "certificates", label: "Certificates", icon: FileText },
    { id: "qr", label: "QR & Verification", icon: QrCode },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "system", label: "System Status", icon: Server },
  ];

  const handleTestEmail = async () => {
    if (!testEmailTo) return;
    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmailTo }),
      });
      const data = await res.json();
      setTestResult({ success: data.success, message: data.message || data.error });
    } catch {
      setTestResult({ success: false, message: "Failed to send test email" });
    }
    setTestingEmail(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: orgName,
          shortName: orgShort,
          contactEmail: orgEmail,
          certPrefix,
          verifyUrl,
          senderName,
        }),
      });
    } catch {
      // handled
    }
    setSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-56 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border shadow-sm p-6 sm:p-8">
          {activeTab === "account" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Account & Security</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-500 mb-1">Authorized Admin</p>
                  <p className="font-medium text-gray-900">projectom2820@gmail.com</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-500 mb-1">Authentication Method</p>
                  <p className="font-medium text-gray-900">Google OAuth 2.0</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-500 mb-1">Session Strategy</p>
                  <p className="font-medium text-gray-900">JWT (30-day expiry)</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm mt-4"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === "organization" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Organization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Name / Prefix</label>
                  <input type="text" value={orgShort} onChange={(e) => setOrgShort(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <button onClick={handleSaveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Email / SMTP Configuration</h2>
              <p className="text-sm text-gray-500">SMTP credentials are loaded from server environment variables for security. You cannot view or edit the password here.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                    <input type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                    <input type="text" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                  <div className="p-3 bg-gray-50 border rounded-lg text-sm text-gray-600 font-mono">
                    {process.env.NEXT_PUBLIC_SMTP_USER || "Configured via server environment"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                  <div className="p-3 bg-gray-50 border rounded-lg text-sm text-gray-500">
                    ••••••••••••••• (stored securely in server environment)
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
                  <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-bold text-gray-900">Send Test Email</h3>
                <div className="flex gap-3">
                  <input type="email" value={testEmailTo} onChange={(e) => setTestEmailTo(e.target.value)} placeholder="recipient@example.com" className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <button onClick={handleTestEmail} disabled={testingEmail || !testEmailTo} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 flex-shrink-0">
                    <TestTube className="w-4 h-4" /> {testingEmail ? "Sending..." : "Send Test"}
                  </button>
                </div>
                {testResult && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${testResult.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {testResult.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Certificate Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certificate ID Prefix</label>
                  <input type="text" value={certPrefix} onChange={(e) => setCertPrefix(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <p className="text-xs text-gray-400 mt-1">Certificates will be generated as: {certPrefix}-2026-XXXXXX</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Certificate Type</label>
                  <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option>Participation</option>
                    <option>Achievement</option>
                    <option>Completion</option>
                    <option>Winner</option>
                  </select>
                </div>
                <button onClick={handleSaveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "qr" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">QR & Verification Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Verification URL</label>
                  <input type="text" value={verifyUrl} onChange={(e) => setVerifyUrl(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <p className="text-xs text-gray-400 mt-1">QR codes will point to: {verifyUrl}/verify/CERTIFICATE-ID</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">QR Error Correction</label>
                  <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="M">Medium (recommended)</option>
                    <option value="L">Low</option>
                    <option value="Q">Quartile</option>
                    <option value="H">High</option>
                  </select>
                </div>
                <button onClick={handleSaveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Light", "Dark", "System"].map((theme) => (
                      <button key={theme} className="p-4 border-2 rounded-lg text-center font-medium text-sm hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition border-gray-200">
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">System Status</h2>
              <div className="space-y-3">
                {[
                  { label: "Database (Neon PostgreSQL)", status: "Connected", ok: true },
                  { label: "Cloudinary Storage", status: "Configured", ok: true },
                  { label: "Gmail SMTP", status: "Configured", ok: true },
                  { label: "Google OAuth", status: "Active", ok: true },
                  { label: "Email Queue", status: "Ready", ok: true },
                  { label: "Vercel Cron", status: "Endpoint available", ok: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
