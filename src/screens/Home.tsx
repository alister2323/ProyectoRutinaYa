import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import HabitCard, { HabitItem } from '../components/HabitCard';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ route, navigation }: any) {
  const email = route?.params?.email || 'Usuario';

  const [habits, setHabits] = useState<HabitItem[]>([
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
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completedToday;
          return {
            ...h,
            completedToday: nextCompleted,
            // Si se completa, suma racha. Si se desmarca, se reinicia o decrementa visualmente
            currentStreak: nextCompleted
              ? h.currentStreak + 1
              : Math.max(0, h.currentStreak - 1),
          };
        }
        return h;
      })
    );
  };

  const completedCount = habits.filter((h) => h.completedToday).length;
  const percentage = Math.round((completedCount / habits.length) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, {email.split('@')[0]}!</Text>
          <Text style={styles.subtitle}>Tus Hábitos Diarios</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('NuevoTab')}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Tarjeta de Progreso Diario */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progreso de Hoy</Text>
          <Text style={styles.progressPercentage}>{percentage}%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>

        <Text style={styles.progressFooter}>
          {completedCount} de {habits.length} hábitos cumplidos
        </Text>
      </View>

      {/* Lista de Hábitos */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard habit={item} onToggle={toggleHabit} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#010000',
  },
  addButton: {
    backgroundColor: '#000101',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  progressCard: {
    backgroundColor: '#01040b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#fdfdfd',
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressPercentage: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarTrack: {
    backgroundColor: '#4a3355',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    backgroundColor: '#feffff',
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    color: '#fdfdfd',
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
});