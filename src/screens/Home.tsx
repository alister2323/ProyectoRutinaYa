import React from 'react';
import { Alert, Platform, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import HabitCard, { HabitItem } from '../components/HabitCard';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useHabits } from '../contexts/HabitContext';

export default function Home({ route, navigation }: any) {
  const { t } = useLanguage();
  const { habits, toggleHabit, removeHabit } = useHabits();
  const email = route?.params?.email || 'Usuario';
  const name = route?.params?.name || email.split('@')[0];

  const completedCount = habits.filter((h) => h.completedToday).length;
  const percentage = Math.round((completedCount / habits.length) * 100);

  const localizedHabit = (habit: HabitItem): HabitItem => {
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
          <Text style={styles.progressLabel}>{t('todayProgress')}</Text>
          <Text style={styles.progressPercentage}>{percentage}%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>

        <Text style={styles.progressFooter}>
          {completedCount} {t('of')} {habits.length} {t('habitsCompleted')}
        </Text>
      </View>

      {/* Lista de Hábitos */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard
            habit={localizedHabit(item)}
            onToggle={toggleHabit}
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
  listContent: {
    paddingBottom: 24,
  },
});