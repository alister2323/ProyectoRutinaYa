import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';

export default function WeeklySummary() {
  const { t } = useLanguage();
  // Datos simulados de la semana (Lunes a Domingo)
  const weekDays = [
    { day: t('mon'), pct: 80 },
    { day: t('tue'), pct: 100 },
    { day: t('wed'), pct: 75 },
    { day: t('thu'), pct: 90 },
    { day: t('fri'), pct: 85 },
    { day: t('sat'), pct: 60 },
    { day: t('sun'), pct: 80 },
  ];

  const habitsSummary = [
    { name: t('waterHabit'), pct: 90, color: '#0ea5e9' },
    { name: t('exerciseHabit'), pct: 75, color: '#10b981' },
    { name: t('readingHabit'), pct: 55, color: '#8b5cf6' },
    { name: t('sleepHabit'), pct: 70, color: '#6366f1' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('weeklySummary')}</Text>
      <Text style={styles.subtitle}>{t('lastSevenDays')}</Text>

      {/* Tarjeta General */}
      <View style={styles.metricCard}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{t('overallCompletion')}</Text>
          <Text style={styles.metricValue}>81%</Text>
        </View>
        <Text style={styles.metricNote}>{t('excellentWeek')}</Text>
      </View>

      {/* Gráfica de Barras Simple en React Native */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionHeader}>{t('dayByDay')}</Text>
        <View style={styles.barsRow}>
          {weekDays.map((item, index) => (
            <View key={index} style={styles.barCol}>
              <Text style={styles.barPct}>{item.pct}%</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${item.pct}%`,
                      backgroundColor: item.pct >= 80 ? '#010101' : '#59595917',
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayText}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Desglose por Hábito */}
      <View style={styles.breakdownCard}>
        <Text style={styles.sectionHeader}>{t('completionByHabit')}</Text>
        {habitsSummary.map((h, i) => (
          <View key={i} style={styles.habitRow}>
            <View style={styles.habitInfo}>
              <View style={[styles.dot, { backgroundColor: h.color }]} />
              <Text style={styles.habitName}>{h.name}</Text>
              <Text style={styles.habitPct}>{h.pct}%</Text>
            </View>
            <View style={styles.miniTrack}>
              <View
                style={[
                  styles.miniFill,
                  { width: `${h.pct}%`, backgroundColor: h.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#080808',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
  },
  metricNote: {
    color: '#ecfdf5',
    fontSize: 12,
    marginTop: 6,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000000',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barPct: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 6,
  },
  breakdownCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000000',
  },
  habitRow: {
    marginBottom: 12,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  habitName: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  habitPct: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  miniTrack: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    borderRadius: 3,
  },
});