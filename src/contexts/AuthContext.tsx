// React permite crear un contexto para compartir la sesión entre pantallas.
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// Cliente encargado de hablar con la autenticación de Supabase.
import { supabase } from "../lib/supabase";

export type User = {
  // Estos son los datos del usuario que sí necesita mostrar la aplicación.
  id: string;
  email: string;
  name?: string;
  phone?: string;
  authToken?: string;
  sessionToken?: string;
  role?: string;
} | null;

export type AuthContextType = {
  user: User;
  loading: boolean;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  login: (email: string, password: string) => Promise<NonNullable<User>>;
  updateProfile: (name: string, phone: string) => Promise<void>;
  ensureSession: () => Promise<NonNullable<User>>;
  logout: () => Promise<void>;
};

function toUser(
  sessionUser: { id: string; email?: string; role?: string; user_metadata?: { name?: string; phone?: string } },
  accessToken?: string,
  refreshToken?: string,
): NonNullable<User> {
  // Convierte el usuario de Supabase al formato que utiliza la aplicación.
  return {
    id: sessionUser.id,
    email: sessionUser.email ?? '',
    name: sessionUser.user_metadata?.name,
    phone: sessionUser.user_metadata?.phone,
    authToken: accessToken,
    sessionToken: refreshToken,
    role: sessionUser.role ?? 'user',
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Comparte la sesión y la restaura automáticamente al abrir la aplicación.
  // null significa que todavía no hay una persona conectada.
  const [user, setUser] = useState<User>(null);
  const userRef = useRef<User>(null);
  // Mientras es true, Supabase todavía está revisando si existe una sesión guardada.
  const [loading, setLoading] = useState(true);

  const updateUser = (nextUser: User) => {
    userRef.current = nextUser;
    setUser(nextUser);
  };

  const ensureSession = async () => {
    const current = await supabase.auth.getSession();
    if (current.error) throw current.error;
    if (current.data.session?.user) {
      const authenticatedUser = toUser(
        current.data.session.user,
        current.data.session.access_token,
        current.data.session.refresh_token,
      );
      updateUser(authenticatedUser);
      return authenticatedUser;
    }

    throw new Error('No hay una sesión activa en Supabase. Vuelve a iniciar sesión.');
  };

  useEffect(() => {
    // Restaura la sesión una vez al abrir. En Expo Web los eventos de Auth pueden
    // duplicarse durante Fast Refresh y no deben limpiar los hábitos en pantalla.
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.warn('No se pudo restaurar la sesión:', error.message);
        if (!userRef.current) updateUser(null);
      } else if (data.session?.user) {
        updateUser(toUser(data.session.user, data.session.access_token, data.session.refresh_token));
      } else if (!userRef.current) {
        // No sobrescribas un login que haya terminado mientras getSession() estaba pendiente.
        updateUser(null);
      }
    }).finally(() => setLoading(false));
  }, []);

  const register = async (email: string, password: string, name: string, phone: string) => {
    // Crea la cuenta y guarda nombre y teléfono en los metadatos de Supabase Auth.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
      },
    });

    if (error) throw error;

    if (!data.user || !data.session) {
      setUser(null);
      throw new Error('Cuenta creada. Confirma tu correo antes de iniciar sesión.');
    }

    updateUser(toUser(data.user, data.session.access_token, data.session.refresh_token));
  };

  const login = async (email: string, password: string) => {
    // Valida las credenciales y carga los datos del usuario autenticado.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user && data.session) {
      const authenticatedUser = toUser(data.user, data.session.access_token, data.session.refresh_token);
      updateUser(authenticatedUser);
      return authenticatedUser;
    }

    throw new Error('No se pudo obtener la sesión');
  };

  const updateProfile = async (name: string, phone: string) => {
    const { data, error } = await supabase.auth.updateUser({ data: { name, phone } });
    if (error) throw error;
    if (data.user) updateUser(toUser(data.user));
  };


  const logout = async () => {
    // Cierra la sesión en Supabase y limpia el usuario local.
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    updateUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, updateProfile, ensureSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // Permite consumir la sesión desde cualquier componente autorizado.
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
  }
  return context;
};