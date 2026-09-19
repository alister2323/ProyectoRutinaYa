import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Profile({ route, navigation }: any) {
  const { language, changeLanguage, t } = useLanguage();
  const email = route?.params?.email || 'alister23@unitec.edu';
  const name = route?.params?.name || email.split('@')[0];


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
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardHeader}>{t('academicDetails')}</Text>
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
          <TouchableOpacity onPress={() => changeLanguage('es')}>
            <Text style={[styles.languageOption, language === 'es' && styles.languageActive]}>
              {t('spanish')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage('en')}>
            <Text style={[styles.languageOption, language === 'en' && styles.languageActive]}>
              {t('english')}
            </Text>
          </TouchableOpacity>
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
    color: '#64748b',
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
    color: '#64748b',
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
    color: '#1e293b',
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
    color: '#64748b',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});