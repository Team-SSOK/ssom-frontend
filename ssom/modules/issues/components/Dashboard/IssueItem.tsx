import React, { memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { getStatusStyle } from '@/modules/issues/utils/statusStyles';

interface Issue {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  description: string;
}

interface IssueItemProps {
  item: Issue;
}

function IssueItem({ item }: IssueItemProps) {
  const { colors } = useTheme();
  const statusStyle = getStatusStyle(item.status, colors);

  const handlePress = () => {
    router.push(`/issues/${item.id}`);
  };

  const formattedDate = new Date(item.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { backgroundColor: colors.surface }
      ]}
      onPress={handlePress}
    >
      <View style={[styles.statusIndicator, { backgroundColor: statusStyle.color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formattedDate}
          </Text>
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </Pressable>
  );
}

// React.memo로 메모이제이션하여 불필요한 리렌더링 방지
export default memo(IssueItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statusIndicator: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 12,
  },
  date: {
    fontSize: 12,
    fontWeight: '400',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 