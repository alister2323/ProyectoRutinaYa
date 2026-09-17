import { I18n } from "i18n-js";
import React, { createContext, useContext, useState } from "react";
import { translations } from "../utils/translations/translations";

export type Language = "es" | "en";

export type LanguageContextType = {
  language: Language;
  changeLanguage: (lng: Language) => void;
  clearLanguage: () => void;
  t: (key: string) => string;
};

// 1. Definicion de diccionario de traducciones en /utils
// 2. Crear la instancia de i18n con el diccionario cargado
export const i18n = new I18n(translations);

// 3. Definir propiedades: idioma por defecto, habilitar fallback
i18n.defaultLocale = "es";
i18n.enableFallback = true;
i18n.locale = "es";

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("es");

  const changeLanguage = (lng: Language) => {
    setLanguage(lng);
    // Asignacion de idioma activo en i18n
    i18n.locale = lng;
  };

  const clearLanguage = () => {
    setLanguage("es");
    i18n.locale = "es";
  };

  const t = (key: string): string => {
    const dict = (translations as any)[language] || (translations as any)["es"];
    return dict?.[key] || (i18n.t ? i18n.t(key) : key);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, clearLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage debe utilizarse dentro del LanguageProvider");
  }
  return context;
};
