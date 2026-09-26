// React permite guardar los hábitos en un estado compartido.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { HabitItem, Subtask } from '../components/HabitCard';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

type HabitContextType = {
  // Estas funciones son las acciones que las pantallas pueden pedirle al contexto.
  habits: HabitItem[];
  loading: boolean;
  monthlyGoal: number | null;
  setMonthlyGoal: (targetDays: number) => Promise<void>;
  addHabit: (habit: Omit<HabitItem, 'id' | 'isPaused' | 'currentStreak' | 'completedToday' | 'history'>, userIdOverride?: string) => Promise<void>;
  updateHabit: (id: string, habit: Omit<HabitItem, 'id' | 'isPaused' | 'currentStreak' | 'completedToday' | 'history'>) => Promise<void>;
  toggleHabit: (id: string, reflection?: string) => Promise<void>;
  toggleSubtask: (habitId: string, subtaskId: string) => Promise<void>;
  pauseHabit: (id: string) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
};

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  // Centraliza hábitos, historial y operaciones sincronizadas con Supabase.
  const { user, ensureSession } = useAuth();
  // Lista local de hábitos; se actualiza después de cada operación en Supabase.
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthlyGoal, setMonthlyGoalValue] = useState<number | null>(null);

  // Devuelve la fecha actual con el formato que usa la tabla: AAAA-MM-DD.
  const today = () => new Date().toISOString().slice(0, 10);
  const currentMonthStart = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  };

  useEffect(() => {
    // Recarga los datos cuando cambia la cuenta autenticada.
    if (!user) {
      setHabits([]);
      setMonthlyGoalValue(null);
      return;
    }

    const loadHabits = async () => {
      // Obtiene en paralelo los hábitos y las fechas que se han completado.
      setLoading(true);
      const monthStartKey = currentMonthStart();
      // Carga hábitos, días cumplidos y meta mensual al mismo tiempo.
      const [{ data: habitRows, error: habitsError }, { data: completionRows, error: completionsError }, { data: goalRow, error: goalError }] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        supabase.from('habit_completions').select('habit_id, completed_on, reflection').eq('user_id', user.id),
        supabase.from('monthly_goals').select('target_days').eq('user_id', user.id).eq('month_start', monthStartKey).maybeSingle(),
      ]);

      if (habitsError || completionsError) {
        console.warn('No se pudieron cargar los hábitos:', habitsError ?? completionsError);
        setLoading(false);
        return;
      }

      const historyByHabit: Record<string, Record<string, boolean>> = {};
      const notesByHabit: Record<string, Record<string, string>> = {};
      (completionRows ?? []).forEach((completion) => {
        historyByHabit[completion.habit_id] ??= {};
        historyByHabit[completion.habit_id][completion.completed_on] = true;
        if (completion.reflection) {
          notesByHabit[completion.habit_id] ??= {};
          notesByHabit[completion.habit_id][completion.completed_on] = completion.reflection;
        }
      });

      setHabits((habitRows ?? []).map((habit) => {
        const history = historyByHabit[habit.id] ?? {};
        return {
          id: habit.id,
          name: habit.name,
          color: habit.color,
          targetAmount: habit.target_amount ?? undefined,
          note: habit.note ?? undefined,
          difficulty: habit.difficulty ?? 'medium',
          tags: Array.isArray(habit.tags) ? habit.tags : [],
          frequency: habit.frequency,
          category: habit.category ?? 'productivity',
          quantity: habit.quantity ?? undefined,
          unit: habit.unit ?? undefined,
          priority: habit.priority ?? 2,
          scheduledDays: Array.isArray(habit.scheduled_days) ? habit.scheduled_days : [],
          subtasks: Array.isArray(habit.subtasks) ? habit.subtasks : [],
          isPaused: Boolean(habit.is_paused),
          history,
          completionNotes: notesByHabit[habit.id] ?? {},
          completedToday: Boolean(history[today()]),
          currentStreak: calculateStreak(history),
        };
      }));
      if (!goalError) setMonthlyGoalValue(goalRow?.target_days ?? null);
      setLoading(false);
    };

    loadHabits();
  }, [user]);

  const setMonthlyGoal = async (targetDays: number) => {
    if (!Number.isFinite(targetDays) || targetDays < 1) return;
    const authenticatedUser = await ensureSession();
    const userId = authenticatedUser.id;
    const monthStartKey = currentMonthStart();
    const { data, error } = await supabase.from('monthly_goals').upsert({
      user_id: userId,
      month_start: monthStartKey,
      target_days: Math.round(targetDays),
    }, { onConflict: 'user_id,month_start' }).select('target_days').single();
    if (error) throw error;
    setMonthlyGoalValue(data.target_days);
  };

  const addHabit = async (habit: Omit<HabitItem, 'id' | 'isPaused' | 'currentStreak' | 'completedToday' | 'history'>, userIdOverride?: string) => {
    // Guarda un hábito nuevo y lo añade inmediatamente a la lista local.
    const authenticatedUser = await ensureSession();
    const userId = authenticatedUser.id;
    const { data, error } = await supabase.from('habits').insert({
      user_id: userId,
      name: habit.name,
      target_amount: habit.targetAmount ?? null,
      note: habit.note ?? null,
      color: habit.color,
      frequency: habit.frequency,
      category: habit.category,
      quantity: habit.quantity ?? null,
      unit: habit.unit ?? null,
      priority: habit.priority,
      difficulty: habit.difficulty ?? 'medium',
      tags: habit.tags ?? [],
      scheduled_days: habit.scheduledDays ?? [],
      subtasks: habit.subtasks,
      is_paused: false,
    }).select().single();

    if (error) throw new Error(`Supabase: ${error.message}`);
    setHabits((currentHabits) => [...currentHabits, {
      ...habit,
      id: data.id,
      currentStreak: 0,
      completedToday: false,
      history: {},
      completionNotes: {},
      category: habit.category,
      quantity: habit.quantity,
      note: habit.note,
      unit: habit.unit,
      priority: habit.priority,
      difficulty: habit.difficulty,
      tags: habit.tags,
      scheduledDays: habit.scheduledDays,
      subtasks: habit.subtasks,
      isPaused: false,
    }]);
  };

  const toggleSubtask = async (habitId: string, subtaskId: string) => {
    if (!user) return;
    const habit = habits.find((item) => item.id === habitId);
    if (!habit || habit.isPaused) return;
    const subtasks = habit.subtasks.map((subtask) => (
      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
    ));
    const { error } = await supabase.from('habits').update({ subtasks }).eq('id', habitId).eq('user_id', user.id);
    if (error) throw error;
    setHabits((currentHabits) => currentHabits.map((item) => item.id === habitId ? { ...item, subtasks } : item));
  };

  const toggleHabit = async (id: string, reflection?: string) => {
    // Marca o desmarca el día actual y recalcula la racha consecutiva.
    if (!user) return;
    const habit = habits.find((item) => item.id === id);
    if (!habit || habit.isPaused) return;
    const date = today();
    const completedToday = !habit.completedToday;
    const query = supabase.from('habit_completions');
    const { error } = completedToday
      ? await query.insert({ habit_id: id, user_id: user.id, completed_on: date, reflection: reflection?.trim() || null })
      : await query.delete().eq('habit_id', id).eq('user_id', user.id).eq('completed_on', date);

    if (error) throw error;
    setHabits((currentHabits) => currentHabits.map((currentHabit) => {
      if (currentHabit.id !== id) return currentHabit;
      const history = { ...(currentHabit.history ?? {}), [date]: completedToday };
      const completionNotes = { ...(currentHabit.completionNotes ?? {}) };
      if (completedToday && reflection?.trim()) completionNotes[date] = reflection.trim();
      if (!completedToday) delete completionNotes[date];
      return { ...currentHabit, completedToday, history, completionNotes, currentStreak: calculateStreak(history) };
    }));
  };

  const pauseHabit = async (id: string) => {
    if (!user) return;
    const habit = habits.find((item) => item.id === id);
    if (!habit) return;

    const isPaused = !habit.isPaused;
    const { error } = await supabase
      .from('habits')
      .update({ is_paused: isPaused })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    setHabits((currentHabits) => currentHabits.map((currentHabit) => (
      currentHabit.id === id ? { ...currentHabit, isPaused } : currentHabit
    )));
  };

  const updateHabit = async (id: string, habit: Omit<HabitItem, 'id' | 'isPaused' | 'currentStreak' | 'completedToday' | 'history'>) => {
    if (!user) return;
    const { error } = await supabase.from('habits').update({
      name: habit.name,
      target_amount: habit.targetAmount ?? null,
      note: habit.note ?? null,
      color: habit.color,
      frequency: habit.frequency,
      category: habit.category,
      quantity: habit.quantity ?? null,
      unit: habit.unit ?? null,
      priority: habit.priority,
      difficulty: habit.difficulty ?? 'medium',
      tags: habit.tags ?? [],
      scheduled_days: habit.scheduledDays ?? [],
      subtasks: habit.subtasks,
    }).eq('id', id).eq('user_id', user.id);

    if (error) throw error;
    setHabits((currentHabits) => currentHabits.map((currentHabit) => (
      currentHabit.id === id ? { ...currentHabit, ...habit, isPaused: currentHabit.isPaused } : currentHabit
    )));
  };

  // Elimina el hábito seleccionado de la lista compartida.
  const removeHabit = async (id: string) => {
    // Elimina el hábito; sus cumplimientos relacionados se borran en cascada.
    if (!user) return;
    const { error } = await supabase.from('habits').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id));
  };

  return (
    <HabitContext.Provider value={{ habits, loading, monthlyGoal, setMonthlyGoal, addHabit, updateHabit, toggleHabit, toggleSubtask, pauseHabit, removeHabit }}>
      {children}
    </HabitContext.Provider>
  );
}

