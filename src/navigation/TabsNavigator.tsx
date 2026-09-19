import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import WeeklySummary from '../screens/features/WeeklySummary';
import NewHabit from '../screens/features/NewHabit';
import Profile from '../screens/features/Profile';
import { useLanguage } from '../contexts/LanguageContext';

export type TabsParamList = {
  HoyTab: { email?: string; name?: string };
  ResumenTab: undefined;
  NuevoTab: undefined;
  PerfilTab: { email?: string; name?: string };
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator({ route }: any) {
  const { t } = useLanguage();
  const userParams = {
    email: route?.params?.email,
    name: route?.params?.name,
  };

  return (
    <Tab.Navigator
      initialRouteName="HoyTab"
      screenOptions={({ route }) => ({
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
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#030303',
          backgroundColor: '#ffffff',
          
          borderBottomColor: '#020202',
          
  
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
        initialParams={userParams}
        options={{ title: t('today') }}
      />
      <Tab.Screen
        name="ResumenTab"
        component={WeeklySummary}
        options={{ title: t('summary') }}
      />
      <Tab.Screen
        name="NuevoTab"
        component={NewHabit}
        options={{ title: t('newHabit') }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={Profile}
        initialParams={userParams}
        options={{ title: t('profile') }}
      />
    </Tab.Navigator>
  );
}