"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";

export default function ProcessQueueButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ processed: number; failed: number } | null>(null);

  const handleProcess = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/cron/process-email-queue");
      const data = await res.json();
      if (data.success) {
        setResult({ processed: data.processed || 0, failed: data.failed || 0 });
        // Optional: reload the page to show updated statuses after a short delay
        setTimeout(() => window.location.reload(), 2000);
      } else {
        alert("Failed to process queue: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Failed to trigger process-email-queue endpoint.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4">
      {result && (
        <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
          Sent {result.processed} emails ({result.failed} failed). Reloading...
        </span>
      )}
      <button
        onClick={handleProcess}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center shadow-sm disabled:opacity-50 transition"
      >
        {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
        Process Queue Manually
      </button>
    </div>
  );
}
