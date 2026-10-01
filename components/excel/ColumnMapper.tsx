"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ColumnMapperProps {
  excelHeaders: string[];
  requiredFields: string[]; // e.g. ["Full Name", "Email"]
  onComplete: (mapping: Record<string, string>) => void;
}

export default function ColumnMapper({ excelHeaders, requiredFields, onComplete }: ColumnMapperProps) {
  // mapping state: required field -> excel header
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleMap = (field: string, header: string) => {
    setMapping(prev => ({ ...prev, [field]: header }));
  };

  const isComplete = requiredFields.every(field => mapping[field]);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-lg mb-2">Map Excel Columns</h3>
      <p className="text-gray-500 text-sm mb-6">
        We found {excelHeaders.length} columns in your uploaded file. Match them to the required certificate fields.
      </p>

      <div className="space-y-4">
        {requiredFields.map(field => (
          <div key={field} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="w-1/3">
              <span className="font-medium text-gray-900">{field}</span>
              <span className="text-red-500 ml-1">*</span>
            </div>
            
            <ArrowRight className="w-5 h-5 text-gray-400" />
            
            <div className="w-1/2">
              <select 
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${mapping[field] ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                value={mapping[field] || ""}
                onChange={(e) => handleMap(field, e.target.value)}
              >
                <option value="" disabled>Select column...</option>
                {excelHeaders.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>
            
            <div className="w-8 flex justify-end">
              {mapping[field] && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          disabled={!isComplete}
          onClick={() => onComplete(mapping)}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition shadow-sm"
        >
          Confirm Mapping & Preview Data
        </button>
      </div>
    </div>
  );
}
