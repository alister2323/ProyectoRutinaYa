import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHabits } from '../../contexts/HabitContext';

export default function NewHabit({ navigation }: any) {
  const { t } = useLanguage();
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [frequency, setFrequency] = useState('daily');

  const colors = ['#020202', '#535353' , '#4e0e5e' , '#5c3a7c' , '#7439aa', '#cbbcd8', ];
  const frequencies = [
    { key: 'daily', label: t('daily') },
    { key: 'weekdays', label: t('weekdays') },
    { key: 'weekend', label: t('weekend') },
  ];

  const handleSave = () => {
    if (!name.trim()) {
      alert(t('habitNameRequired'));
      return;
    }
    addHabit({
      name: name.trim(),
      targetAmount: target.trim() || undefined,
      color: selectedColor,
      frequency,
    });
    navigation.navigate('HoyTab');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('newHabit')}</Text>
      <Text style={styles.subtitle}>{t('newHabitSubtitle')}</Text>

      <View style={styles.card}>
        <CustomInput
          label={t('habitName')}
          placeholder={t('habitPlaceholder')}
          value={name}
          onChangeText={setName}
          required
        />

        <CustomInput
          label={t('dailyTarget')}
          placeholder={t('targetPlaceholder')}
          value={target}
          onChangeText={setTarget}
        />

        {/* Frecuencia */}
        <Text style={styles.sectionLabel}>{t('frequency')}</Text>
        <View style={styles.freqRow}>
          {frequencies.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.freqBtn,
                frequency === f.key && styles.freqBtnActive,
              ]}
              onPress={() => setFrequency(f.key)}
            >
              <Text
                style={[
                  styles.freqText,
                  frequency === f.key && styles.freqTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Colores */}
        <Text style={styles.sectionLabel}>{t('habitColor')}</Text>
        <View style={styles.colorsRow}>
          {colors.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorCircle,
                { backgroundColor: c },
                selectedColor === c && styles.colorCircleSelected,
              ]}
              onPress={() => setSelectedColor(c)}
            />
          ))}
        </View>

        <CustomButton
          title={t('saveHabit')}
          onPress={handleSave}
          variant="primary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000000',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 10,
    marginBottom: 8,
  },
  freqRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  freqBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    alignItems: 'center',
  },
  freqBtnActive: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 1,
  },
  freqText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  freqTextActive: {
    color: '#030303',
    fontWeight: 'bold',
  },
  colorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#0f172a',
  },
});