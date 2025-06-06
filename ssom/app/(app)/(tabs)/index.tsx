import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useIssueStore } from '@/modules/issues/stores/issueStore';
import DashboardHeader from '@/modules/issues/components/Dashboard/DashboardHeader';
import IssueStatusSummary from '@/modules/issues/components/Dashboard/IssueStatusSummary';
import IssueList from '@/modules/issues/components/Dashboard/IssueList';

// Mock 데이터 제거 - 실제 API 데이터 사용

export default function MainDashboard() {
  const { colors } = useTheme();
  const { showError } = useToast();
  const { allIssues, isLoadingIssues, issuesError, getAllIssues, clearError } = useIssueStore();

  // 컴포넌트 마운트 시 이슈 목록 로드
  useEffect(() => {
    getAllIssues();
  }, [getAllIssues]);

  // 에러 처리
  useEffect(() => {
    if (issuesError) {
      showError({ title: '이슈 목록 로드 오류', message: issuesError });
      clearError();
    }
  }, [issuesError, showError, clearError]);

  const handleViewAllIssues = () => {
    console.log('Navigate to all issues');
    // router.push('/(app)/(tabs)/issues'); // Enable when needed
  };

  // API 데이터를 컴포넌트에서 사용할 수 있는 형태로 변환
  const transformedIssues = allIssues.map(issue => ({
    id: issue.issueId.toString(),
    title: issue.title,
    status: issue.status,
    createdAt: issue.createdAt,
    description: issue.description,
  }));

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoadingIssues) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <DashboardHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            이슈 목록을 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <DashboardHeader />
      <IssueStatusSummary issues={transformedIssues} />
      <IssueList 
        issues={transformedIssues} 
        onViewAll={handleViewAllIssues}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});
