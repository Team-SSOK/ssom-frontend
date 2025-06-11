import React from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components';

interface StatsCardProps {
  title: string;
  count: number;
  icon: string;
  iconType?: 'ionicons' | 'octicons';
  color: string;
  onPress?: () => void;
  isLoading?: boolean;
  subtitle?: string;
}

export default function StatsCard({ title, count, icon, iconType = 'ionicons', color, onPress, isLoading, subtitle }: StatsCardProps) {
  const { colors } = useTheme();

  const renderIcon = () => {
    if (iconType === 'octicons') {
      return <Octicons name={icon as any} size={24} color={color} />;
    }
    return <Ionicons name={icon as any} size={24} color={color} />;
  };

  return (
    <Pressable
      style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      android_ripple={{ color: colors.primary + '20' }}
    >
      <View style={[styles.statsIconContainer, { backgroundColor: color + '20' }]}>
        {renderIcon()}
      </View>
      <View style={styles.statsContent}>
        <Text variant="caption" style={[styles.statsTitle, { color: colors.textSecondary }]}>{title}</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text variant="h6" weight="bold" style={[styles.statsCount, { color: colors.text }]}>{count.toLocaleString()}</Text>
        )}
        {subtitle && (
          <Text variant="caption" style={[styles.statsSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  statsIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statsContent: {
    flex: 1,
  },
  statsTitle: {
    marginBottom: 4,
  },
  statsCount: {
    // 스타일은 variant와 weight로 처리
  },
  statsSubtitle: {
    marginTop: 2,
  },
}); 