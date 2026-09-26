// Pantalla con datos de la cuenta, idioma y botón para cerrar sesión.
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getHabitStats, useHabits } from '../../contexts/HabitContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import CustomInput from '../../components/CustomInput';

export default function Profile({ route, navigation }: any) {
  // Muestra los datos de la cuenta, el idioma actual y la opción de salir.
  const { language, changeLanguage, t } = useLanguage();
  const { ensureSession, logout, updateProfile, user } = useAuth();
  const { habits } = useHabits();
  const { isDark, toggleTheme } = useTheme();
  const email = user?.email || route?.params?.email || '';
  const name = user?.name || route?.params?.name || 'Usuario';
  const phone = user?.phone || route?.params?.phone || 'No registrado';
  const activeHabits = habits.filter((habit) => !habit.isPaused).length;
  const pausedHabits = habits.filter((habit) => habit.isPaused).length;
  const completedToday = habits.filter((habit) => habit.completedToday).length;
  const habitStats = habits.map(getHabitStats);
  const totalCompleted = habitStats.reduce((total, stats) => total + stats.totalCompleted, 0);
  const bestCurrentStreak = habitStats.reduce((best, stats) => Math.max(best, stats.currentStreak), 0);
  const bestStreak = habitStats.reduce((best, stats) => Math.max(best, stats.bestStreak), 0);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftPhone, setDraftPhone] = useState(phone === 'No registrado' ? '' : phone);
  const [vacationStart, setVacationStart] = useState('');
  const [vacationEnd, setVacationEnd] = useState('');

  const saveProfile = async () => {
    try {
      await updateProfile(draftName.trim() || name, draftPhone.trim());
      setEditing(false);
    } catch (error: any) {
      alert(error?.message ?? 'No se pudo actualizar el perfil.');
    }
  };

  const saveVacation = async () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(vacationStart) || !/^\d{4}-\d{2}-\d{2}$/.test(vacationEnd)) {
      alert('Usa el formato AAAA-MM-DD para las fechas.');
      return;
    }
    try {
      const authenticatedUser = await ensureSession();
      const { error } = await supabase.from('vacations').insert({ user_id: authenticatedUser.id, starts_on: vacationStart, ends_on: vacationEnd });
      if (error) throw error;
      setVacationStart('');
      setVacationEnd('');
      alert('Modo vacaciones programado.');
    } catch (error: any) {
      alert(error?.message ?? 'No se pudo guardar el periodo de vacaciones.');
    }
  };

  const handleLogout = async () => {
    // Cierra la sesión y devuelve a la persona a la pantalla de Login.
    try {
      await logout();
    } catch (error) {
      console.warn('Error al cerrar sesión:', error);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={42} color="#ffffff" />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <Pressable onPress={() => setEditing((current) => !current)} style={styles.editProfileButton}>
          <Ionicons name="pencil" size={14} color="#ffffff" />
          <Text style={styles.editProfileText}>{editing ? 'Cancelar' : 'Editar perfil'}</Text>
        </Pressable>
      </View>

      {editing && <View style={styles.editForm}>
        <CustomInput label="Nombre" placeholder="Tu nombre" value={draftName} onChangeText={setDraftName} blackBorder />
        <CustomInput label="Teléfono" placeholder="Tu teléfono" value={draftPhone} onChangeText={setDraftPhone} type="phone" blackBorder />
        <CustomButton title="Guardar cambios" onPress={saveProfile} variant="primary" />
      </View>}

      <View style={styles.infoCard}>
        <Text style={styles.cardHeader}>{t('academicDetails')}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('phone')}:</Text>
          <Text style={styles.infoValue}>{phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('university')}:</Text>
          <Text style={styles.infoValue}>Ceutec</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('class')}:</Text>
          <Text style={styles.infoValue}>{t('mobileProgramming')}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('teacher')}:</Text>
          <Text style={styles.infoValue}>Ing. María José Salinas</Text>
        </View>
    
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Mis estadísticas</Text>
        <View style={styles.statsGrid}>
          <ProfileStat icon="checkbox" label="Hábitos activos" value={String(activeHabits)} />
          <ProfileStat icon="checkmark-circle" label="Cumplidos hoy" value={String(completedToday)} />
          <ProfileStat icon="checkmark-done" label="Días cumplidos" value={String(totalCompleted)} />
          <ProfileStat icon="flame" label="Racha actual" value={`${bestCurrentStreak} días`} />
          <ProfileStat icon="trophy" label="Racha máxima" value={`${bestStreak} días`} />
          <ProfileStat icon="pause-circle" label="Hábitos pausados" value={String(pausedHabits)} />
        </View>
      </View>

      <View style={styles.languageCard}>
        <Text style={styles.infoLabel}>{t('language')}</Text>
        <View style={styles.languageOptions}>
          <Pressable onPress={() => changeLanguage('es')}>
            <Text style={[styles.languageOption, language === 'es' && styles.languageActive]}>
              {t('spanish')}
            </Text>
          </Pressable>
          <Pressable onPress={() => changeLanguage('en')}>
            <Text style={[styles.languageOption, language === 'en' && styles.languageActive]}>
              {t('english')}
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={toggleTheme} style={styles.themeButton}>
        <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color="#ffffff" />
        <Text style={styles.themeButtonText}>{isDark ? 'Usar tema claro' : 'Usar tema oscuro'}</Text>
      </Pressable>

      <View style={styles.vacationCard}>
        <Text style={styles.cardHeader}>Modo vacaciones</Text>
        <Text style={styles.vacationDescription}>Pausa pendientes y rachas durante las fechas elegidas.</Text>
        <CustomInput label="Inicio" placeholder="AAAA-MM-DD" value={vacationStart} onChangeText={setVacationStart} blackBorder />
        <CustomInput label="Fin" placeholder="AAAA-MM-DD" value={vacationEnd} onChangeText={setVacationEnd} blackBorder />
        <CustomButton title="Guardar vacaciones" onPress={saveVacation} variant="primary" />
      </View>

      <CustomButton
        title={t('logout')}
        onPress={handleLogout}
        variant="danger"
      />
    </ScrollView>
  );
}

function ProfileStat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={20} color="#000000" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  content: {
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  editProfileButton: {
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  editProfileText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  editForm: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
  },
  email: {
    fontSize: 13,
    color: '#000000',
    fontWeight: 'bold',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000000',
    marginVertical: 20,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statItem: {
    width: '48%',
    minHeight: 112,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-between',
  },
  statValue: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },
  languageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeButton: {
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 11,
  },
  themeButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  vacationCard: { backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: 10, borderWidth: 1, marginTop: 14, padding: 14 },
  vacationDescription: { color: '#000000', fontSize: 12, fontWeight: '600', marginBottom: 10 },
  languageOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  languageOption: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  languageActive: {
    color: '#0f172a',
    textDecorationLine: 'underline',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  infoLabel: {
    fontSize: 13,
    color: '#000000',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
});