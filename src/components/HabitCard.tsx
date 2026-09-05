import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import StreakBadge from './StreakBadge';

export type HabitItem = {
  id: string;
  name: string;
  color: string;
  targetAmount?: string;
  frequency: string;
  currentStreak: number;
  completedToday: boolean;
};

type HabitCardProps = {
  habit: HabitItem;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const isCompleted = habit.completedToday;

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: habit.color },
        isCompleted ? styles.cardCompleted : styles.cardActive,
      ]}
    >
      <TouchableOpacity
        style={styles.touchArea}
        onPress={() => onToggle(habit.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: isCompleted ? habit.color : '#cbd5e1' },
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
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <StreakBadge streak={habit.currentStreak} />

        {onDelete && (
          <TouchableOpacity
            onPress={() => onDelete(habit.id)}
            style={styles.deleteBtn}
          >
            <Feather name="trash-2" size={16} color="#94a3b8" />
          </TouchableOpacity>
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
    borderColor: '#cbd5e1',
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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    padding: 6,
  },
});
