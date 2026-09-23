// Decide si la persona ve Login, Registro o las pantallas privadas.
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import TabsNavigator from './TabsNavigator';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  UserTabs: { email: string; name?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  // Define el flujo de pantallas fuera de la sesión y el contenedor de pestañas del usuario.
  // UserTabs contiene las pestañas que solo se usan después del login.
  const { user, loading } = useAuth();

  // No muestra Login ni UserTabs hasta saber si hay una sesión real.
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#0f172a" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerStyle: { backgroundColor: '#040404' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="LoginScreen" component={Login} options={{ headerShown: false, title: 'Iniciar Sesión' }} />
      <Stack.Screen name="RegisterScreen" component={Register} options={{ title: 'Registro de Usuario', headerShown: false }} />
      <Stack.Screen name="UserTabs" component={TabsNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}