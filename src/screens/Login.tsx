import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login({ navigation }: any) {
  const { language, changeLanguage, t } = useLanguage();
  const [email, setEmail] = useState('alister23@unitec.edu');
  const [password, setPassword] = useState('alister23');
  const [generalError, setGeneralError] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setGeneralError(t('requiredFields'));
      return;
    }
    if (!email.includes('@')) {
      setGeneralError(t('validEmail'));
      return;
    }
    if (password.length < 4) {
      setGeneralError(t('invalidPassword'));
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
          <Text style={styles.title}>{t('title')}</Text>
          <Text style={styles.subtitle}>{t('subtitle')}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{t('tag')}</Text>
          </View>
        </View>

        <View style={styles.languageRow}>
          <Text style={styles.languageLabel}>{t('language')}</Text>
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

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{t('welcomeLogin')}</Text>

          {generalError ? (
            <Text style={styles.generalErrorText}>{generalError}</Text>
          ) : null}

          <CustomInput
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            type="email"
            value={email}
            onChangeText={setEmail}
            required
          />

          <CustomInput
            label={t('password')}
            placeholder={t('typePwd')}
            type="password"
            value={password}
            onChangeText={setPassword}
            required
          />

          <CustomButton
            title={t('signIn')}
            onPress={handleLogin}
            variant="primary"
          />

          <CustomButton
            title={t('createAccount')}
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
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  languageLabel: {
    color: '#080808',
    fontSize: 12,
    fontWeight: 'bold',
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
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 46,
    fontWeight: '900',
    color: '#000000',
  },
  subtitle: {
    fontSize: 13,
    color: '#050505',
    marginTop: 2,
    fontWeight: 'bold',
  },
  tag: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  tagText: {
    color: '#ffffff',
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
    color: '#0a0a0a',
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