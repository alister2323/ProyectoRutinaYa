// Campo reutilizable con validaciones y opción para mostrar la contraseña.
import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
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
  blackBorder?: boolean;
  compact?: boolean;
};

export default function CustomInput({
  label,
  onChangeText,
  value,
  placeholder,
  type = 'default',
  required = false,
  blackBorder = false,
  compact = false,
}: CustomInputProps) {
  // Administra el valor, el enfoque y la visibilidad de un campo reutilizable.
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

  // Devuelve el primer mensaje de validación aplicable al contenido del campo.
  // Comprueba el valor y devuelve un texto sencillo si hay un problema.
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
    <View style={[styles.wrapper, compact && styles.compactWrapper]}>
      {label ? (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      ) : null}

      <View style={[styles.inputContainer, { borderColor: blackBorder ? '#000000' : '#cbd5e1' }, error && styles.inputError]}>
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={20}
            color="#000000"
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#000000"
          keyboardType={keyboardType}
          secureTextEntry={isSecureText}
          onBlur={() => setIsTouched(true)}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        />

        {isPasswordField && (
          <Pressable
            onPress={() => setIsSecureText(!isSecureText)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={isSecureText ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#000000"
            />
          </Pressable>
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
  compactWrapper: {
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
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