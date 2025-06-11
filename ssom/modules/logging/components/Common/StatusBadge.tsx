import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';

interface StatusBadgeProps {
  level: string;
}

export default function StatusBadge({ level }: StatusBadgeProps) {
  const { colors } = useTheme();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return colors.critical;
      case 'WARNING':
        return colors.warning;
      default:
        return colors.textMuted;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getLevelColor(level) },
      ]}
    >
      <Text style={styles.badgeText}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
}); 