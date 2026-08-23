import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { useTheme } from '../context/ThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textMuted }]}>{title}</Text>
        {icon && (
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: accentColor ? `${accentColor}1A` : theme.primaryLight },
            ]}
          >
            {icon}
          </View>
        )}
      </View>
      <Text style={[styles.value, { color: accentColor || theme.text }]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSubtle }]}>
          {subtitle}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    margin: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  iconContainer: {
    padding: 6,
    borderRadius: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
  },
});
