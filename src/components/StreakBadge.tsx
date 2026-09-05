import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StreakBadgeProps = {
  streak: number;
};

export default function StreakBadge({ streak }: StreakBadgeProps) {
  const isBroken = streak === 0;

  if (isBroken) {
    return (
      <View style={[styles.badge, styles.badgeBroken]}>
        <Ionicons name="flame" size={14} color="#94a3b8" />
        <Text style={styles.textBroken}>0d</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, styles.badgeActive]}>
      <Ionicons name="flame" size={15} color="#ea580c" />
      <Text style={styles.textActive}>{streak}d</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 3,
  },
  badgeBroken: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: '#fff7ed',
    borderColor: '#fdba74',
    borderWidth: 1,
  },
  textBroken: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  textActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ea580c',
  },
});
