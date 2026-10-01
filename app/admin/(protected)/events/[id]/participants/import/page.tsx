"use client";

import Link from "next/link";
import { ArrowLeft, FileSpreadsheet, Upload, CheckCircle } from "lucide-react";
import { useState, use } from "react";
import * as xlsx from "xlsx";

export default function ImportParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = xlsx.read(bstr, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(ws);
        if (data.length > 0) {
          setHeaders(Object.keys(data[0] as object));
          setRows(data);
          setSuccess(false);
        }
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      // Find possible columns
      const nameCol = headers.find(h => h.toLowerCase().includes('name')) || headers[0];
      const emailCol = headers.find(h => h.toLowerCase().includes('email')) || headers[1];

      const payload = rows.map(r => ({
        fullName: r[nameCol] || "Unknown",
        email: r[emailCol] || "noemail@example.com",
      })).filter(r => r.email && r.email !== "noemail@example.com");

      const res = await fetch(`/api/events/${id}/participants/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants: payload })
      });
      
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    }
    setIsImporting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <Link href={`/admin/events/${id}/participants`} className="text-gray-500 hover:text-gray-900 bg-white p-2 rounded-full border shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Import Participants</h1>
      </div>
      
      <div className="bg-white p-12 border rounded-2xl shadow-sm text-center">
        {success ? (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 flex items-center justify-center rounded-full mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Import Successful!</h2>
            <p className="text-gray-500 mb-8">Your participants have been added to the database.</p>
            <Link href={`/admin/events/${id}/participants`} className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg">
              View Participants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center rounded-full mb-4">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Excel / CSV</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We will automatically detect the Name and Email columns. Make sure your file contains headers.
            </p>
            
            {!rows.length ? (
              <label className="bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 text-gray-600 font-bold py-8 px-8 rounded-xl cursor-pointer transition flex flex-col items-center justify-center space-y-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span>Click to browse files</span>
                <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleUpload} />
              </label>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border text-left">
                  <p className="font-bold text-gray-900">Found {rows.length} rows.</p>
                  <p className="text-sm text-gray-500">Detected columns: {headers.join(', ')}</p>
                </div>
                <button onClick={handleImport} disabled={isImporting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition w-full disabled:bg-blue-400">
                  {isImporting ? "Importing..." : "Confirm & Import to Database"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
