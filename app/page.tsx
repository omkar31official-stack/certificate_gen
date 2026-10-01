"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [certId, setCertId] = useState("");
  const router = useRouter();

  const handleVerify = () => {
    if (certId.trim()) {
      router.push(`/verify?prefill=${encodeURIComponent(certId.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tighter text-blue-600">SLUG</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/events" className="text-sm font-medium text-gray-600 hover:text-blue-600">Events</Link>
            <Link href="/verify" className="text-sm font-medium text-gray-600 hover:text-blue-600">Verify Certificate</Link>
            <Link href="/gallery" className="text-sm font-medium text-gray-600 hover:text-blue-600">Gallery</Link>
            <Link href="/announcements" className="text-sm font-medium text-gray-600 hover:text-blue-600">Announcements</Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-blue-600">About</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8">
              Open Source. <span className="text-blue-600">Learn.</span> <span className="text-purple-600">Build.</span> Share.
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              The official event management and certificate verification platform for the Sapthagiri Libre-Software Users Group.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/events" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                Explore Events
              </Link>
              <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold border-2 border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 mr-2" /> Verify Certificate
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Verification Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Have a certificate?</h2>
            <div className="bg-white p-2 rounded-2xl shadow-sm border flex flex-col sm:flex-row">
              <div className="flex-1 flex items-center px-4 py-3 sm:py-0">
                <Search className="text-gray-400 w-5 h-5 mr-3" />
                <input 
                  type="text" 
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  placeholder="Enter Certificate ID (e.g. SLUG-2026-0001)" 
                  className="w-full focus:outline-none text-gray-700"
                />
              </div>
              <button onClick={handleVerify} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl m-1 hover:bg-blue-700 transition">
                Verify
              </button>
            </div>
            <Link href="/scanner" className="mt-6 inline-block text-sm text-gray-500 font-medium hover:text-blue-600 transition">
              Or scan QR Code using your camera →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-white font-bold text-xl mb-4">Sapthagiri Libre-Software Users Group</h3>
          <p className="mb-8">Empowering students through open source.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/past-events" className="hover:text-white">Past Events</Link>
            <Link href="/admin/login" className="hover:text-white">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
