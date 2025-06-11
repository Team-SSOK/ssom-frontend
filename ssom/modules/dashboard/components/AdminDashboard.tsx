import React, { useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useRefreshControl } from '@/hooks/useRefreshControl';
import { useAlertStore } from '@/modules/alerts/stores/alertStore';
import { useLogStore } from '@/modules/logging/stores/logStore';
import { useIssueStore } from '@/modules/issues/stores/issueStore';
import { useFab } from '@/contexts/FabContext';

// Components
import DashboardHeader from './Dashboard/DashboardHeader';
import StatsSection from './Dashboard/StatsSection';
import RecentSection from './Dashboard/RecentSection';

// Utils
import { formatTime, getStatusColor } from '../utils/dashboardUtils';

export default function AdminDashboard() {
  const { colors } = useTheme();
  const { showError } = useToast();
  const { handleScroll } = useFab();
  
  // Store states
  const { alerts, isLoading: isLoadingAlerts, loadAlerts } = useAlertStore();
  const { logs, isLoading: isLoadingLogs, fetchLogs, services, fetchServices } = useLogStore();
  const { allIssues, isLoadingIssues, getAllIssues } = useIssueStore();

  useEffect(() => {
    // 초기 데이터 로드
    loadAlerts().catch(error => {
      if (__DEV__) console.error('알림 로드 실패:', error);
    });
    fetchLogs().catch(error => {
      if (__DEV__) console.error('로그 로드 실패:', error);
    });
    fetchServices().catch(error => {
      if (__DEV__) console.error('서비스 로드 실패:', error);
    });
    getAllIssues().catch(error => {
      if (__DEV__) console.error('이슈 로드 실패:', error);
    });
  }, []);

  // 새로고침 핸들러
  const refreshHandler = useCallback(async () => {
    try {
      await Promise.all([
        loadAlerts(),
        fetchLogs(),
        fetchServices(),
        getAllIssues()
      ]);
    } catch (error) {
      showError({
        title: '데이터 새로고침 실패',
        message: '일부 데이터를 불러오는데 실패했습니다.'
      });
    }
  }, [loadAlerts, fetchLogs, fetchServices, getAllIssues, showError]);

  const { refreshing, onRefresh } = useRefreshControl({ 
    onRefresh: refreshHandler 
  });

  // 통계 계산
  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length;
  const errorLogsCount = logs.filter(log => log.level === 'ERROR').length;
  const criticalIssuesCount = allIssues.filter(issue => issue.status === 'CRITICAL').length;
  const openIssuesCount = allIssues.filter(issue => issue.status !== 'RESOLVED').length;

  // 최근 항목들 변환 (최신 5개)
  const recentIssues = allIssues.slice(0, 5).map(issue => ({
    key: issue.issueId,
    title: issue.title,
    subtitle: issue.description,
    time: formatTime(issue.createdAt),
    status: issue.status,
    statusColor: getStatusColor(issue.status),
    onPress: () => router.push(`/issues/${issue.issueId}`)
  }));

  const recentLogs = logs.slice(0, 5).map(log => ({
    key: log.logId,
    title: log.message,
    subtitle: `${log.app} • ${log.logger}`,
    time: formatTime(log.timestamp),
    status: log.level,
    statusColor: getStatusColor(log.level),
    onPress: () => {
      // 로그 상세 페이지로 이동 (필요시 구현)
    }
  }));

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={[colors.primary]} 
          tintColor={colors.primary} 
        />
      }
    >
      <DashboardHeader />
      
      <StatsSection
        unreadAlertsCount={unreadAlertsCount}
        errorLogsCount={errorLogsCount}
        criticalIssuesCount={criticalIssuesCount}
        openIssuesCount={openIssuesCount}
        servicesCount={services.length}
        isLoadingAlerts={isLoadingAlerts}
        isLoadingLogs={isLoadingLogs}
        isLoadingIssues={isLoadingIssues}
      />

      <RecentSection
        title="최근 이슈"
        items={recentIssues}
        onSeeAll={() => router.navigate('/(app)/(tabs)/issues/')}
        emptyMessage="최근 이슈가 없습니다"
      />

      <RecentSection
        title="최근 로그"
        items={recentLogs}
        onSeeAll={() => router.push('/(app)/(tabs)/loggings')}
        emptyMessage="최근 로그가 없습니다"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 