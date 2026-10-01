"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteMenu({ 
  endpoint, 
  itemType = "item",
  onDeleted
}: { 
  endpoint: string;
  itemType?: string;
  onDeleted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
      setOpen(false);
      return;
    }
    
    setDeleting(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        if (onDeleted) onDeleted();
        else {
          router.refresh();
          // Force a small delay then reload if router.refresh is not enough
          setTimeout(() => window.location.reload(), 500);
        }
      } else {
        alert("Failed to delete.");
      }
    } catch {
      alert("Error occurred.");
    }
    setDeleting(false);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition focus:outline-none"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-xl z-50 py-1">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(); }}
            disabled={deleting}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
