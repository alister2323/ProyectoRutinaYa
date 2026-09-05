import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomButton from '../../components/CustomButton';

export default function Profile({ route, navigation }: any) {
  const email = route?.params?.email || 'alister23@unitec.edu';

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Imagen local según rúbrica */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../../assets/adaptive-icon.png')}
          style={styles.avatar}
          resizeMode="contain"
        />
        <Text style={styles.name}>Alister Gonzales</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardHeader}>Detalles Académicos</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Universidad:</Text>
          <Text style={styles.infoValue}>Ceutec</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Clase:</Text>
          <Text style={styles.infoValue}>Programación Móvil</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Docente:</Text>
          <Text style={styles.infoValue}>Ing. María José Salinas</Text>
        </View>
    
      </View>

      <CustomButton
        title="Cerrar Sesión"
        onPress={handleLogout}
        variant="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'space-between',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e2e8f0',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  email: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginVertical: 20,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});
