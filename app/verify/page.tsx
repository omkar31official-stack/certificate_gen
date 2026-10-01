"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, QrCode, Upload, ShieldCheck, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!certId.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/verify?id=${encodeURIComponent(certId.trim())}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Verification failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tighter text-blue-600">SLUG</span>
          </Link>
          <nav className="flex space-x-8">
            <Link href="/events" className="text-sm font-medium text-gray-600 hover:text-blue-600">Events</Link>
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">Home</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Verify Certificate</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform guarantees the authenticity of certificates issued by SLUG. 
            Use any of the methods below to verify a certificate instantly.
          </p>
        </div>

        {/* Certificate ID Verification */}
        <div className="bg-white rounded-2xl border shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Verify by Certificate ID</h3>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="Enter Certificate ID (e.g. SLUG-2026-XXXXXX)"
              className="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleVerify}
              disabled={loading || !certId.trim()}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Verify
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="text-lg font-bold text-green-800">Certificate Verified</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Holder</p>
                  <p className="text-gray-900 font-bold">{result.participant}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Event</p>
                  <p className="text-gray-900">{result.event}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Certificate ID</p>
                  <p className="text-gray-900 font-mono">{result.certificateId}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                    result.status === "Valid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>{result.status}</span>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Issue Date</p>
                  <p className="text-gray-900">{new Date(result.issuedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Issued By</p>
                  <p className="text-gray-900">SLUG</p>
                </div>
              </div>
              {result.pdfUrl && result.pdfUrl !== "pending" && (
                <div className="mt-4">
                  <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium text-sm">
                    View Certificate PDF →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/scanner" className="bg-white rounded-2xl border shadow-sm p-8 hover:shadow-lg transition group">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">QR Scanner</h3>
            <p className="text-gray-500 text-sm">Use your camera to scan the QR code on a certificate.</p>
          </Link>

          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Certificate</h3>
            <p className="text-gray-500 text-sm mb-4">Upload a certificate PDF or image to verify it.</p>
            <label className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition flex justify-center items-center cursor-pointer">
              <Upload className="w-4 h-4 mr-2" /> Choose File
              <input type="file" className="hidden" accept=".pdf,image/*" />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}
