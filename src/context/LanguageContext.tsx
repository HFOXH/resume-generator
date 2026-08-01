"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Locale, type TranslationKey } from "@/lib/translations";

interface LanguageContextType {
  locale: Locale;
  t: (key: TranslationKey) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key;
  };

  const toggleLanguage = () => {
    setLocale((prev) => (prev === "es" ? "en" : "es"));
  };

  return (
    <LanguageContext.Provider value={{ locale, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
