import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import WeeklySummary from '../screens/features/WeeklySummary';
import NewHabit from '../screens/features/NewHabit';
import Profile from '../screens/features/Profile';

export type TabsParamList = {
  HoyTab: { email?: string; name?: string };
  ResumenTab: undefined;
  NuevoTab: undefined;
  PerfilTab: { email?: string; name?: string };
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HoyTab"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#070707',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
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
        options={{ title: 'Hoy' }}
      />
      <Tab.Screen
        name="ResumenTab"
        component={WeeklySummary}
        options={{ title: 'Resumen' }}
      />
      <Tab.Screen
        name="NuevoTab"
        component={NewHabit}
        options={{ title: 'Nuevo Hábito' }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={Profile}
        options={{ title: 'Mi Perfil' }}
      />
    </Tab.Navigator>
  );
}
