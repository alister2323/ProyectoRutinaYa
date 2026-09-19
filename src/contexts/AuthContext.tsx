import React, { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase";

export type User = {
  email: string;
  authToken?: string;
  sessionToken?: string;
  role?: string;
} | null;

export type AuthContextType = {
  user: User;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      setUser({
        email: data.user.email ?? email,
        authToken: data.session?.access_token,
        sessionToken: data.session?.refresh_token,
        role: data.user.role ?? "user",
      });
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      setUser({
        email: data.user.email ?? email,
        authToken: data.session?.access_token,
        sessionToken: data.session?.refresh_token,
        role: data.user.role ?? "user",
      });
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
  }
  return context;
};