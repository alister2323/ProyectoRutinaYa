import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('alister23@unitec.edu');
  const [password, setPassword] = useState('alister23');
  const [generalError, setGeneralError] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setGeneralError('Por favor completa los campos requeridos');
      return;
    }
    if (!email.includes('@')) {
      setGeneralError('Ingresa un correo electrónico válido');
      return;
    }
    if (password.length < 4) {
      setGeneralError('La contraseña es demasiado corta');
      return;
    }

    setGeneralError('');
    navigation.navigate('UserTabs', { email });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagen local mostrada correctamente según rúbrica */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>RutinaYa</Text>
          <Text style={styles.subtitle}>Organizador de Hábitos y Rutinas</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>CEUTEC • Programación Móvil</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>

          {generalError ? (
            <Text style={styles.generalErrorText}>{generalError}</Text>
          ) : null}

          <CustomInput
            label="Correo Electrónico"
            placeholder="ejemplo@ceutec.edu"
            type="email"
            value={email}
            onChangeText={setEmail}
            required
          />

          <CustomInput
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
            value={password}
            onChangeText={setPassword}
            required
          />

          <CustomButton
            title="Iniciar Sesión"
            onPress={handleLogin}
            variant="primary"
          />

          <CustomButton
            title="Crear Nueva Cuenta"
            onPress={() => navigation.navigate('RegisterScreen')}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  tag: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  tagText: {
    color: '#060606',
    fontSize: 11,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 14,
  },
  generalErrorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 10,
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 8,
  },
});