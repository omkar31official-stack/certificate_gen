"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Save, Move } from "lucide-react";

export interface EditorField {
  id: string;
  type: string;
  value: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
}

interface TemplateEditorProps {
  templateUrl: string;
  initialFields?: EditorField[];
  onSave: (fields: EditorField[]) => void;
}

export default function TemplateEditor({ templateUrl, initialFields = [], onSave }: TemplateEditorProps) {
  const [fields, setFields] = useState<EditorField[]>(initialFields);
  const [activeField, setActiveField] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addField = () => {
    const newField: EditorField = {
      id: Math.random().toString(36).substr(2, 9),
      type: "text",
      value: "{{full_name}}",
      x: 50,
      y: 50,
      fontSize: 48,
      color: "#000000",
      fontFamily: "Helvetica"
    };
    setFields([...fields, newField]);
    setActiveField(newField.id);
  };

  const updateField = (id: string, updates: Partial<EditorField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (activeField === id) setActiveField(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4 rounded-xl border flex justify-center">
        <div 
          ref={containerRef}
          className="relative bg-white shadow-lg overflow-hidden" 
          style={{ width: '800px', height: '600px', backgroundImage: `url(${templateUrl})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
        >
          {fields.map(field => (
            <div
              key={field.id}
              onClick={() => setActiveField(field.id)}
              className={`absolute cursor-move px-2 py-1 border-2 ${activeField === field.id ? 'border-blue-500 bg-blue-50/50' : 'border-transparent hover:border-gray-300'}`}
              style={{
                left: `${field.x}%`,
                top: `${field.y}%`,
                fontSize: `${field.fontSize}px`,
                color: field.color,
                fontFamily: field.fontFamily || "sans-serif",
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap'
              }}
            >
              {field.value}
            </div>
          ))}
        </div>
      </div>

      {/* Controls Area */}
      <div className="w-full lg:w-[350px] bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-4">Template Fields</h3>
          <button 
            onClick={addField}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg flex items-center justify-center transition"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Dynamic Field
          </button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {fields.map(field => (
            <div key={field.id} className={`p-3 rounded-lg border ${activeField === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center mb-3">
                <input 
                  type="text" 
                  value={field.value}
                  onChange={(e) => updateField(field.id, { value: e.target.value })}
                  className="font-mono text-sm border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent w-2/3 pb-1"
                />
                <button onClick={() => removeField(field.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Font Family</label>
                  <select 
                    value={field.fontFamily || "Helvetica"} 
                    onChange={(e) => updateField(field.id, { fontFamily: e.target.value })}
                    className="w-full border rounded p-1.5 mt-1 bg-white"
                  >
                    <option value="Helvetica">Helvetica</option>
                    <option value="Helvetica-Bold">Helvetica Bold</option>
                    <option value="TimesRoman">Times Roman</option>
                    <option value="TimesRoman-Bold">Times Bold</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Font Size</label>
                  <input type="number" value={field.fontSize} onChange={(e) => updateField(field.id, { fontSize: Number(e.target.value) })} className="w-full border rounded p-1.5 mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <label className="text-xs text-gray-500">X (%)</label>
                  <input type="number" step="0.1" value={field.x} onChange={(e) => updateField(field.id, { x: Number(e.target.value) })} className="w-full border rounded p-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Y (%)</label>
                  <input type="number" step="0.1" value={field.y} onChange={(e) => updateField(field.id, { y: Number(e.target.value) })} className="w-full border rounded p-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Color</label>
                  <input type="color" value={field.color} onChange={(e) => updateField(field.id, { color: e.target.value })} className="w-full h-8 border rounded cursor-pointer p-0.5" />
                </div>
              </div>
            </div>
          ))}
          {fields.length === 0 && <p className="text-sm text-gray-500 text-center italic py-4">No fields added yet.</p>}
        </div>

        <div className="pt-4 border-t">
          <button 
            onClick={() => onSave(fields)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition shadow-sm"
          >
            <Save className="w-5 h-5 mr-2" /> Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
