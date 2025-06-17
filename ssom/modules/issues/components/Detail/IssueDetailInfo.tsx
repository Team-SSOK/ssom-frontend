import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { getStatusStyle } from '@/modules/issues/utils/statusStyles';
import { Ionicons } from '@expo/vector-icons';

interface IssueDetailInfoProps {
  title: string;
  status: string;
  isGithubSynced: boolean;
}

export default function IssueDetailInfo({ title, status, isGithubSynced }: IssueDetailInfoProps) {
  const { colors } = useTheme();
  const statusStyle = getStatusStyle(status, colors);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.badgeContainer}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.color }]}>
          <Text style={styles.badgeText}>{statusStyle.text}</Text>
        </View>
        {isGithubSynced && (
          <View style={[styles.githubBadge, { backgroundColor: colors.surface }]}>
            <Ionicons name="logo-github" size={14} color={colors.textSecondary} />
            <Text style={[styles.badgeText, { color: colors.textSecondary, marginLeft: 4 }]}>
              Synced
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 30,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  githubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
}); 