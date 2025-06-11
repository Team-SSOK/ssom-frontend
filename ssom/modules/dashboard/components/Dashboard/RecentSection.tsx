import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components';
import RecentItem from './RecentItem';

interface RecentSectionProps {
  title: string;
  items: Array<{
    key: string | number;
    title: string;
    subtitle: string;
    time: string;
    status?: string;
    statusColor?: string;
    onPress?: () => void;
  }>;
  onSeeAll: () => void;
  emptyMessage: string;
}

export default function RecentSection({ title, items, onSeeAll, emptyMessage }: RecentSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="h5" weight="semiBold">{title}</Text>
        <Pressable onPress={onSeeAll}>
          <Text variant="body2" weight="medium" style={{ color: colors.primary }}>전체 보기</Text>
        </Pressable>
      </View>
      <View style={[styles.recentContainer, { backgroundColor: colors.card }]}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <RecentItem
              key={item.key}
              title={item.title}
              subtitle={item.subtitle}
              time={item.time}
              status={item.status}
              statusColor={item.statusColor}
              onPress={item.onPress}
            />
          ))
        ) : (
          <Text variant="body2" style={[styles.emptyText, { color: colors.textSecondary }]}>
            {emptyMessage}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    // 스타일은 variant와 weight로 처리
  },
  seeAllText: {
    // 스타일은 variant와 weight로 처리
  },
  recentContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
  },
}); 