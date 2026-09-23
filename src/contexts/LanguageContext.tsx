// Librería que permite buscar textos según el idioma elegido.
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
// Carga los textos en español e inglés desde el archivo de traducciones.
export const i18n = new I18n(translations);

// 3. Definir propiedades: idioma por defecto, habilitar fallback
i18n.defaultLocale = "es";
i18n.enableFallback = true;
i18n.locale = "es";

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Guarda el idioma activo y lo comparte con todas las pantallas.
  // Proporciona el idioma activo y las funciones de traducción a toda la aplicación.
  const [language, setLanguage] = useState<Language>("es");

  // Cambia el idioma actual y actualiza la instancia de i18n.
  const changeLanguage = (lng: Language) => {
    setLanguage(lng);
    // Asignacion de idioma activo en i18n
    i18n.locale = lng;
  };

  // Restablece el idioma predeterminado en español.
  const clearLanguage = () => {
    setLanguage("es");
    i18n.locale = "es";
  };

  // Busca una traducción y usa español o la clave como respaldo si no existe.
  const t = (key: string): string => {
    // Recibe una clave como "saveHabit" y devuelve el texto traducido.
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
  // Expone el contexto de idioma y avisa si se usa fuera de su proveedor.
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage debe utilizarse dentro del LanguageProvider");
  }
  return context;
};