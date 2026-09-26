// Botón reutilizable para mantener el mismo diseño en toda la aplicación.
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';

type CustomButtonProps = {
  // Texto visible dentro del botón.
  title: string;
  // Acción que se ejecuta cuando la persona presiona el botón.
  onPress: () => void;
  // Define el color y propósito visual del botón.
  variant?: 'primary' | 'secondary' | 'danger';
  // Muestra un indicador mientras una acción tarda en responder.
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
      // Evita que se envíe dos veces la misma acción mientras está cargando.
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
      // El color cambia según si la acción es principal, secundaria o peligrosa.
      backgroundColor:
        variant === 'primary'
          ? '#0c0c0c'
          : variant === 'secondary'
          ? '#ffffff'
          : '#ef4444',
      borderRadius: 12,
      borderColor: '#000000',
      borderWidth: 1,
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