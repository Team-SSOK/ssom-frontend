import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { Octicons } from '@expo/vector-icons';

interface Issue {
  status: string;
}

interface IssueStatusSummaryProps {
  issues: Issue[];
}

export default function IssueStatusSummary({ issues }: IssueStatusSummaryProps) {
  const { colors } = useTheme();

  const openCount = issues.filter(issue =>
    ['OPEN'].includes(issue.status.toUpperCase())
  ).length;
  const closeCount = issues.filter(issue =>
    ['CLOSED'].includes(issue.status.toUpperCase())
  ).length;

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={[styles.statItem, { borderRightColor: colors.border, borderRightWidth: 0.5 }]}>
        <Octicons name="issue-opened" size={14} color={colors.textSecondary} />
        <Text style={[styles.statText, { color: colors.text }]}>
          <Text weight="bold">{openCount}</Text> Open
        </Text>
      </View>
      <View style={styles.statItem}>
        <Octicons name="issue-closed" size={14} color={colors.textSecondary} />
        <Text style={[styles.statText, { color: colors.text }]}>
          <Text weight="bold">{closeCount}</Text> Closed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  statText: {
    fontSize: 14,
  },
}); 