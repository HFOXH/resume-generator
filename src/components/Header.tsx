"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Languages, FileText, ChevronRight } from "lucide-react";

export default function Header() {
  const { t, toggleLanguage, locale } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <FileText className="w-5 h-5 text-white" strokeWidth={2.25} />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-gray-900 leading-tight tracking-tight">
              {t("appTitle")}
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block font-medium">
              {t("appSubtitle")}
            </p>
          </div>
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          className="group relative flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-full border border-gray-200/80 bg-white/50 hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 text-sm font-medium text-gray-600 hover:text-white overflow-hidden"
        >
          <Languages className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
          <span className="tabular-nums">{locale === "es" ? "EN" : "ES"}</span>
          <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300" />
        </button>
      </div>
    </header>
  );
}