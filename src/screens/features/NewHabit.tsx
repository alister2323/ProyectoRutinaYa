// Pantalla para crear o editar un hábito con todos sus detalles.
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHabits } from '../../contexts/HabitContext';
import { HabitItem, Subtask } from '../../components/HabitCard';

export default function NewHabit({ navigation, route }: any) {
  // Recoge la configuración de un hábito y la envía al contexto compartido.
  const { t } = useLanguage();
  const { addHabit, updateHabit } = useHabits();
  const editingHabit = route?.params?.habit;
  const userId = route?.params?.userId;
  const [name, setName] = useState(editingHabit?.name ?? '');
  const [target, setTarget] = useState(editingHabit?.targetAmount ?? '');
  const [selectedColor, setSelectedColor] = useState(editingHabit?.color ?? '#000000');
  const [frequency, setFrequency] = useState(editingHabit?.frequency ?? 'daily');
  const [category, setCategory] = useState<HabitItem['category']>(editingHabit?.category ?? 'productivity');
  const [quantity, setQuantity] = useState(editingHabit?.quantity ? String(editingHabit.quantity) : '');
  const [unit, setUnit] = useState<HabitItem['unit']>(editingHabit?.unit ?? 'custom');
  const [priority, setPriority] = useState(editingHabit?.priority ?? 2);
  const [subtasks, setSubtasks] = useState<Subtask[]>(editingHabit?.subtasks ?? []);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    setName(editingHabit?.name ?? '');
    setTarget(editingHabit?.targetAmount ?? '');
    setSelectedColor(editingHabit?.color ?? '#000000');
    setFrequency(editingHabit?.frequency ?? 'daily');
    setCategory(editingHabit?.category ?? 'productivity');
    setQuantity(editingHabit?.quantity ? String(editingHabit.quantity) : '');
    setUnit(editingHabit?.unit ?? 'custom');
    setPriority(editingHabit?.priority ?? 2);
    setSubtasks(editingHabit?.subtasks ?? []);
  }, [editingHabit]);

  const colorOptions = ['#020202', '#535353' , '#4e0e5e' , '#5c3a7c' , '#7439aa', '#cbbcd8', ];
  const frequencies = [
    { key: 'daily', label: t('daily') },
    { key: 'weekdays', label: t('weekdays') },
    { key: 'weekend', label: t('weekend') },
  ];
  const categories = [
    { key: 'health' as const, label: t('health') },
    { key: 'study' as const, label: t('study') },
    { key: 'exercise' as const, label: t('exercise') },
    { key: 'productivity' as const, label: t('productivity') },
  ];
  const units = [
    { key: 'glasses' as const, label: t('glasses') },
    { key: 'minutes' as const, label: t('minutes') },
    { key: 'pages' as const, label: t('pages') },
    { key: 'kilometers' as const, label: t('kilometers') },
    { key: 'custom' as const, label: t('customUnit') },
  ];

  // Agrega una subtarea solo si la persona escribió algún texto.
  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((current) => [...current, { id: `${Date.now()}-${current.length}`, title: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  // Prepara los datos y los guarda en Supabase mediante HabitContext.
  const handleSave = async () => {
    // Valida el nombre y crea o actualiza el hábito en Supabase.
    if (!name.trim()) {
      alert(t('habitNameRequired'));
      return;
    }
    const habitData = {
      name: name.trim(),
      targetAmount: target.trim() || undefined,
      color: selectedColor,
      frequency,
      category,
      quantity: quantity.trim() ? Number(quantity) : undefined,
      unit: quantity.trim() ? unit : undefined,
      priority,
      subtasks,
    };
    try {
      if (editingHabit) await updateHabit(editingHabit.id, habitData);
      else await addHabit(habitData, userId);
    } catch (error: any) {
      console.warn('Error al guardar el hábito:', error?.message ?? error);
      alert(error?.message ?? 'No se pudo guardar el hábito.');
      return;
    }
    navigation.setParams({ habit: undefined });
    navigation.navigate('HoyTab');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{editingHabit ? `${t('newHabit')} - Editar` : t('newHabit')}</Text>
      <Text style={styles.subtitle}>{t('newHabitSubtitle')}</Text>

      <View style={styles.card}>
        <CustomInput
          label={t('habitName')}
          placeholder={t('habitPlaceholder')}
          value={name}
          onChangeText={setName}
          required
          blackBorder
        />

        <CustomInput
          label={t('dailyTarget')}
          placeholder={t('targetPlaceholder')}
          value={target}
          onChangeText={setTarget}
          blackBorder
        />

        <CustomInput
          label={t('quantity')}
          placeholder={t('quantityPlaceholder')}
          value={quantity}
          onChangeText={setQuantity}
          type="number"
          blackBorder
        />

        <Text style={styles.sectionLabel}>{t('category')}</Text>
        <View style={styles.optionRow}>
          {categories.map((item) => <Pressable key={item.key} onPress={() => setCategory(item.key)} style={[styles.option, category === item.key && styles.optionActive]}><Text style={[styles.optionText, category === item.key && styles.optionTextActive]}>{item.label}</Text></Pressable>)}
        </View>

        <Text style={styles.sectionLabel}>{t('unit')}</Text>
        <View style={styles.optionRow}>
          {units.map((item) => <Pressable key={item.key} onPress={() => setUnit(item.key)} style={[styles.option, unit === item.key && styles.optionActive]}><Text style={[styles.optionText, unit === item.key && styles.optionTextActive]}>{item.label}</Text></Pressable>)}
        </View>

        <Text style={styles.sectionLabel}>{t('priority')}</Text>
        <View style={styles.freqRow}>
          {[1, 2, 3].map((level) => <Pressable key={level} onPress={() => setPriority(level)} style={[styles.freqBtn, priority === level && styles.freqBtnActive]}><Text style={[styles.freqText, priority === level && styles.freqTextActive]}>{t(`priority${level}`)}</Text></Pressable>)}
        </View>

        <Text style={styles.sectionLabel}>{t('subtasks')}</Text>
        {subtasks.map((subtask) => <View key={subtask.id} style={styles.subtaskEditorRow}><Text style={styles.subtaskEditorText}>{subtask.title}</Text><Pressable onPress={() => setSubtasks((current) => current.filter((item) => item.id !== subtask.id))}><Text style={styles.removeText}>x</Text></Pressable></View>)}
        <View style={styles.subtaskInputRow}>
          <View style={styles.subtaskInput}><CustomInput label="" placeholder={t('subtaskPlaceholder')} value={newSubtask} onChangeText={setNewSubtask} blackBorder compact /></View>
          <Pressable onPress={addSubtask} style={styles.addSubtask}><Text style={styles.addSubtaskText}>+</Text></Pressable>
        </View>

        {/* Frecuencia */}
        <Text style={styles.sectionLabel}>{t('frequency')}</Text>
        <View style={styles.freqRow}>
          {frequencies.map((f) => (
            <Pressable
              key={f.key}
              style={[
                styles.freqBtn,
                { borderColor: '#000000' },
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
            </Pressable>
          ))}
        </View>

        {/* Colores */}
        <Text style={styles.sectionLabel}>{t('habitColor')}</Text>
        <View style={styles.colorsRow}>
          {colorOptions.map((c) => (
            <Pressable
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
    color: '#000000',
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
    color: '#000000',
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
    borderWidth: 1,
    borderColor: '#000000',
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
    color: '#000000',
    fontWeight: '600',
  },
  freqTextActive: {
    color: '#030303',
    fontWeight: 'bold',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  optionActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  optionText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#ffffff',
  },
  subtaskInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtaskInput: {
    flex: 1,
  },
  addSubtask: {
    width: 42,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addSubtaskText: {
    color: '#ffffff',
    fontSize: 22,
    lineHeight: 24,
  },
  subtaskEditorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingVertical: 6,
  },
  subtaskEditorText: {
    flex: 1,
    color: '#000000',
    fontSize: 13,
  },
  removeText: {
    color: '#ef4444',
    fontSize: 22,
    paddingHorizontal: 8,
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