import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  UserTabs: { email: string; name?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerStyle: { backgroundColor: '#040404' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="LoginScreen"
        component={Login}
        options={{ headerShown: false, title: 'Iniciar Sesión' }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={Register}
        options={{ title: 'Registro de Usuario', headerShown: false }}
      />
      <Stack.Screen
        name="UserTabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
