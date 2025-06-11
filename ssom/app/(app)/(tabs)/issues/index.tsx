import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, RefreshControl, View, Pressable } from 'react-native';
import { Text } from '@/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useRefreshControl } from '@/hooks/useRefreshControl';
import { useIssueStore } from '@/modules/issues/stores/issueStore';
import IssueStatusSummary from '@/modules/issues/components/Dashboard/IssueStatusSummary';
import IssueList from '@/modules/issues/components/Dashboard/IssueList';
import IssueTabNavigation from '@/modules/issues/components/Dashboard/IssueTabNavigation';
import { LoadingIndicator } from '@/components';
import IssueHeader from '@/modules/issues/components/Dashboard/IssueHeader';

export default function IssuesListScreen() {
  const { colors } = useTheme();
  const { showError } = useToast();
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  
  // 이슈 관련 상태
  const { 
    allIssues, 
    isLoadingIssues, 
    issuesError, 
    myIssues, 
    isLoadingMyIssues, 
    myIssuesError,
    getAllIssues, 
    getMyIssues,
    clearError 
  } = useIssueStore();

  useEffect(() => {
    getAllIssues();
    getMyIssues();
  }, []);

  // 에러 처리
  useEffect(() => {
    if (issuesError || myIssuesError) {
      showError({ 
        title: '이슈 목록 로드 오류', 
        message: issuesError || myIssuesError || '이슈를 불러오는 중 오류가 발생했습니다.' 
      });
      clearError();
    }
  }, [issuesError, myIssuesError]);

  // Tab 변경 핸들러
  const handleTabChange = (tab: 'my' | 'all') => {
    setActiveTab(tab);
  };

  const refreshHandler = useCallback(async () => {
    await Promise.all([
      getAllIssues(),
      getMyIssues()
    ]);
  }, [getAllIssues, getMyIssues]);

  const { refreshing, onRefresh } = useRefreshControl({ 
    onRefresh: refreshHandler 
  });

  // 현재 활성 탭에 따른 이슈 데이터 선택
  const currentIssues = activeTab === 'my' ? myIssues : allIssues;
  const isCurrentLoading = activeTab === 'my' ? isLoadingMyIssues : isLoadingIssues;

  const transformedIssues = currentIssues.map(issue => ({
    id: issue.issueId.toString(),
    title: issue.title,
    status: issue.status,
    createdAt: issue.createdAt,
    description: issue.description,
  }));

  const allTransformedIssues = allIssues.map(issue => ({
    id: issue.issueId.toString(),
    title: issue.title,
    status: issue.status,
    createdAt: issue.createdAt,
    description: issue.description,
  }));

  if (isCurrentLoading && !refreshing) {
    return <LoadingIndicator />
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <IssueHeader />

      {/* Summary */}
      <IssueStatusSummary issues={allTransformedIssues} />
      
      {/* Tab Navigation */}
      <IssueTabNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      {/* Issue List */}
      <IssueList 
        issues={transformedIssues}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]} 
            tintColor={colors.primary} 
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 8,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 