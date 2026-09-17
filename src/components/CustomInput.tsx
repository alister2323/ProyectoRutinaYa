import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type CustomInputProps = {
  label?: string;
  onChangeText: (text: string) => void;
  value: string;
  placeholder: string;
  type?: 'default' | 'password' | 'email' | 'phone' | 'number';
  required?: boolean;
};

export default function CustomInput({
  label,
  onChangeText,
  value,
  placeholder,
  type = 'default',
  required = false,
}: CustomInputProps) {
  const [isSecureText, setIsSecureText] = useState(type === 'password');
  const [isTouched, setIsTouched] = useState(false);

  const isPasswordField = type === 'password';

  const iconName: keyof typeof MaterialIcons.glyphMap | undefined =
    type === 'password'
      ? 'lock-outline'
      : type === 'email'
      ? 'alternate-email'
      : type === 'phone'
      ? 'phone'
      : undefined;

  const keyboardType: KeyboardTypeOptions =
    type === 'email'
      ? 'email-address'
      : type === 'phone' || type === 'number'
      ? 'phone-pad'
      : 'default';

  // Validaciones según rúbrica
  const getError = (): string | null => {
    if (!isTouched && value.length === 0) return null;

    if (required && value.trim().length === 0) {
      return 'Este campo es obligatorio';
    }
    if (type === 'email' && value.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Correo inválido (ej: usuario@correo.com)';
      }
    }
    if (type === 'password' && value.length > 0 && value.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (type === 'phone' && value.length > 0 && value.replace(/\D/g, '').length < 8) {
      return 'Teléfono inválido (al menos 8 dígitos)';
    }
    return null;
  };

  const error = getError();

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <View style={[styles.inputContainer, error && styles.inputError]}>
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={20}
            color="#64748b"
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
          secureTextEntry={isSecureText}
          onBlur={() => setIsTouched(true)}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        />

        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setIsSecureText(!isSecureText)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={isSecureText ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#64748b"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 5,
  },
  required: {
    color: '#ef4444',
  },
  inputContainer: {
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1.5,
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
});