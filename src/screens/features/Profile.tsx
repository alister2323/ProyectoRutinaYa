// Pantalla con datos de la cuenta, idioma y botón para cerrar sesión.
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Profile({ route, navigation }: any) {
  // Muestra los datos de la cuenta, el idioma actual y la opción de salir.
  const { language, changeLanguage, t } = useLanguage();
  const { logout, user } = useAuth();
  const email = user?.email || route?.params?.email || '';
  const name = user?.name || route?.params?.name || 'Usuario';
  const phone = user?.phone || route?.params?.phone || 'No registrado';

  const handleLogout = async () => {
    // Cierra la sesión y devuelve a la persona a la pantalla de Login.
    try {
      await logout();
    } catch (error) {
      console.warn('Error al cerrar sesión:', error);
    }

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
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardHeader}>{t('academicDetails')}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('phone')}:</Text>
          <Text style={styles.infoValue}>{phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('university')}:</Text>
          <Text style={styles.infoValue}>Ceutec</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('class')}:</Text>
          <Text style={styles.infoValue}>{t('mobileProgramming')}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('teacher')}:</Text>
          <Text style={styles.infoValue}>Ing. María José Salinas</Text>
        </View>
    
      </View>

      <View style={styles.languageCard}>
        <Text style={styles.infoLabel}>{t('language')}</Text>
        <View style={styles.languageOptions}>
          <Pressable onPress={() => changeLanguage('es')}>
            <Text style={[styles.languageOption, language === 'es' && styles.languageActive]}>
              {t('spanish')}
            </Text>
          </Pressable>
          <Pressable onPress={() => changeLanguage('en')}>
            <Text style={[styles.languageOption, language === 'en' && styles.languageActive]}>
              {t('english')}
            </Text>
          </Pressable>
        </View>
      </View>

      <CustomButton
        title={t('logout')}
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
    color: '#000000',
    fontWeight: 'bold',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000000',
    marginVertical: 20,
  },
  languageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  languageOption: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  languageActive: {
    color: '#0f172a',
    textDecorationLine: 'underline',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  infoLabel: {
    fontSize: 13,
    color: '#000000',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});