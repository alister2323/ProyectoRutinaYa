// Botón reutilizable para mantener el mismo diseño en toda la aplicación.
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
}: CustomButtonProps) {
  // Renderiza un botón reutilizable con estilos según su variante y un estado de carga opcional.
  // El estilo depende de si el botón es principal, secundario o peligroso.
  const styles = getStyles(variant);

  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#0f172a' : '#ffffff'} />
      ) : (
        <Text style={styles.buttonTitle}>{title}</Text>
      )}
    </Pressable>
  );
}

// Crea los estilos visuales apropiados para cada tipo de botón.
const getStyles = (variant: 'primary' | 'secondary' | 'danger') =>
  StyleSheet.create({
    button: {
      backgroundColor:
        variant === 'primary'
          ? '#0c0c0c'
          : variant === 'secondary'
          ? '#e2e8f0'
          : '#ef4444',
      borderRadius: 12,
      width: '100%',
      paddingVertical: 14,
      marginVertical: 6,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
    },
    buttonTitle: {
      color: variant === 'secondary' ? '#0f172a' : '#ffffff',
      fontWeight: 'bold',
      fontSize: 15,
    },
  });