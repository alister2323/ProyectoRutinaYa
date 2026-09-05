import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function Register({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = () => {
    // Validaciones del login
    if (!name.trim()) {
      setErrorMsg('El nombre es obligatorio');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Ingresa un correo electrónico válido');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setErrorMsg('Ingresa un número de teléfono válido');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    setErrorMsg('');
    navigation.navigate('UserTabs', { email, name });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Registro</Text>
          <Text style={styles.subtitle}>Crea tu cuenta en RutinaYa</Text>
        </View>

        {errorMsg ? <Text style={styles.errorBanner}>{errorMsg}</Text> : null}

        <CustomInput
          label="Nombre Completo"
          placeholder="Ej: Juan Pérez"
          type="default"
          value={name}
          onChangeText={setName}
          required
        />

        <CustomInput
          label="Correo Electrónico"
          placeholder="ejemplo@ceutec.edu"
          type="email"
          value={email}
          onChangeText={setEmail}
          required
        />

        <CustomInput
          label="Teléfono Celular"
          placeholder="+504 9999-8888"
          type="phone"
          value={phone}
          onChangeText={setPhone}
          required
        />

        <CustomInput
          label="Contraseña"
          placeholder="Mínimo 6 caracteres"
          type="password"
          value={password}
          onChangeText={setPassword}
          required
        />

        <CustomInput
          label="Confirmar Contraseña"
          placeholder="Repite la contraseña"
          type="password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          required
        />

        <View style={styles.buttonsArea}>
          <CustomButton
            title="Registrarse"
            onPress={handleRegister}
            variant="primary"
          />

          <CustomButton
            title="Volver al Login"
            onPress={() => navigation.goBack()}
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
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 12,
  },
  buttonsArea: {
    marginTop: 14,
  },
});
