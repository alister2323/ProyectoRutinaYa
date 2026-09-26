// Punto principal: aquí se conectan los datos compartidos y la navegación.
import { View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import { navigationRef } from "./src/navigation/NavigationService";
import { AuthProvider } from "./src/contexts/AuthContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import { HabitProvider } from "./src/contexts/HabitContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";

export default function App() {
  // Monta los proveedores globales y la navegación principal de la aplicación.
  // Los proveedores permiten compartir sesión, idioma y hábitos entre pantallas.
  // Los proveedores permiten que todas las pantallas compartan sesión, idioma y hábitos.
  return (
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <HabitProvider>
            <NavigationContainer ref={navigationRef}>
              <StackNavigator />
            </NavigationContainer>
            </HabitProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
  );
}