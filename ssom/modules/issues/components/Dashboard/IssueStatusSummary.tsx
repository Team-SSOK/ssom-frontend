import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface Issue {
  status: string;
}

interface IssueStatusSummaryProps {
  issues: Issue[];
}

export default function IssueStatusSummary({ issues }: IssueStatusSummaryProps) {
  const { colors } = useTheme();

  const criticalCount = issues.filter(issue => issue.status === 'ERROR').length;
  const warningCount = issues.filter(issue => issue.status === 'WARN').length;

  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.statNumber, { color: colors.critical }]}>
          {criticalCount}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          ERROR
        </Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.statNumber, { color: colors.warning }]}>
          {warningCount}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          WARNING
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
}); 