export function calculateStreak(history: Record<string, boolean>) {
  // Cuenta días consecutivos hacia atrás desde hoy hasta encontrar un día incompleto.
  let streak = 0;
  const date = new Date();
  while (history[date.toISOString().slice(0, 10)]) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

export function getHabitStats(habit: HabitItem) {
  const completedDates = Object.keys(habit.history ?? {}).filter((date) => habit.history?.[date]);
  let bestStreak = 0;
  let runningStreak = 0;
  let previousDate: Date | null = null;

  completedDates.sort().forEach((dateKey) => {
    const date = new Date(`${dateKey}T00:00:00`);
    const expectedNextDate = previousDate ? new Date(previousDate) : null;
    expectedNextDate?.setDate(expectedNextDate.getDate() + 1);
    if (expectedNextDate && expectedNextDate.toISOString().slice(0, 10) === dateKey) {
      runningStreak += 1;
    } else {
      runningStreak = 1;
    }
    bestStreak = Math.max(bestStreak, runningStreak);
    previousDate = date;
  });

  return {
    currentStreak: calculateStreak(habit.history ?? {}),
    bestStreak,
    totalCompleted: completedDates.length,
  };
}

export function useHabits() {
  // Expone el contexto y evita usarlo fuera de HabitProvider.
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits debe ser utilizado dentro de HabitProvider');
  }
  return context;
}
