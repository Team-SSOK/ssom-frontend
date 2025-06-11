import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { useIssueStore } from '@/modules/issues/stores/issueStore';
import IssueDetailHeader from '@/modules/issues/components/Detail/IssueDetailHeader';
import IssueDetailInfo from '@/modules/issues/components/Detail/IssueDetailInfo';
import IssueDetailDescription from '@/modules/issues/components/Detail/IssueDetailDescription';
import IssueDetailMetadata from '@/modules/issues/components/Detail/IssueDetailMetadata';
import IssueDetailTags from '@/modules/issues/components/Detail/IssueDetailTags';
import IssueDetailLoadingState from '@/modules/issues/components/Detail/IssueDetailLoadingState';

export default function IssueDetailScreen() {
  const { colors } = useTheme();
  const { showError } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentIssue, isLoadingCurrentIssue, currentIssueError, getIssueById, clearCurrentIssue, clearError } = useIssueStore();

  useEffect(() => {
    if (id) {
      const issueId = parseInt(id, 10);
      if (!isNaN(issueId)) {
        getIssueById(issueId);
      }
    }
  }, [id, getIssueById]);

  useEffect(() => {
    if (currentIssueError) {
      showError({ title: '이슈 로드 오류', message: currentIssueError });
      clearError();
    }
  }, [currentIssueError, showError, clearError]);

  useEffect(() => {
    return () => {
      clearCurrentIssue();
    };
  }, [clearCurrentIssue]);

  if (isLoadingCurrentIssue) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <IssueDetailLoadingState />
      </SafeAreaView>
    );
  }

  if (!currentIssue) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <IssueDetailLoadingState message="이슈를 찾을 수 없습니다." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <IssueDetailHeader issueId={currentIssue.issueId} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <IssueDetailInfo
          title={currentIssue.title}
          status={currentIssue.status}
          isGithubSynced={currentIssue.isGithubSynced}
        />

        <IssueDetailDescription description={currentIssue.description} />

        <IssueDetailMetadata
          assigneeGithubIds={currentIssue.assigneeGithubIds}
          createdByEmployeeId={currentIssue.createdByEmployeeId}
          githubIssueNumber={currentIssue.githubIssueNumber}
          createdAt={currentIssue.createdAt}
          updatedAt={currentIssue.updatedAt}
        />

        <IssueDetailTags logIds={currentIssue.logIds} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 