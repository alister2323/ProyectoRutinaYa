// Tarjeta de un hábito: permite cumplirlo, pausar, editar y revisar subtareas.
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import StreakBadge from './StreakBadge';
import { useLanguage } from '../contexts/LanguageContext';

export type HabitItem = {
  // Tipo central: describe todos los datos que puede tener un hábito.
  id: string;
  name: string;
  color: string;
  targetAmount?: string;
  frequency: string;
  category: 'health' | 'study' | 'exercise' | 'productivity';
  quantity?: number;
  unit?: 'glasses' | 'minutes' | 'pages' | 'kilometers' | 'custom';
  priority: number;
  subtasks: Subtask[];
  isPaused: boolean;
  currentStreak: number;
  completedToday: boolean;
  history?: Record<string, boolean>;
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

type HabitCardProps = {
  habit: HabitItem;
  onToggle: (id: string) => void;
  onEdit?: (habit: HabitItem) => void;
  onDelete?: (id: string) => void;
  onPause?: (id: string) => void;
  onToggleSubtask?: (habitId: string, subtaskId: string) => void;
};

export default function HabitCard({ habit, onToggle, onEdit, onDelete, onPause, onToggleSubtask }: HabitCardProps) {
  const { t } = useLanguage();
  // Presenta un hábito, permite marcarlo como completado y ofrece su eliminación opcional.
  const isCompleted = habit.completedToday;

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: '#000000' },
        isCompleted ? styles.cardCompleted : styles.cardActive,
        habit.isPaused && styles.cardPaused,
      ]}
    >
      <Pressable
        style={styles.touchArea}
        onPress={() => onToggle(habit.id)}
        disabled={habit.isPaused}
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: isCompleted ? habit.color : '#000000' },
            isCompleted && { backgroundColor: habit.color },
          ]}
        >
          {isCompleted && <Ionicons name="checkmark" size={18} color="#ffffff" />}
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.habitName,
              isCompleted && styles.habitNameCompleted,
            ]}
          >
            {habit.name}
          </Text>
          {habit.targetAmount ? (
            <Text style={styles.targetText}>{habit.targetAmount}</Text>
          ) : null}
          {habit.quantity && habit.unit && <Text style={styles.targetText}>{habit.quantity} {t(habit.unit)}</Text>}
          {habit.isPaused && <Text style={styles.pausedText}>{t('paused')}</Text>}
          {/* Las subtareas se pueden marcar sin completar todo el hábito. */}
          {habit.subtasks.length > 0 && <View style={styles.subtaskList}>
            {habit.subtasks.map((subtask) => (
              <Pressable
                key={subtask.id}
                onPress={() => onToggleSubtask?.(habit.id, subtask.id)}
                style={styles.subtaskRow}
                disabled={habit.isPaused}
              >
                <Ionicons name={subtask.completed ? 'checkmark-circle' : 'ellipse-outline'} size={13} color={subtask.completed ? habit.color : '#94a3b8'} />
                <Text style={[styles.subtaskText, subtask.completed && styles.subtaskCompleted]} numberOfLines={1}>{subtask.title}</Text>
              </Pressable>
            ))}
          </View>}
        </View>
      </Pressable>

      <View style={styles.rightSection}>
        <StreakBadge streak={habit.currentStreak} />

        {onPause && (
          <Pressable
            onPress={() => onPause(habit.id)}
            style={styles.deleteBtn}
            accessibilityLabel={t(habit.isPaused ? 'resumeHabit' : 'pauseHabit')}
          >
            <Feather name={habit.isPaused ? 'play' : 'pause'} size={16} color="#64748b" />
          </Pressable>
        )}

        {onEdit && (
          <Pressable onPress={() => onEdit(habit)} style={styles.deleteBtn}>
            <Feather name="edit-2" size={16} color="#64748b" />
          </Pressable>
        )}

        {onDelete && (
          <Pressable
            onPress={() => onDelete(habit.id)}
            style={styles.deleteBtn}
          >
            <Feather name="trash-2" size={16} color="#94a3b8" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#070707',
    borderLeftWidth: 5,
    padding: 14,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  cardActive: {
    backgroundColor: '#ffffff',
  },
  cardCompleted: {
    backgroundColor: '#f8fafc',
    borderColor: '#000000',
  },
  cardPaused: {
    opacity: 0.62,
  },
  touchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  habitNameCompleted: {
    color: '#000000',
    textDecorationLine: 'line-through',
  },
  targetText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  pausedText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 2,
  },
  subtaskList: {
    marginTop: 4,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subtaskText: {
    color: '#64748b',
    fontSize: 10,
    marginLeft: 4,
    maxWidth: 150,
  },
  subtaskCompleted: {
    textDecorationLine: 'line-through',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    padding: 6,
  },
});