export interface HabitItem {
  id: string;
  name: string;
  color: string;
  targetAmount?: string;
  frequency: string;
  currentStreak: number;
  completedToday: boolean;
  history?: Record<string, boolean>; // e.g. 'Lun': true
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
}

export type ActiveTab = 'hoy' | 'resumen' | 'nuevo' | 'perfil';
export type AppScreen = 'login' | 'register' | 'tabs';
