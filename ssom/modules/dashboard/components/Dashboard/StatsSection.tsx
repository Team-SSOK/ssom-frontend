import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components';
import StatsCard from './StatsCard';

interface StatsSectionProps {
  unreadAlertsCount: number;
  errorLogsCount: number;
  criticalIssuesCount: number;
  openIssuesCount: number;
  servicesCount: number;
  isLoadingAlerts: boolean;
  isLoadingLogs: boolean;
  isLoadingIssues: boolean;
}

export default function StatsSection({
  unreadAlertsCount,
  errorLogsCount,
  criticalIssuesCount,
  openIssuesCount,
  servicesCount,
  isLoadingAlerts,
  isLoadingLogs,
  isLoadingIssues,
}: StatsSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.statsSection}>
      <Text variant="h5" weight="semiBold" style={{ marginBottom: 12 }}>현황 요약</Text>
      <View style={styles.statsGrid}>
        <StatsCard
          title="읽지 않은 알림"
          count={unreadAlertsCount}
          icon="bell"
          iconType="octicons"
          color="orange"
          isLoading={isLoadingAlerts}
          onPress={() => router.push('/(app)/(tabs)/alerts')}
        />
        <StatsCard
          title="에러 로그"
          count={errorLogsCount}
          icon="alert"
          iconType="octicons"
          color="red"
          isLoading={isLoadingLogs}
          onPress={() => router.push('/(app)/(tabs)/loggings')}
        />
        <StatsCard
          title="열린 이슈"
          count={openIssuesCount}
          icon="issue-opened"
          iconType="octicons"
          color="gray"
          isLoading={isLoadingIssues}
          onPress={() => router.push('/(app)/(tabs)/issues')}
        />
        <StatsCard
          title="활성 서비스"
          count={servicesCount}
          icon="server"
          color="green"
          onPress={() => router.push('/(app)/(tabs)/grafana')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
}); 