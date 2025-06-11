import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';

interface IssueDetailInfoProps {
  title: string;
  status: string;
  isGithubSynced: boolean;
}

export default function IssueDetailInfo({ title, status, isGithubSynced }: IssueDetailInfoProps) {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN': return '#007AFF';
      case 'IN_PROGRESS': return '#FF9500';
      case 'CLOSED': return '#34C759';
      default: return '#007AFF';
    }
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      
      <View style={styles.metadataRow}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(status) },
          ]}
        >
          <Text style={styles.badgeText}>{status}</Text>
        </View>
        {isGithubSynced && (
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: '#28a745' },
            ]}
          >
            <Text style={styles.badgeText}>GitHub 연동</Text>
          </View>
        )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
}); 