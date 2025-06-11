import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';

interface IssueDetailMetadataProps {
  assigneeGithubIds: string[];
  createdByEmployeeId: string;
  githubIssueNumber: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function IssueDetailMetadata({ 
  assigneeGithubIds, 
  createdByEmployeeId, 
  githubIssueNumber, 
  createdAt, 
  updatedAt 
}: IssueDetailMetadataProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Details
      </Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            담당자:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {assigneeGithubIds.join(', ') || '미지정'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            생성자:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {createdByEmployeeId}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            GitHub 이슈 번호:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {githubIssueNumber || '미연동'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            생성일:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {new Date(createdAt).toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            수정일:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {new Date(updatedAt).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
  },
}); 