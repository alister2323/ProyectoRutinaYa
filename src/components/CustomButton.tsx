import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

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
  const styles = getStyles(variant);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#0f172a' : '#ffffff'} />
      ) : (
        <Text style={styles.buttonTitle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    buttonTitle: {
      color: variant === 'secondary' ? '#0f172a' : '#ffffff',
      fontWeight: 'bold',
      fontSize: 15,
    },
  });