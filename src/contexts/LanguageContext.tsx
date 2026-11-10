"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import idDict from "@/locales/id.json";
import enDict from "@/locales/en.json";

type Language = "ID" | "EN";
type Dictionary = typeof idDict;

interface LanguageContextType {
  lang: Language;
  t: Dictionary;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("ID");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_lang") as Language;
    if (saved === "ID" || saved === "EN") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("preferred_lang", newLang);
  };

  const toggleLang = () => {
    setLang(lang === "ID" ? "EN" : "ID");
  };

  const t = lang === "ID" ? idDict : enDict;

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, setLang }}>
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
