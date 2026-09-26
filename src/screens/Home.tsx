// Pantalla principal: muestra progreso, recordatorios y lista de hábitos.
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native';
import HabitCard, { HabitItem } from '../components/HabitCard';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useHabits } from '../contexts/HabitContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Home({ route, navigation }: any) {
  // Muestra los hábitos del día, el progreso y las acciones principales.
  const { t } = useLanguage();
  const { habits, toggleHabit, toggleSubtask, pauseHabit, removeHabit } = useHabits();
  const { user } = useAuth();
  const name = user?.name || route?.params?.name || 'Usuario';
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | HabitItem['category']>('all');
  const [showPaused, setShowPaused] = useState(false);
  const [reflectionHabit, setReflectionHabit] = useState<HabitItem | null>(null);
  const [reflection, setReflection] = useState('');
  const [isOnVacation, setIsOnVacation] = useState(false);

  useEffect(() => {
    // Revisa si hoy está dentro de un periodo de vacaciones del usuario.
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    supabase.from('vacations').select('id').eq('user_id', user.id).lte('starts_on', today).gte('ends_on', today).limit(1)
      .then(({ data }) => setIsOnVacation(Boolean(data?.length)));
  }, [user]);
  const dailyTips = [
    'Empieza con una tarea pequeña y mantenla constante.',
    'La constancia supera a la intensidad cuando construyes un hábito.',
    'Prepara hoy lo que necesitas para cumplir mañana.',
    'Un hábito cumplido, por pequeño que sea, también es progreso.',
    'Haz primero la tarea que más te acerca a tu meta.',
    'No busques perfección: busca repetirlo un día más.',
    'Celebra el avance y vuelve a intentarlo cuando sea necesario.',
  ];
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - startOfYear.getTime()) / 86_400_000);
  const dailyTip = dailyTips[dayOfYear % dailyTips.length];

  // Los hábitos pausados se conservan, pero no cuentan como pendientes activos.
  const currentDay = new Date().getDay();
  const isScheduledForToday = (habit: HabitItem) => !habit.scheduledDays?.length || habit.scheduledDays.includes(currentDay);
  const activeHabits = isOnVacation ? [] : habits.filter((habit) => !habit.isPaused && isScheduledForToday(habit));
  // Copia la lista y la ordena sin modificar la lista original del contexto.
  const orderedHabits = habits
    .filter((habit) => (showPaused ? habit.isPaused : !habit.isPaused))
    .filter((habit) => categoryFilter === 'all' || habit.category === categoryFilter)
    .filter((habit) => habit.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => b.priority - a.priority);
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

  const handleToggleHabit = async (habit: HabitItem) => {
    // Si ya está cumplido se desmarca; si no, se abre la nota opcional antes de completar.
    if (habit.completedToday) {
      await toggleHabit(habit.id);
      return;
    }
    setReflectionHabit(habit);
  };

  const confirmCompletion = async () => {
    // Guarda el cumplimiento y la nota escrita en el modal.
    if (!reflectionHabit) return;
    try {
      await toggleHabit(reflectionHabit.id, reflection);
      setReflectionHabit(null);
      setReflection('');
    } catch (error: any) {
      Alert.alert(t('error'), error?.message ?? 'No se pudo completar el hábito.');
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

      <View style={styles.tipCard}>
        <Ionicons name="bulb-outline" size={18} color="#000000" />
        <Text style={styles.tipText}>Consejo del día: {dailyTip}</Text>
      </View>

      <Pressable style={styles.templateShortcut} onPress={() => navigation.navigate('NuevoTab')}>
        <View style={styles.templateShortcutIcon}>
          <Ionicons name="copy-outline" size={20} color="#ffffff" />
        </View>
        <View style={styles.templateShortcutContent}>
          <Text style={styles.templateShortcutTitle}>Usar plantilla</Text>
          <Text style={styles.templateShortcutText}>Crea un hábito desde Mañana, Estudio, Ejercicio o Autocuidado.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#000000" />
      </Pressable>

      {isOnVacation && <View style={styles.vacationBanner}><Ionicons name="airplane-outline" size={18} color="#ffffff" /><Text style={styles.vacationText}>Modo vacaciones activo: tus rachas están en pausa.</Text></View>}

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
          <Ionicons name="notifications-outline" size={18} color="#ffffff" />
          <Text style={styles.reminderText}>{t('pendingReminder')}</Text>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={21} color="#000000" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar hábitos"
          placeholderTextColor="#000000"
          style={styles.searchInput}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} style={styles.clearSearchButton} accessibilityLabel="Limpiar búsqueda">
            <Ionicons name="close" size={18} color="#ffffff" />
          </Pressable>
        )}
      </View>
      <Text style={styles.searchResultText}>{orderedHabits.length} hábito{orderedHabits.length === 1 ? '' : 's'} encontrado{orderedHabits.length === 1 ? '' : 's'}</Text>
      <View style={styles.filterRow}>
        {(['all', 'health', 'study', 'exercise', 'productivity'] as const).map((category) => (
          <Pressable
            key={category}
            onPress={() => setCategoryFilter(category)}
            style={[styles.filterChip, categoryFilter === category && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, categoryFilter === category && styles.filterTextActive]}>
              {category === 'all' ? 'Todos' : t(category)}
            </Text>
          </Pressable>
        ))}
        <Pressable onPress={() => setShowPaused((current) => !current)} style={[styles.filterChip, showPaused && styles.filterChipActive]}>
          <Text style={[styles.filterText, showPaused && styles.filterTextActive]}>{showPaused ? 'Pausados' : 'Activos'}</Text>
        </Pressable>
      </View>

      {/* Lista de Hábitos */}
      <FlatList
        data={orderedHabits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard
            habit={localizedHabit(item)}
            onToggle={() => handleToggleHabit(item)}
            onToggleSubtask={toggleSubtask}
            onEdit={(habit) => navigation.navigate('NuevoTab', { habit, userId: user?.id })}
            onPause={handlePauseHabit}
            onDelete={() => handleDeleteHabit(item)}
          />
        )}
        ListEmptyComponent={<View style={styles.emptySearch}><Ionicons name="search-outline" size={26} color="#000000" /><Text style={styles.emptySearchTitle}>No hay hábitos para mostrar</Text><Text style={styles.emptySearchText}>Prueba cambiar la búsqueda o los filtros.</Text></View>}
        contentContainerStyle={[styles.listContent, orderedHabits.length === 0 && styles.emptyListContent]}
      />

      <Modal visible={Boolean(reflectionHabit)} transparent animationType="fade" onRequestClose={() => setReflectionHabit(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.reflectionModal}>
            <Text style={styles.reflectionTitle}>Reflexión rápida</Text>
            <Text style={styles.reflectionDescription}>¿Cómo te fue con {reflectionHabit?.name}?</Text>
            <TextInput
              value={reflection}
              onChangeText={setReflection}
              placeholder="Escribe una nota opcional"
              placeholderTextColor="#000000"
              multiline
              style={styles.reflectionInput}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setReflectionHabit(null)} style={styles.modalSecondary}><Text style={styles.modalSecondaryText}>Cancelar</Text></Pressable>
              <Pressable onPress={confirmCompletion} style={styles.modalPrimary}><Text style={styles.modalPrimaryText}>Completar</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  tipText: {
    color: '#000000',
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  },
  templateShortcut: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 12,
  },
  templateShortcutIcon: {
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    marginRight: 10,
    width: 38,
  },
  templateShortcutContent: { flex: 1 },
  templateShortcutTitle: { color: '#000000', fontSize: 14, fontWeight: '900' },
  templateShortcutText: { color: '#000000', fontSize: 11, fontWeight: '600', marginTop: 2 },
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
    backgroundColor: '#ffffff',
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
    backgroundColor: '#000000',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  reminderText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  },
  vacationBanner: { alignItems: 'center', backgroundColor: '#000000', borderRadius: 10, flexDirection: 'row', marginBottom: 10, padding: 12 },
  vacationText: { color: '#ffffff', flex: 1, fontSize: 12, fontWeight: '800', marginLeft: 8 },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderRadius: 10,
    height: 54,
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 14,
    paddingRight: 6,
    borderWidth: 1,
  },
  searchInput: {
    color: '#000000',
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingHorizontal: 10,
  },
  clearSearchButton: {
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  searchResultText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'right',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  filterChip: {
    borderColor: '#000000',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: '#000000',
  },
  filterText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyListContent: { flexGrow: 1 },
  emptySearch: { alignItems: 'center', borderColor: '#000000', borderRadius: 10, borderWidth: 1, marginTop: 8, padding: 24 },
  emptySearchTitle: { color: '#000000', fontSize: 15, fontWeight: '900', marginTop: 8 },
  emptySearchText: { color: '#000000', fontSize: 12, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  modalOverlay: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)', flex: 1, justifyContent: 'center', padding: 20 },
  reflectionModal: { backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: 12, borderWidth: 1, padding: 18, width: '100%' },
  reflectionTitle: { color: '#000000', fontSize: 18, fontWeight: '900' },
  reflectionDescription: { color: '#000000', fontSize: 13, marginTop: 5 },
  reflectionInput: { borderColor: '#000000', borderRadius: 8, borderWidth: 1, color: '#000000', fontSize: 14, marginTop: 14, minHeight: 82, padding: 10, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', marginTop: 12 },
  modalPrimary: { backgroundColor: '#000000', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 },
  modalPrimaryText: { color: '#ffffff', fontWeight: '800' },
  modalSecondary: { borderColor: '#000000', borderRadius: 8, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  modalSecondaryText: { color: '#000000', fontWeight: '800' },
});