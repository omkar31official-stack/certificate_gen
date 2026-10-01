"use client";

import { useState, use } from "react";
import { ArrowLeft, Check, Upload as UploadIcon, Settings, Image as ImageIcon, Send, FileText } from "lucide-react";
import Link from "next/link";
import ColumnMapper from "@/components/excel/ColumnMapper";
import TemplateEditor, { EditorField } from "@/components/certificates/TemplateEditor";
import * as xlsx from "xlsx";

export default function CertificateWizard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [step, setStep] = useState(1);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<EditorField[]>([]);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [excelRows, setExcelRows] = useState<any[]>([]);
  const [mappedColumns, setMappedColumns] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, name: "Upload Template", icon: ImageIcon },
    { id: 2, name: "Design Canvas", icon: Settings },
    { id: 3, name: "Upload Excel", icon: FileText },
    { id: 4, name: "Map Columns", icon: UploadIcon },
    { id: 5, name: "Generate & Send", icon: Send },
  ];

  // Dummy functions to simulate uploads for the wizard frontend
  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Create local preview immediately
      const url = URL.createObjectURL(e.target.files[0]);
      setTemplateUrl(url);
      setStep(2);
      
      // Upload to server (for real)
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) setTemplateUrl(data.url); // Replace blob with real URL
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = xlsx.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws);
        if (data.length > 0) {
          setExcelHeaders(Object.keys(data[0] as object));
          setExcelRows(data);
          setStep(4);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Map the excel rows to the required format
      const finalPayload = excelRows.map(row => ({
        FullName: row[mappedColumns["FullName"]],
        Email: row[mappedColumns["Email"]],
        ...row // include original data as customData
      }));

      const res = await fetch(`/api/events/${id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mappedData: finalPayload, templateFields: fields, templateUrl })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Success! Check the Event Dashboard to see your certificates generating.");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("An error occurred during generation.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-4">
        <Link href={`/admin/events/${id}`} className="text-gray-500 hover:text-gray-900 bg-white p-2 rounded-full border shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificate Generation Wizard</h1>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex justify-between relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isCompleted = step > s.id;
          
          return (
            <div key={s.id} className="flex flex-col items-center z-10 w-1/5 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                isActive ? "bg-blue-600 border-blue-600 text-white" : 
                isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-400"
              }`}>
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs mt-2 font-medium ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"}`}>
                {s.name}
              </span>
              
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-[2px] ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} style={{ zIndex: -1 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="mt-8">
        
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center rounded-full mb-4">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Blank Template</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Upload a PNG, JPG, or PDF file of your certificate without any participant names on it.
            </p>
            <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg cursor-pointer transition shadow-sm inline-block">
              Choose File
              <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleTemplateUpload} />
            </label>
          </div>
        )}

        {step === 2 && templateUrl && (
          <TemplateEditor 
            templateUrl={templateUrl} 
            onSave={(savedFields) => {
              setFields(savedFields);
              setStep(3);
            }} 
          />
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 flex items-center justify-center rounded-full mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Participant Data</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Upload your Excel (.xlsx) or CSV file containing the list of participants.
            </p>
            <label className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg cursor-pointer transition shadow-sm inline-block">
              Upload Excel File
              <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} />
            </label>
          </div>
        )}

        {step === 4 && excelHeaders.length > 0 && (
          <ColumnMapper 
            excelHeaders={excelHeaders} 
            requiredFields={["FullName", "Email"]} // You can dynamically extract this from the template fields later
            onComplete={(mapping) => {
              setMappedColumns(mapping);
              setStep(5);
            }}
          />
        )}

        {step === 5 && (
          <div className="bg-white rounded-2xl border shadow-sm p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-purple-50 text-purple-600 flex items-center justify-center rounded-full mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Ready to Generate!</h2>
            {successMessage ? (
              <div className="p-4 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200">
                {successMessage}
              </div>
            ) : (
              <>
                <p className="text-gray-500 max-w-lg mx-auto">
                  You are about to generate certificates. 
                  The system will automatically create unique IDs, attach QR codes, and prepare the emails.
                </p>
                <div className="flex justify-center space-x-4 pt-4">
                  <button onClick={handleGenerate} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-8 rounded-lg transition shadow-sm">
                    {isGenerating ? "Generating..." : "Generate & Send All"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
