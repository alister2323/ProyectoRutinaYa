import React, { createContext, useContext, useState } from 'react';
import { HabitItem } from '../components/HabitCard';

type HabitContextType = {
  habits: HabitItem[];
  addHabit: (habit: Omit<HabitItem, 'id' | 'currentStreak' | 'completedToday'>) => void;
  toggleHabit: (id: string) => void;
  removeHabit: (id: string) => void;
};

const initialHabits: HabitItem[] = [
  {
    id: '1',
    name: 'Tomar 2L de Agua',
    color: '#0ea5e9',
    targetAmount: '8 vasos al día',
    frequency: 'daily',
    currentStreak: 5,
    completedToday: true,
  },
  {
    id: '2',
    name: 'Hacer Ejercicio 30 min',
    color: '#10b981',
    targetAmount: 'Cardio / Pesas',
    frequency: 'daily',
    currentStreak: 3,
    completedToday: true,
  },
  {
    id: '3',
    name: 'Leer 15 Páginas',
    color: '#8b5cf6',
    targetAmount: 'Libro de hábitos',
    frequency: 'daily',
    currentStreak: 0,
    completedToday: false,
  },
  {
    id: '4',
    name: 'Dormir antes de las 11 PM',
    color: '#6366f1',
    targetAmount: 'Descanso 8 horas',
    frequency: 'daily',
    currentStreak: 2,
    completedToday: false,
  },
];

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<HabitItem[]>(initialHabits);

  const addHabit = (habit: Omit<HabitItem, 'id' | 'currentStreak' | 'completedToday'>) => {
    setHabits((currentHabits) => [
      ...currentHabits,
      {
        ...habit,
        id: Date.now().toString(),
        currentStreak: 0,
        completedToday: false,
      },
    ]);
  };

  const toggleHabit = (id: string) => {
    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== id) return habit;
        const completedToday = !habit.completedToday;
        return {
          ...habit,
          completedToday,
          currentStreak: completedToday
            ? habit.currentStreak + 1
            : Math.max(0, habit.currentStreak - 1),
        };
      }),
    );
  };

  // Elimina el hábito seleccionado de la lista compartida.
  const removeHabit = (id: string) => {
    setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id));
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleHabit, removeHabit }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits debe ser utilizado dentro de HabitProvider');
  }
  return context;
}
