import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components';

interface RecentItemProps {
  title: string;
  subtitle: string;
  time: string;
  status?: string;
  statusColor?: string;
  onPress?: () => void;
}

export default function RecentItem({ title, subtitle, time, status, statusColor, onPress }: RecentItemProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.recentItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      android_ripple={{ color: colors.primary + '10' }}
    >
      <View style={styles.recentItemContent}>
        <Text variant="body2" weight="medium" style={[styles.recentItemTitle, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text variant="body3" style={[styles.recentItemSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
        <Text variant="caption" style={[styles.recentItemTime, { color: colors.textSecondary }]}>
          {time}
        </Text>
      </View>
      {status && (
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text variant="caption" weight="semiBold" style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    marginBottom: 4,
  },
  recentItemSubtitle: {
    marginBottom: 4,
  },
  recentItemTime: {
    // 스타일은 variant로 처리
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  statusText: {
    // 스타일은 variant와 weight로 처리
  },
}); 