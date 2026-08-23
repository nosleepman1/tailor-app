import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Delete } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface PinPadProps {
  pin: string;
  onPinChange: (newPin: string) => void;
  maxLength?: number;
}

export const PinPad: React.FC<PinPadProps> = ({ pin, onPinChange, maxLength = 4 }) => {
  const { theme } = useTheme();

  const handleDigitPress = (digit: string) => {
    if (pin.length < maxLength) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPinChange(pin + digit);
    }
  };

  const handleDeletePress = () => {
    if (pin.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPinChange(pin.slice(0, -1));
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

  return (
    <View style={styles.container}>
      {/* PIN Dots Indicator */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: maxLength }).map((_, index) => {
          const filled = index < pin.length;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  borderColor: filled ? theme.primary : theme.border,
                  backgroundColor: filled ? theme.primary : 'transparent',
                },
              ]}
            />
          );
        })}
      </View>

      {/* Numeric Keypad Grid */}
      <View style={styles.grid}>
        {keys.map((key, index) => {
          if (key === '') {
            return <View key={index} style={styles.key} />;
          }

          if (key === 'delete') {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={handleDeletePress}
                style={[styles.key, { backgroundColor: theme.bgLevel2 }]}
              >
                <Delete size={24} color={theme.textMuted} />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => handleDigitPress(key)}
              style={[styles.key, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
            >
              <Text style={[styles.keyText, { color: theme.text }]}>{key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 280,
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
