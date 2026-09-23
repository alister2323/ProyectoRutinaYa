// Pantalla principal: muestra progreso, recordatorios y lista de hábitos.
import React from 'react';
import { Alert, Platform, View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import HabitCard, { HabitItem } from '../components/HabitCard';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useHabits } from '../contexts/HabitContext';
import { useAuth } from '../contexts/AuthContext';

export default function Home({ route, navigation }: any) {
  // Muestra los hábitos del día, el progreso y las acciones principales.
  const { t } = useLanguage();
  const { habits, toggleHabit, toggleSubtask, pauseHabit, removeHabit } = useHabits();
  const { user } = useAuth();
  const name = user?.name || route?.params?.name || 'Usuario';

  // Los hábitos pausados se conservan, pero no cuentan como pendientes activos.
  const activeHabits = habits.filter((habit) => !habit.isPaused);
  // Copia la lista y la ordena sin modificar la lista original del contexto.
  const orderedHabits = [...habits].sort((a, b) => b.priority - a.priority);
  const completedCount = activeHabits.filter((h) => h.completedToday).length;
  // Cuando no hay hábitos, el progreso debe ser 0 y no NaN (0 dividido entre 0).
  const percentage = activeHabits.length === 0
    ? 0
    : Math.round((completedCount / activeHabits.length) * 100);

  const handlePauseHabit = async (id: string) => {
    try {
      await pauseHabit(id);
    } catch (error: any) {
      Alert.alert(t('error'), error?.message ?? t('pauseError'));
    }
  };


  const localizedHabit = (habit: HabitItem): HabitItem => {
    // Traduce los hábitos iniciales sin cambiar los nombres creados por el usuario.
    const defaults: Record<string, { name: string; target: string }> = {
      '1': { name: t('waterHabit'), target: t('waterTarget') },
      '2': { name: t('exerciseHabit'), target: t('exerciseTarget') },
      '3': { name: t('readingHabit'), target: t('readingTarget') },
      '4': { name: t('sleepHabit'), target: t('sleepTarget') },
    };
    const translated = defaults[habit.id];
    return translated
      ? { ...habit, name: translated.name, targetAmount: translated.target }
      : habit;
  };

  // Pide confirmación antes de borrar para evitar eliminar un hábito por accidente.
  const handleDeleteHabit = (habit: HabitItem) => {
    // Pide confirmación antes de eliminar el hábito de Supabase.
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`${t('deleteHabit')}\n\n${t('confirmDelete')}`);
      if (confirmed) removeHabit(habit.id);
      return;
    }

    Alert.alert(
      t('deleteHabit'),
      t('confirmDelete'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => removeHabit(habit.id) },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('greeting')} {name}!</Text>
          <Text style={styles.subtitle}>{t('dailyHabits')}</Text>
        </View>

        <Pressable style={styles.addButton} onPress={() => navigation.navigate('NuevoTab')}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* Tarjeta de Progreso Diario */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{t('todayProgress')}</Text>
          <Text style={styles.progressPercentage}>{percentage}%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>

        <Text style={styles.progressFooter}>
          {completedCount} {t('of')} {activeHabits.length} {t('habitsCompleted')}
        </Text>
      </View>

      {activeHabits.some((habit) => !habit.completedToday) && (
        <View style={styles.reminderBanner}>
          <Ionicons name="notifications-outline" size={18} color="#7c2d12" />
          <Text style={styles.reminderText}>{t('pendingReminder')}</Text>
        </View>
      )}

      {/* Lista de Hábitos */}
      <FlatList
        data={orderedHabits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard
            habit={localizedHabit(item)}
            onToggle={toggleHabit}
            onToggleSubtask={toggleSubtask}
            onEdit={(habit) => navigation.navigate('NuevoTab', { habit, userId: user?.id })}
            onPause={handlePauseHabit}
            onDelete={() => handleDeleteHabit(item)}
          />
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
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffedd5',
    borderColor: '#fdba74',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  reminderText: {
    flex: 1,
    color: '#7c2d12',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
});