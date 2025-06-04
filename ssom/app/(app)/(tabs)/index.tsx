import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import DashboardHeader from '@/modules/issue/components/Dashboard/DashboardHeader';
import IssueStatusSummary from '@/modules/issue/components/Dashboard/IssueStatusSummary';
import IssueList from '@/modules/issue/components/Dashboard/IssueList';

// Mock data for demonstration
const mockIssues = [
  {
    id: '1',
    title: 'API 응답 시간 저하',
    status: '오류',
    createdAt: '2024-06-03T10:00:00Z',
    description: '지난 1시간 동안 API 응답 시간이 현저히 증가했습니다',
  },
  {
    id: '2',
    title: '데이터베이스 연결 풀 고갈',
    status: '경고',
    createdAt: '2024-06-03T09:30:00Z',
    description: '모든 데이터베이스 연결이 사용 중입니다',
  },
  {
    id: '3',
    title: '메모리 사용량 경고',
    status: '오류',
    createdAt: '2024-06-03T08:15:00Z',
    description: '메모리 사용량이 80% 임계값을 초과했습니다',
  },
  {
    id: '4',
    title: 'SSL 인증서 만료 임박',
    status: '정보',
    createdAt: '2024-06-03T07:00:00Z',
    description: 'SSL 인증서가 7일 후 만료됩니다',
  },
];

export default function MainDashboard() {
  const { colors } = useTheme();

  const handleViewAllIssues = () => {
    console.log('Navigate to all issues');
    // router.push('/(app)/(tabs)/issues'); // Enable when needed
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <DashboardHeader />
      <IssueStatusSummary issues={mockIssues} />
      <IssueList issues={mockIssues} onViewAll={handleViewAllIssues} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
