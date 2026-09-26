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
  note?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  frequency: string;
  category: 'health' | 'study' | 'exercise' | 'productivity';
  quantity?: number;
  unit?: 'glasses' | 'minutes' | 'pages' | 'kilometers' | 'custom';
  priority: number;
  scheduledDays?: number[];
  subtasks: Subtask[];
  isPaused: boolean;
  currentStreak: number;
  completedToday: boolean;
  history?: Record<string, boolean>;
  completionNotes?: Record<string, string>;
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
  const hasValidQuantity = Number.isFinite(habit.quantity) && (habit.quantity ?? 0) > 0;
  const unitLabel = habit.unit ? t(habit.unit === 'custom' ? 'customUnit' : habit.unit) : '';
  const priorityLabel = t(`priority${habit.priority}`);
  const completedSubtasks = habit.subtasks.filter((subtask) => subtask.completed).length;
  const dayLabels = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
  const scheduleLabel = habit.scheduledDays?.length
    ? habit.scheduledDays.map((day) => dayLabels[day]).join(', ')
    : null;

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: habit.color },
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
          {habit.note ? <Text style={styles.noteText}>{habit.note}</Text> : null}
          {habit.completionNotes?.[new Date().toISOString().slice(0, 10)] ? (
            <View style={styles.completionNote}>
              <Ionicons name="document-text-outline" size={14} color="#000000" />
              <Text style={styles.completionNoteText}>Nota de hoy: {habit.completionNotes[new Date().toISOString().slice(0, 10)]}</Text>
            </View>
          ) : null}
          {hasValidQuantity && habit.unit && <Text style={styles.targetText}>{habit.quantity} {unitLabel.charAt(0).toUpperCase()}{unitLabel.slice(1)}</Text>}
          <View style={styles.detailsRow}>
            <Text style={styles.detailChip}>{t(habit.category)}</Text>
            <Text style={styles.detailChip}>{priorityLabel}</Text>
            {habit.difficulty && <Text style={styles.detailChip}>{habit.difficulty === 'easy' ? 'Fácil' : habit.difficulty === 'hard' ? 'Difícil' : 'Media'}</Text>}
          </View>
          {habit.tags?.length ? <Text style={styles.tagsText}>{habit.tags.map((tag) => `#${tag}`).join(' ')}</Text> : null}
          {scheduleLabel && <Text style={styles.scheduleText}>Programado: {scheduleLabel}</Text>}
          {habit.isPaused && <Text style={styles.pausedText}>{t('paused')}</Text>}
          {/* Las subtareas se pueden marcar sin completar todo el hábito. */}
          {habit.subtasks.length > 0 && <View style={styles.subtaskList}>
            <Text style={styles.subtaskProgress}>{completedSubtasks}/{habit.subtasks.length} subtareas completadas</Text>
            {habit.subtasks.map((subtask) => (
              <Pressable
                key={subtask.id}
                onPress={() => onToggleSubtask?.(habit.id, subtask.id)}
                style={styles.subtaskRow}
                disabled={habit.isPaused}
              >
                <Ionicons name={subtask.completed ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={subtask.completed ? habit.color : '#000000'} />
                <Text style={[styles.subtaskText, subtask.completed && styles.subtaskCompleted]}>{subtask.title}</Text>
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
            <Feather name={habit.isPaused ? 'play' : 'pause'} size={16} color="#000000" />
          </Pressable>
        )}

        {onEdit && (
          <Pressable onPress={() => onEdit(habit)} style={styles.deleteBtn}>
            <Feather name="edit-2" size={16} color="#000000" />
          </Pressable>
        )}

        {onDelete && (
          <Pressable
            onPress={() => onDelete(habit.id)}
            style={styles.deleteBtn}
          >
            <Feather name="trash-2" size={16} color="#000000" />
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
    padding: 16,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 6,
  },
  textContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  habitNameCompleted: {
    color: '#000000',
    textDecorationLine: 'line-through',
  },
  targetText: {
    fontSize: 12,
    color: '#000000',
    marginTop: 2,
  },
  noteText: {
    color: '#000000',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 3,
  },
  completionNote: { alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: 8, borderWidth: 1, flexDirection: 'row', marginTop: 6, padding: 7 },
  completionNoteText: { color: '#000000', flex: 1, fontSize: 11, fontWeight: '700', marginLeft: 5 },
  tagsText: { color: '#000000', fontSize: 11, fontWeight: '700', marginTop: 5 },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 5,
  },
  detailChip: {
    backgroundColor: '#f1f5f9',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pausedText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 2,
  },
  scheduleText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
  },
  subtaskList: {
    marginTop: 12,
    gap: 6,
  },
  subtaskProgress: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
  },
  subtaskText: {
    color: '#000000',
    fontSize: 13,
    marginLeft: 7,
    flex: 1,
  },
  subtaskCompleted: {
    textDecorationLine: 'line-through',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 7,
  },
});