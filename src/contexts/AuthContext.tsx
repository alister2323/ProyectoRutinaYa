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
    // Recupera la sesión guardada y escucha cambios de autenticación.
    // Recupera la sesión guardada cuando la aplicación vuelve a abrirse.
    let authEventDuringInitialization = false;

    // Primero escucha cambios para no perder un login que ocurra mientras se carga la sesión.
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventDuringInitialization = true;
      if (session?.user) {
        updateUser(toUser(session.user, session.access_token, session.refresh_token));
        return;
      }

      // No intentes restaurar aquí: setSession() vuelve a emitir este evento y provocaría un ciclo.
      // La recuperación se hace únicamente cuando la persona guarda un hábito o una meta.
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.warn('No se pudo restaurar la sesión:', error.message);
        if (!authEventDuringInitialization) updateUser(null);
      } else if (data.session?.user) {
        updateUser(toUser(data.session.user, data.session.access_token, data.session.refresh_token));
      } else if (!authEventDuringInitialization) {
        // Solo limpia el usuario si ningún evento de login/logout ocurrió durante la carga.
        updateUser(null);
      }
    }).finally(() => setLoading(false));

    return () => authListener.subscription.unsubscribe();
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


  const logout = async () => {
    // Cierra la sesión en Supabase y limpia el usuario local.
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    updateUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, ensureSession, logout }}>
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