import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import StatusBadge from '@/modules/issues/components/Dashboard/Common/StatusBadge';

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

  const handlePress = () => {
    router.push(`/issues/${item.id}`);
  };

  return (
    <Pressable
      style={[
        styles.issueCard,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={handlePress}
    >
      <View style={styles.issueHeader}>
        <Text style={[styles.issueTitle, { color: colors.text }]}>
          Issue #{item.id} : {item.title}
        </Text>
      </View>
      <Text style={[styles.issueDescription, { color: colors.textSecondary }]}>
        {item.description}
      </Text>
      <View style={styles.issueFooter}>
        <StatusBadge status={item.status} />
        <Text style={[styles.createdAt, { color: colors.textMuted }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );
}

// React.memo로 메모이제이션하여 불필요한 리렌더링 방지
export default memo(IssueItem);

const styles = StyleSheet.create({
  issueCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  issueDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdAt: {
    fontSize: 12,
  },
}); 