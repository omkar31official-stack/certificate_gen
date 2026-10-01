"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function GalleryUploadButton() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        // Save to gallery via API
        await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: data.url, type: "Image" }),
        });
        window.location.reload();
      }
    } catch {
      alert("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  return (
    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center shadow-sm cursor-pointer transition">
      <Upload className="w-5 h-5 mr-2" /> {uploading ? "Uploading..." : "Upload Image"}
      <input type="file" className="hidden" accept="image/*,video/*" onChange={handleUpload} disabled={uploading} />
    </label>
  );
}
