"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import CVForm from "@/components/CVForm";
import CVPreview from "@/components/CVPreview";
import ATSChecker from "@/components/ATSChecker";
import { useLanguage } from "@/context/LanguageContext";
import { type CVData, emptyCVData } from "@/lib/types";
import { generatePDF } from "@/lib/generatePDF";
import { checkATS, type ATSResult } from "@/lib/atsChecker";
import {
  Download,
  Eye,
  PenLine,
  Trash2,
  Upload,
  Save,
  Shield,
} from "lucide-react";

type ViewMode = "form" | "preview";

export default function Home() {
  const { t, locale } = useLanguage();
  const [cvData, setCvData] = useState<CVData>(emptyCVData);
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const [downloading, setDownloading] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const cvRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      generatePDF(cvData, locale);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(cvData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = cvData.personalInfo.fullName
      ? `CV_${cvData.personalInfo.fullName.replace(/\s+/g, "_")}.json`
      : locale === "es"
        ? "Mi_CV.json"
        : "My_CV.json";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = JSON.parse(event.target?.result as string);
        if (result.personalInfo && result.experience && result.education) {
          setCvData(result);
        } else {
          alert(
            locale === "es"
              ? "El archivo JSON no tiene un formato de CV válido."
              : "The JSON file does not have a valid CV format."
          );
        }
      } catch {
        alert(
          locale === "es"
            ? "Error al leer el archivo. Asegúrate de que sea un JSON válido."
            : "Error reading file. Make sure it is a valid JSON."
        );
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const clearAll = () => {
    if (window.confirm(t("confirmClear"))) {
      setCvData(emptyCVData);
    }
  };

  const handleATSCheck = () => {
    const result = checkATS(cvData);
    setAtsResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            {locale === "es"
              ? "Crea tu CV Profesional en Minutos"
              : "Create Your Professional CV in Minutes"}
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {locale === "es"
              ? "Generador de Curriculum Vitae en formato Harvard. Gratuito, moderno, compatible con ATS y con descarga en PDF. Cambia entre español e inglés al instante."
              : "Harvard format CV generator. Free, modern, ATS-friendly with PDF download. Switch between English and Spanish instantly."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-blue-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              {locale === "es" ? "100% Gratuito" : "100% Free"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              {locale === "es" ? "Compatible ATS" : "ATS Compatible"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              {locale === "es" ? "Descarga PDF" : "PDF Download"}
            </span>
          </div>
        </div>
      </section>

      {/* Mobile view toggle */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-2 flex gap-2">
        <button
          onClick={() => setViewMode("form")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            viewMode === "form"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <PenLine className="w-4 h-4" />
          {t("editForm")}
        </button>
        <button
          onClick={() => setViewMode("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            viewMode === "preview"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Eye className="w-4 h-4" />
          {t("preview")}
        </button>
      </div>

      {/* Action buttons */}
      <div className="sticky top-16 lg:top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-end gap-2 flex-wrap">
          <button
            onClick={handleATSCheck}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all"
            title={t("atsTitle")}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">{t("atsTitle")}</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            title={t("exportJson")}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{t("exportJson")}</span>
          </button>
          <button
            onClick={handleImportJSON}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all"
            title={t("importJson")}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">{t("importJson")}</span>
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t("clearAll")}</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {downloading
              ? locale === "es"
                ? "Generando..."
                : "Generating..."
              : t("downloadPdf")}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Form panel */}
          <div
            className={`w-full lg:w-[45%] flex-shrink-0 ${
              viewMode === "form" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 custom-scrollbar">
              <CVForm data={cvData} onChange={setCvData} />
            </div>
          </div>

          {/* Preview panel */}
          <div
            className={`flex-1 min-w-0 ${
              viewMode === "preview" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex justify-center overflow-x-auto">
              <CVPreview ref={cvRef} data={cvData} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile download button */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
        <button
          onClick={() => {
            setViewMode("preview");
            setTimeout(handleDownloadPDF, 300);
          }}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold shadow-2xl shadow-blue-300/50 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {downloading
            ? locale === "es"
              ? "Generando..."
              : "Generating..."
            : t("downloadPdf")}
        </button>
      </div>
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          &copy; 2026 Santiago Cárdenas. Made with Next.js, coffee ☕ &amp; Love ❤️.
        </div>
      </footer>

      {/* ATS Checker Modal */}
      {atsResult && (
        <ATSChecker result={atsResult} onClose={() => setAtsResult(null)} />
      )}
    </div>
  );
}
