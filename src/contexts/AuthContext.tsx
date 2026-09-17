import React, { createContext, useContext, useState } from "react";

// 1. Tipado del objeto principal del contexto
export type User = {
  email: string;
  authToken?: string;
  sessionToken?: string;
  role?: string;
} | null;

export type AuthContextType = {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
};

// 2. Creacion del contexto 
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Creacion del provider: medio por el cual manejamos el estado desde otras pantallas
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Declaracion del estado de usuario
  const [user, setUser] = useState<User>(null);

  const login = (email: string): boolean => {
    const isAllowed = email.endsWith(".edu") || email.includes("@");
    if (isAllowed) {
      setUser({ email });
    }
    return isAllowed;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook personalizado: exposicion del contexto a componentes de la aplicacion
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
  }
  return context;
};
