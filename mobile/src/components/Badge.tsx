import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CommandeStatus } from '../types';

interface BadgeProps {
  status?: CommandeStatus;
  label?: string;
  variant?: 'gold' | 'green' | 'red' | 'blue' | 'gray';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, variant, style }) => {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'in_progress':
        return { text: 'En confection', bg: theme.primaryLight, color: theme.primaryDark, border: theme.primaryBorder };
      case 'ready':
        return { text: 'Prête', bg: theme.successLight, color: theme.success, border: theme.successLight };
      case 'delivered':
        return { text: 'Livrée', bg: theme.infoLight, color: theme.info, border: theme.infoLight };
      case 'cancelled':
        return { text: 'Annulée', bg: theme.errorLight, color: theme.error, border: theme.errorLight };
      case 'pending':
      default:
        return { text: 'En attente', bg: theme.bgLevel2, color: theme.textMuted, border: theme.border };
    }
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'gold':
        return { text: label || '', bg: theme.primaryLight, color: theme.primaryDark, border: theme.primaryBorder };
      case 'green':
        return { text: label || '', bg: theme.successLight, color: theme.success, border: theme.successLight };
      case 'red':
        return { text: label || '', bg: theme.errorLight, color: theme.error, border: theme.errorLight };
      case 'blue':
        return { text: label || '', bg: theme.infoLight, color: theme.info, border: theme.infoLight };
      case 'gray':
      default:
        return { text: label || '', bg: theme.bgLevel2, color: theme.textMuted, border: theme.border };
    }
  };

  const config = status ? getStatusConfig() : getVariantConfig();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: config.color }]}>
        {label || config.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
