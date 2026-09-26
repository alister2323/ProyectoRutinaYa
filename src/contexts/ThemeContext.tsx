import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  // Indica si el modo oscuro está activo en este momento.
  isDark: boolean;
  // Cambia entre tema claro y oscuro.
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Guarda el tema para que todas las pantallas puedan usar el mismo estado.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // En web invertimos los colores de la página completa cuando se activa el tema oscuro.
    if (typeof document === 'undefined') return;
    document.body.style.filter = isDark ? 'invert(1) hue-rotate(180deg)' : 'none';
    document.body.style.backgroundColor = isDark ? '#000000' : '#f8fafc';
    return () => {
      document.body.style.filter = 'none';
      document.body.style.backgroundColor = '';
    };
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark((current) => !current) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  // Este hook evita importar el contexto directamente en cada pantalla.
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe utilizarse dentro de ThemeProvider');
  return context;
}