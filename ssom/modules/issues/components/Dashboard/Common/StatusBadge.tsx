import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface StatusBadgeProps {
  status: string;
  variant?: 'status' | 'priority';
}

export default function StatusBadge({ status, variant = 'status' }: StatusBadgeProps) {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return colors.critical;
      case 'IN_PROGRESS':
        return colors.warning;
      case 'CLOSE':
      case 'CLOSED':
        return colors.success || colors.primary;
      default:
        return colors.textMuted;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getStatusColor(status) },
      ]}
    >
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
}); 