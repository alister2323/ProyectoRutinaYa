import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function NewHabit({ navigation }: any) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [frequency, setFrequency] = useState('Diario');

  const colors = ['#8800ff', '#8800ff', '#8800ff', '#8800ff', '#8800ff', '#8800ff'];
  const frequencies = ['Diario', 'Lun a Vie', 'Fin de Semana'];

  const handleSave = () => {
    if (!name.trim()) {
      alert('Por favor escribe el nombre del hábito');
      return;
    }
    // Guardar y regresar a pantalla Hoy
    navigation.navigate('HoyTab');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nuevo Hábito</Text>
      <Text style={styles.subtitle}>Crea y personaliza un hábito a tu medida</Text>

      <View style={styles.card}>
        <CustomInput
          label="Nombre del Hábito"
          placeholder="Ej: Tomar 2L de agua"
          value={name}
          onChangeText={setName}
          required
        />

        <CustomInput
          label="Meta Diaria (Opcional)"
          placeholder="Ej: 8 vasos, 30 minutos"
          value={target}
          onChangeText={setTarget}
        />

        {/* Frecuencia */}
        <Text style={styles.sectionLabel}>Frecuencia</Text>
        <View style={styles.freqRow}>
          {frequencies.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.freqBtn,
                frequency === f && styles.freqBtnActive,
              ]}
              onPress={() => setFrequency(f)}
            >
              <Text
                style={[
                  styles.freqText,
                  frequency === f && styles.freqTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Colores */}
        <Text style={styles.sectionLabel}>Color del Hábito</Text>
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
          title="Guardar Hábito"
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
    borderColor: '#e2e8f0',
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
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
    borderWidth: 1,
  },
  freqText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  freqTextActive: {
    color: '#065f46',
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