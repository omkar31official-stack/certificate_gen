"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function NewAnnouncementForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async () => {
    if (!title || !content) return;
    setCreating(true);
    try {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      setTitle("");
      setContent("");
      setShowForm(false);
      window.location.reload();
    } catch {
      alert("Failed to create announcement");
    }
    setCreating(false);
  };

  return (
    <>
      <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center shadow-sm transition">
        <Plus className="w-5 h-5 mr-1" /> New Announcement
      </button>

      {showForm && (
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 col-span-full w-full mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <button onClick={handleCreate} disabled={creating} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
            {creating ? "Creating..." : "Publish Announcement"}
          </button>
        </div>
      )}
    </>
  );
}
