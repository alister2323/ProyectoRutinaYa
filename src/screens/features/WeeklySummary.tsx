// Pantalla de análisis: metas, comparación semanal, calendario e historial.
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { getHabitStats, useHabits } from '../../contexts/HabitContext';
import CustomInput from '../../components/CustomInput';

const toDateKey = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export default function WeeklySummary() {
  const { t } = useLanguage();
  const { habits, monthlyGoal, setMonthlyGoal } = useHabits();
  const activeHabits = habits.filter((habit) => !habit.isPaused);
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(habits[0]?.id);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [goalInput, setGoalInput] = useState('');
  const selectedHabit = habits.find((habit) => habit.id === selectedHabitId) ?? habits[0];
  useEffect(() => setGoalInput(monthlyGoal ? String(monthlyGoal) : ''), [monthlyGoal]);
  const monthDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const dayNames = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];

  // Crea las casillas del mes y deja vacías las posiciones antes del primer día.
  const calendarCells = useMemo(() => Array.from({ length: firstDay + monthDays }, (_, index) => {
    if (index < firstDay) return null;
    const date = new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1);
    return { number: index - firstDay + 1, key: toDateKey(date) };
  }), [firstDay, month, monthDays]);

  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });
  const weekDays = dates.map((date) => {
    const completed = activeHabits.filter((habit) => habit.history?.[toDateKey(date)]).length;
    return { day: dayNames[date.getDay()], pct: activeHabits.length ? Math.round((completed / activeHabits.length) * 100) : 0 };
  });
  const overallCompletion = Math.round(weekDays.reduce((total, day) => total + day.pct, 0) / (weekDays.length || 1));
  const selectedStats = selectedHabit ? getHabitStats(selectedHabit) : null;
  const monthPrefix = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
  const monthCompletedDays = new Set(activeHabits.flatMap((habit) => Object.keys(habit.history ?? {}).filter((date) => date.startsWith(monthPrefix)))).size;
  const thisWeekTotal = dates.reduce((total, date) => total + activeHabits.filter((habit) => habit.history?.[toDateKey(date)]).length, 0);
  const previousWeekDates = dates.map((date) => {
    const previous = new Date(date);
    previous.setDate(previous.getDate() - 7);
    return previous;
  });
  const previousWeekTotal = previousWeekDates.reduce((total, date) => total + activeHabits.filter((habit) => habit.history?.[toDateKey(date)]).length, 0);
  const weekDifference = thisWeekTotal - previousWeekTotal;
  // Guarda la meta mensual después de convertir el texto a número.
  const saveGoal = async () => {
    const target = Number(goalInput);
    if (!Number.isFinite(target) || target < 1) return;
    try {
      await setMonthlyGoal(target);
    } catch (error: any) {
      alert(error?.message ?? t('goalError'));
    }
  };
  const changeMonth = (offset: number) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('weeklySummary')}</Text>
      <Text style={styles.subtitle}>{t('lastSevenDays')}</Text>

      <View style={styles.metricCard}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{t('overallCompletion')}</Text>
          <Text style={styles.metricValue}>{overallCompletion}%</Text>
        </View>
        <Text style={styles.metricNote}>{t('excellentWeek')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>{t('monthlyGoal')}</Text>
        <Text style={styles.goalProgress}>{monthCompletedDays} {t('of')} {monthlyGoal ?? '--'} {t('goalDays')}</Text>
        <View style={styles.goalTrack}><View style={[styles.goalFill, { width: `${monthlyGoal ? Math.min(100, (monthCompletedDays / monthlyGoal) * 100) : 0}%` }]} /></View>
        <View style={styles.goalInputRow}>
          <View style={styles.goalInput}><CustomInput label="" placeholder={t('goalPlaceholder')} value={goalInput} onChangeText={setGoalInput} type="number" /></View>
          <Pressable onPress={saveGoal} style={styles.saveGoal}><Text style={styles.saveGoalText}>{t('saveGoal')}</Text></Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>{t('weeklyComparison')}</Text>
        <View style={styles.comparisonRow}>
          <View><Text style={styles.comparisonLabel}>{t('thisWeek')}</Text><Text style={styles.comparisonValue}>{thisWeekTotal}</Text></View>
          <View><Text style={styles.comparisonLabel}>{t('lastWeek')}</Text><Text style={styles.comparisonValue}>{previousWeekTotal}</Text></View>
          <View><Text style={styles.comparisonLabel}>{t('difference')}</Text><Text style={[styles.comparisonValue, weekDifference >= 0 ? styles.positive : styles.negative]}>{weekDifference > 0 ? '+' : ''}{weekDifference}</Text></View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>{t('monthlyCalendar')}</Text>
        <View style={styles.monthHeader}>
          <Pressable onPress={() => changeMonth(-1)} style={styles.iconButton} accessibilityLabel={t('previousMonth')}>
            <Ionicons name="chevron-back" size={20} color="#0f172a" />
          </Pressable>
          <Text style={styles.monthTitle}>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</Text>
          <Pressable onPress={() => changeMonth(1)} style={styles.iconButton} accessibilityLabel={t('nextMonth')}>
            <Ionicons name="chevron-forward" size={20} color="#0f172a" />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.habitSelector}>
          {habits.map((habit) => (
            <Pressable key={habit.id} onPress={() => setSelectedHabitId(habit.id)} style={[styles.habitChip, selectedHabit?.id === habit.id && styles.habitChipActive]}>
              <View style={[styles.dot, { backgroundColor: habit.color }]} />
              <Text numberOfLines={1} style={[styles.habitChipText, selectedHabit?.id === habit.id && styles.habitChipTextActive]}>{habit.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.weekLabels}>{dayNames.map((day) => <Text key={day} style={styles.weekLabel}>{day.slice(0, 2)}</Text>)}</View>
        <View style={styles.calendarGrid}>
          {calendarCells.map((cell, index) => {
            const completed = Boolean(cell && selectedHabit?.history?.[cell.key]);
            return <View key={`${cell?.key ?? 'empty'}-${index}`} style={styles.calendarCell}>
              {cell && <View style={[styles.dayCircle, completed && { backgroundColor: selectedHabit.color }]}><Text style={[styles.dayNumber, completed && styles.dayNumberCompleted]}>{cell.number}</Text></View>}
            </View>;
          })}
        </View>
      </View>

      {selectedStats && <View style={styles.statsRow}>
        <Metric label={t('currentStreak')} value={`${selectedStats.currentStreak}`} />
        <Metric label={t('bestStreak')} value={`${selectedStats.bestStreak}`} />
        <Metric label={t('totalCompleted')} value={`${selectedStats.totalCompleted}`} />
      </View>}

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>{t('dayByDay')}</Text>
        <View style={styles.barsRow}>{weekDays.map((item) => <View key={item.day} style={styles.barCol}>
          <Text style={styles.barPct}>{item.pct}%</Text>
          <View style={styles.barTrack}><View style={[styles.barFill, { height: `${item.pct}%` }]} /></View>
          <Text style={styles.dayText}>{item.day}</Text>
        </View>)}</View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>{t('historyByHabit')}</Text>
        {habits.length === 0 && <Text style={styles.emptyText}>{t('noHistory')}</Text>}
        {habits.map((habit) => {
          const stats = getHabitStats(habit);
          return <Pressable key={habit.id} onPress={() => setSelectedHabitId(habit.id)} style={styles.historyRow}>
            <View style={[styles.dot, { backgroundColor: habit.color }]} />
            <Text style={styles.habitName} numberOfLines={1}>{habit.name}</Text>
            <Text style={styles.historyValue}>{stats.totalCompleted} / {stats.bestStreak}</Text>
          </Pressable>;
        })}
      </View>
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.smallMetric}><Text style={styles.smallMetricValue}>{value}</Text><Text style={styles.smallMetricLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#000000', marginBottom: 16 },
  metricCard: { backgroundColor: '#080808', borderRadius: 16, padding: 18, marginBottom: 16 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  metricValue: { color: '#ffffff', fontSize: 32, fontWeight: '900' },
  metricNote: { color: '#ecfdf5', fontSize: 12, marginTop: 6 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#000000' },
  goalProgress: { color: '#000000', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  goalTrack: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  goalFill: { height: '100%', backgroundColor: '#0f172a', borderRadius: 4 },
  goalInputRow: { flexDirection: 'row', alignItems: 'center' },
  goalInput: { flex: 1 },
  saveGoal: { backgroundColor: '#0f172a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginLeft: 8 },
  saveGoalText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  comparisonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  comparisonLabel: { color: '#000000', fontSize: 11 },
  comparisonValue: { color: '#0f172a', fontSize: 22, fontWeight: '900', marginTop: 4 },
  positive: { color: '#15803d' },
  negative: { color: '#b91c1c' },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#000000', marginBottom: 12 },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconButton: { padding: 6 },
  monthTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', textTransform: 'capitalize' },
  habitSelector: { gap: 8, paddingBottom: 14 },
  habitChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 7, maxWidth: 160 },
  habitChipActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  habitChipText: { color: '#334155', fontSize: 12 },
  habitChipTextActive: { color: '#ffffff' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 7 },
  weekLabels: { flexDirection: 'row', marginBottom: 4 },
  weekLabel: { flex: 1, textAlign: 'center', color: '#000000', fontSize: 11, fontWeight: '700' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarCell: { width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  dayNumber: { color: '#334155', fontSize: 12 },
  dayNumberCompleted: { color: '#ffffff', fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  smallMetric: { flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#000000', borderRadius: 12, padding: 12 },
  smallMetricValue: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  smallMetricLabel: { fontSize: 10, color: '#000000', marginTop: 3 },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, paddingTop: 10 },
  barCol: { alignItems: 'center', flex: 1 },
  barPct: { fontSize: 10, color: '#000000', marginBottom: 4 },
  barTrack: { width: 14, height: 90, backgroundColor: '#f1f5f9', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: '#0f172a', borderRadius: 6 },
  dayText: { fontSize: 11, fontWeight: '600', color: '#000000', marginTop: 6 },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  habitName: { flex: 1, fontSize: 13, color: '#000000', fontWeight: '600' },
  historyValue: { fontSize: 12, color: '#000000', fontWeight: '700' },
  emptyText: { color: '#000000', fontSize: 13 },
});
