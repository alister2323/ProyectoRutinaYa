// Organiza las pestañas principales de la aplicación.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import WeeklySummary from '../screens/features/WeeklySummary';
import NewHabit from '../screens/features/NewHabit';
import Profile from '../screens/features/Profile';
import { useLanguage } from '../contexts/LanguageContext';
import { useHabits } from '../contexts/HabitContext';

export type TabsParamList = {
  // Cada pestaña define aquí los parámetros que puede recibir.
  HoyTab: { email?: string; name?: string; userId?: string };
  ResumenTab: undefined;
  NuevoTab: { habit?: import('../components/HabitCard').HabitItem; userId?: string } | undefined;
  PerfilTab: { email?: string; name?: string; userId?: string };
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator({ route }: any) {
  // Configura las pestañas principales y conserva los datos básicos del usuario para las pantallas.
  const { t } = useLanguage();
  const { habits } = useHabits();
  // Conserva datos básicos del usuario para las pantallas que los muestran.
  const userParams = {
    email: route?.params?.email,
    name: route?.params?.name,
    phone: route?.params?.phone,
    userId: route?.params?.userId,
  };

  return (
    <Tab.Navigator
      initialRouteName="HoyTab"
      screenOptions={({ route }) => ({
        // Estas opciones se aplican a todas las pestañas.
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#000000',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#000000',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#070707',
        tabBarInactiveTintColor: '#050505',
        // Solo mostramos iconos para evitar etiquetas cortadas en Expo Web.
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#030303',
          backgroundColor: '#ffffff',
          width: '100%',
          
          borderBottomColor: '#020202',
        },
        tabBarItemStyle: { flex: 1, minWidth: 0 },
        tabBarIcon: ({ focused, color, size }) => {
          // El icono cambia según la pestaña y si está seleccionada.
          let iconName: keyof typeof Ionicons.glyphMap = 'checkbox-outline';

          if (route.name === 'HoyTab') {
            iconName = focused ? 'checkbox' : 'checkbox-outline';
          } else if (route.name === 'ResumenTab') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'NuevoTab') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'PerfilTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HoyTab"
        component={Home}
        initialParams={userParams}
        options={{ headerTitle: () => <TodayHeader title={t('today')} habits={habits} /> }}
      />
      <Tab.Screen
        name="ResumenTab"
        component={WeeklySummary}
        options={{ headerTitle: () => <TabHeader icon="bar-chart-outline" title={t('summary')} subtitle="Revisa tu progreso y estadísticas" /> }}
      />
      <Tab.Screen
        name="NuevoTab"
        component={NewHabit}
        initialParams={userParams}
        options={{ headerTitle: () => <TabHeader icon="add-circle-outline" title={t('newHabit')} subtitle="Crea una rutina personalizada" /> }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={Profile}
        initialParams={userParams}
        options={{ headerTitle: () => <TabHeader icon="person-outline" title={t('profile')} subtitle="Gestiona tu cuenta y preferencias" /> }}
      />
    </Tab.Navigator>
  );
}

function TabHeader({ icon, title, subtitle }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string }) {
  // Encabezado reutilizable que combina icono, título y una descripción corta.
  return (
    <View style={styles.headerContent}>
      <Ionicons name={icon} size={16} color="#000000" />
      <View>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function TodayHeader({ title, habits }: { title: string; habits: import('../components/HabitCard').HabitItem[] }) {
  // Calcula los pendientes solo entre hábitos activos y programados para hoy.
  const { language } = useLanguage();
  const currentDay = new Date().getDay();
  const activeToday = habits.filter((habit) => !habit.isPaused && (!habit.scheduledDays?.length || habit.scheduledDays.includes(currentDay)));
  const pending = activeToday.filter((habit) => !habit.completedToday).length;
  // Formatea la fecha usando el idioma que eligió la persona.
  const date = new Intl.DateTimeFormat(language === 'es' ? 'es-HN' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const subtitle = language === 'es'
    ? `${date} · ${pending} pendiente${pending === 1 ? '' : 's'}`
    : `${date} · ${pending} pending`;
  return <TabHeader icon="checkbox-outline" title={title} subtitle={subtitle} />;
}

const styles = StyleSheet.create({
  headerContent: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  headerTitle: { color: '#000000', fontSize: 15, fontWeight: '900' },
  headerSubtitle: { color: '#000000', fontSize: 9, fontWeight: '600' },
});