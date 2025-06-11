import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';

interface Issue {
  status: string;
}

interface IssueStatusSummaryProps {
  issues: Issue[];
}

export default function IssueStatusSummary({ issues }: IssueStatusSummaryProps) {
  const { colors } = useTheme();

  const openCount = issues.filter(issue => issue.status === 'OPEN').length;
  const closeCount = issues.filter(issue => issue.status === 'CLOSED').length;

  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, { backgroundColor: colors.card }]}>
        <Text variant="h4" weight="bold" style={[styles.statNumber, { color: colors.critical }]}>
          {openCount}
        </Text>
        <Text variant="caption" weight="medium" style={[styles.statLabel, { color: colors.textSecondary }]}>
          OPEN
        </Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: colors.card }]}>
        <Text variant="h4" weight="bold" style={[styles.statNumber, { color: colors.success || colors.primary }]}>
          {closeCount}
        </Text>
        <Text variant="caption" weight="medium" style={[styles.statLabel, { color: colors.textSecondary }]}>
          CLOSE
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    marginBottom: 4,
  },
  statLabel: {
    textTransform: 'uppercase',
  },
}); 