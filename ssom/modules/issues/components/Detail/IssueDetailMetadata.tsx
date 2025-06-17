import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface IssueDetailMetadataProps {
  assigneeGithubIds: string[];
  createdByEmployeeId: string;
  githubIssueNumber: number | null;
  createdAt: string;
  updatedAt: string;
}

const DetailRow = ({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={20} color={color} style={styles.icon} />
    <Text style={[styles.detailLabel, { color: color }]}>{label}</Text>
    <Text style={[styles.detailValue, { color: color }]} numberOfLines={1}>{value}</Text>
  </View>
);

export default function IssueDetailMetadata({
  assigneeGithubIds,
  createdByEmployeeId,
  githubIssueNumber,
  createdAt,
  updatedAt
}: IssueDetailMetadataProps) {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
        <DetailRow 
          icon="person-outline"
          label="담당자"
          value={assigneeGithubIds.join(', ') || '미지정'}
          color={colors.textSecondary}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <DetailRow
          icon="create-outline"
          label="생성자"
          value={createdByEmployeeId}
          color={colors.textSecondary}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <DetailRow
          icon="logo-github"
          label="GitHub 이슈"
          value={githubIssueNumber ? `#${githubIssueNumber}` : '미연동'}
          color={colors.textSecondary}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <DetailRow
          icon="calendar-outline"
          label="생성일"
          value={formatDate(createdAt)}
          color={colors.textSecondary}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <DetailRow
          icon="time-outline"
          label="마지막 업데이트"
          value={formatDate(updatedAt)}
          color={colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  icon: {
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '500',
    width: '35%',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
  },
}); 