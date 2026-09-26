// Pantalla de análisis: metas, comparación semanal, calendario e historial.
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jsPDF } from 'jspdf';
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
  const currentMonthPrefix = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousMonthPrefix = `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthTotal = new Set(activeHabits.flatMap((habit) => Object.keys(habit.history ?? {}).filter((date) => date.startsWith(currentMonthPrefix)))).size;
  const previousMonthTotal = new Set(activeHabits.flatMap((habit) => Object.keys(habit.history ?? {}).filter((date) => date.startsWith(previousMonthPrefix)))).size;
  const monthDifference = currentMonthTotal - previousMonthTotal;
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
  const exportSummary = () => {
    // El PDF solo se descarga desde un navegador; Expo Go no puede crear archivos así.
    if (Platform.OS !== 'web') {
      alert('La exportación PDF está disponible en la versión web.');
      return;
    }

    // Crea el documento y escribe un encabezado con los datos generales del progreso.
    const pdf = new jsPDF();
    const reportDate = new Date().toLocaleDateString('es-HN', { day: 'numeric', month: 'long', year: 'numeric' });
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('RutinaYa', 18, 20);
    pdf.setFontSize(14);
    pdf.text('Resumen de hábitos', 18, 30);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Generado el ${reportDate}`, 18, 38);
    pdf.text(`Meta mensual: ${monthlyGoal ?? 'Sin definir'} días`, 18, 45);
    pdf.text(`Cumplimiento general: ${overallCompletion}%`, 18, 52);
    pdf.text(`Días cumplidos este mes: ${currentMonthTotal}`, 18, 59);
    pdf.text(`Comparación mensual: ${monthDifference > 0 ? '+' : ''}${monthDifference} días`, 18, 66);

    // Esta posición sube en cada fila para evitar que el contenido se encime.
    let verticalPosition = 80;
    pdf.setFillColor(0, 0, 0);
    pdf.rect(18, verticalPosition - 7, 174, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Hábito', 21, verticalPosition - 1);
    pdf.text('Días', 133, verticalPosition - 1);
    pdf.text('Mejor racha', 157, verticalPosition - 1);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    verticalPosition += 8;

    habits.forEach((habit) => {
      const stats = getHabitStats(habit);
      const schedule = habit.scheduledDays?.length
        ? habit.scheduledDays.map((day) => dayNames[day]).join(', ')
        : 'Todos los días';
      const tags = habit.tags?.length ? habit.tags.map((tag) => `#${tag}`).join(' ') : 'Sin etiquetas';
      const difficulty = habit.difficulty === 'easy' ? 'Fácil' : habit.difficulty === 'hard' ? 'Difícil' : 'Media';

      // Cada hábito usa varias líneas; crea una página nueva cuando ya no hay espacio.
      if (verticalPosition > 245) {
        pdf.addPage();
        verticalPosition = 22;
      }
      pdf.setDrawColor(0, 0, 0);
      pdf.roundedRect(18, verticalPosition - 5, 174, 35, 2, 2, 'S');
      pdf.setFont('helvetica', 'bold');
      pdf.text(habit.name.slice(0, 52), 22, verticalPosition + 1);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Categoría: ${habit.category} · Dificultad: ${difficulty} · Prioridad: ${habit.priority}`, 22, verticalPosition + 8);
      pdf.text(`Programado: ${schedule}`, 22, verticalPosition + 15);
      pdf.text(`Etiquetas: ${tags}`.slice(0, 88), 22, verticalPosition + 22);
      pdf.text(`Cumplidos: ${stats.totalCompleted} · Racha actual: ${stats.currentStreak} · Mejor racha: ${stats.bestStreak}`, 22, verticalPosition + 29);
      pdf.setFontSize(10);
      verticalPosition += 41;
    });

    if (habits.length === 0) pdf.text('Todavía no hay hábitos creados.', 18, verticalPosition);

    // Convierte el PDF a un archivo descargable sin abrir otra pestaña.
    const pdfUrl = URL.createObjectURL(pdf.output('blob'));
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = 'resumen-rutinaya.pdf';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(pdfUrl);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('weeklySummary')}</Text>
      <Text style={styles.subtitle}>{t('lastSevenDays')}</Text>
      <Pressable onPress={exportSummary} style={styles.exportButton}>
        <Ionicons name="download-outline" size={16} color="#ffffff" />
        <Text style={styles.exportText}>Descargar PDF</Text>
      </Pressable>

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
        <Text style={styles.sectionHeader}>Comparación mensual</Text>
        <View style={styles.comparisonRow}>
          <View><Text style={styles.comparisonLabel}>Este mes</Text><Text style={styles.comparisonValue}>{currentMonthTotal}</Text></View>
          <View><Text style={styles.comparisonLabel}>Mes anterior</Text><Text style={styles.comparisonValue}>{previousMonthTotal}</Text></View>
          <View><Text style={styles.comparisonLabel}>Diferencia</Text><Text style={[styles.comparisonValue, monthDifference >= 0 ? styles.positive : styles.negative]}>{monthDifference > 0 ? '+' : ''}{monthDifference}</Text></View>
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
  title: { fontSize: 22, fontWeight: '900', color: '#000000', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#000000', fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  metricCard: { backgroundColor: '#080808', borderRadius: 16, padding: 18, marginBottom: 16 },
  exportButton: { alignItems: 'center', alignSelf: 'center', backgroundColor: '#000000', borderRadius: 8, flexDirection: 'row', gap: 6, marginBottom: 14, paddingHorizontal: 12, paddingVertical: 9 },
  exportText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  metricValue: { color: '#ffffff', fontSize: 32, fontWeight: '900' },
  metricNote: { color: '#ecfdf5', fontSize: 12, marginTop: 6 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#000000' },
  goalProgress: { color: '#000000', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  goalTrack: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  goalFill: { height: '100%', backgroundColor: '#000000', borderRadius: 4 },
  goalInputRow: { flexDirection: 'row', alignItems: 'center' },
  goalInput: { flex: 1 },
  saveGoal: { backgroundColor: '#000000', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginLeft: 8 },
  saveGoalText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  comparisonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  comparisonLabel: { color: '#000000', fontSize: 11 },
  comparisonValue: { color: '#0f172a', fontSize: 22, fontWeight: '900', marginTop: 4 },
  positive: { color: '#7c3aed' },
  negative: { color: '#b91c1c' },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#000000', marginBottom: 12 },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconButton: { padding: 6 },
  monthTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', textTransform: 'capitalize' },
  habitSelector: { gap: 8, paddingBottom: 14 },
  habitChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 7, maxWidth: 160 },
  habitChipActive: { backgroundColor: '#000000', borderColor: '#000000' },
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
  barFill: { width: '100%', backgroundColor: '#000000', borderRadius: 6 },
  dayText: { fontSize: 11, fontWeight: '600', color: '#000000', marginTop: 6 },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  habitName: { flex: 1, fontSize: 13, color: '#000000', fontWeight: '600' },
  historyValue: { fontSize: 12, color: '#000000', fontWeight: '700' },
  emptyText: { color: '#000000', fontSize: 13 },
});
