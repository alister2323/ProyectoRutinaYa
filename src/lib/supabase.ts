// Importa la función que crea la conexión con Supabase.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Lee las credenciales públicas de Expo para identificar el proyecto de Supabase.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Evita un error poco claro si todavía no se configuraron las variables.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error(
		'Faltan EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY. Crea un archivo .env en ProyectoRutinaYa y copia los valores de Supabase.',
	);
}

// Reutiliza el cliente durante Fast Refresh para evitar varios listeners de Auth.
const globalScope = globalThis as typeof globalThis & {
	__rutinayaSupabase?: SupabaseClient;
};

// Persistimos la sesión en las tres plataformas, pero cada una con SU storage nativo:
// - web: localStorage (el que Supabase espera de forma nativa en navegador).
// - iOS/Android: AsyncStorage (no existe localStorage ahí).
// Usar AsyncStorage en web causaba un bucle infinito de refresh (eventos de "otra pestaña" falsos).
export const supabase = globalScope.__rutinayaSupabase ?? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		storage: Platform.OS === 'web' ? window.localStorage : AsyncStorage,
		storageKey: 'rutinaya-auth-session',
		persistSession: true,
		autoRefreshToken: false,
		detectSessionInUrl: false,
	},
});

globalScope.__rutinayaSupabase = supabase;