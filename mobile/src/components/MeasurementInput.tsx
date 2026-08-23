import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface MeasurementInputProps {
  label: string;
  value?: number | string | null;
  onChangeValue: (val: string) => void;
  unit?: string;
}

export const MeasurementInput: React.FC<MeasurementInputProps> = ({
  label,
  value,
  onChangeValue,
  unit = 'cm',
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          keyboardType="numeric"
          placeholder="0.0"
          placeholderTextColor={theme.textSubtle}
          value={value !== undefined && value !== null ? String(value) : ''}
          onChangeText={onChangeValue}
          style={[styles.input, { color: theme.text }]}
        />
        <Text style={[styles.unit, { color: theme.textSubtle }]}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '47%',
    margin: 4,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    paddingVertical: 2,
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});
