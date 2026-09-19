import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useLanguage } from '../contexts/LanguageContext';

export default function Register({ navigation }: any) {
  const { language, changeLanguage, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = () => {
    // Validaciones del login
    if (!name.trim()) {
      setErrorMsg(t('requiredName'));
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(t('validEmail'));
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setErrorMsg(t('validPhone'));
      return;
    }
    if (password.length < 6) {
      setErrorMsg(t('passwordLength'));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(t('passwordMismatch'));
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
        <View style={styles.header}>
          <Text style={styles.title}>{t('register')}</Text>
          <Text style={styles.subtitle}>{t('registerSubtitle')}</Text>
        </View>

        {errorMsg ? <Text style={styles.errorBanner}>{errorMsg}</Text> : null}

        <CustomInput
          label={t('fullName')}
          placeholder={t('namePlaceholder')}
          type="default"
          value={name}
          onChangeText={setName}
          required
        />

        <CustomInput
          label={t('email')}
          placeholder={t('emailPlaceholder')}
          type="email"
          value={email}
          onChangeText={setEmail}
          required
        />

        <CustomInput
          label={t('phone')}
          placeholder={t('phonePlaceholder')}
          type="phone"
          value={phone}
          onChangeText={setPhone}
          required
        />

        <CustomInput
          label={t('password')}
          placeholder={t('passwordPlaceholder')}
          type="password"
          value={password}
          onChangeText={setPassword}
          required
        />

        <CustomInput
          label={t('confirmPassword')}
          placeholder={t('confirmPasswordPlaceholder')}
          type="password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          required
        />

        <View style={styles.buttonsArea}>
          <CustomButton
            title={t('register')}
            onPress={handleRegister}
            variant="primary"
          />

          <CustomButton
            title={t('backToLogin')}
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
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  languageLabel: {
    color: '#64748b',
    fontSize: 12,
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