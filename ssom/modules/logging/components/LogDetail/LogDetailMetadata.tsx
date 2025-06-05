import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LogDetailMetadataProps {
  logId: string;
  logger: string;
  thread: string;
  app: string;
}

export default function LogDetailMetadata({ logId, logger, thread, app }: LogDetailMetadataProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        기본 정보
      </Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            로그 ID:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {logId}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Logger:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {logger}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Thread:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {thread}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            애플리케이션:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {app}
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
}); 