"use client";

import { useState, useEffect } from "react";
import { type CVData } from "@/lib/types";
import { AlertCircle, CheckCircle } from "lucide-react";

interface JsonEditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export default function JsonEditor({ data, onChange }: JsonEditorProps) {
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(data, null, 2)
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJsonText(JSON.stringify(data, null, 2));
  }, [data]);

  const handleChange = (value: string) => {
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      if (
        parsed.personalInfo &&
        parsed.experience &&
        parsed.education
      ) {
        setError(null);
        onChange(parsed as CVData);
      } else {
        setError(
          "El JSON debe contener las propiedades: personalInfo, experience, education"
        );
      }
    } catch {
      setError("JSON inválido");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 rounded-t-xl border border-b-0 border-gray-700">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Editor JSON
        </span>
        <div className="flex items-center gap-1.5">
          {error ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-red-400">Error</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400">Válido</span>
            </>
          )}
        </div>
      </div>
      <textarea
        value={jsonText}
        onChange={(e) => handleChange(e.target.value)}
        className={`flex-1 w-full p-4 bg-gray-950 text-emerald-400 font-mono text-sm leading-relaxed rounded-b-xl border resize-none focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-500/50 focus:ring-red-500/30"
            : "border-gray-700 focus:ring-emerald-500/30"
        }`}
        style={{ minHeight: "calc(100vh - 18rem)" }}
        spellCheck={false}
      />
      {error && (
        <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
