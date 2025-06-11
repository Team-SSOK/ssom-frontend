import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useLogStore } from '@/modules/logging/stores/logStore';
import { useLogStream } from '@/modules/logging/hooks/useLogStream';
import { useLogFilters } from '@/modules/logging/hooks/useLogFilters';
import { useMultiSelectLogs } from '@/modules/logging/hooks/useMultiSelectLogs';
import { useCombinedLogs } from '@/modules/logging/hooks/useCombinedLogs';
import LogToolbarContainer from '@/modules/logging/components/LogDashboard/LogToolbarContainer';
import LogList from '@/modules/logging/components/LogDashboard/LogList';

export default function LogsScreen() {
  const { colors } = useTheme();
  
  // 인증 상태 가져오기
  const { isAuthenticated, user } = useAuthStore();
  
  // 이 화면에서만 로깅 SSE 연결 관리 및 상태 가져오기
  const {
    connectionStatus,
    connectionMessage,
    reconnectAttempts,
    connect,
    disconnect,
    forceReconnect,
  } = useLogStream();
  
  // 인증 상태에 따른 자동 연결/해제
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🟢 Logging 화면 - SSE 연결 시작');
      connect();
    }
    
    // 화면 나갈 때 연결 해제
    return () => {
      console.log('🔴 Logging 화면 - SSE 연결 해제');
      disconnect();
    };
  }, [isAuthenticated, user, connect, disconnect]);
  
  // 로그 필터링 훅 (무한 스크롤 지원)
  const {
    logs: storeLogs,
    services,
    isLoading,
    isLoadingMore,
    hasMoreLogs,
    currentFilters,
    setSearchText,
    setSelectedLevel,
    setSelectedService,
    fetchMoreLogs,
  } = useLogFilters();

  // SSE 연결은 이 화면에서 관리하므로, 스토어의 실시간 로그 사용
  const { logs: realtimeLogs } = useLogStore();

  // 다중 선택 훅
  const {
    selectedLogIds,
    isMultiSelectMode,
    selectedCount,
    handleLogSelect,
    handleLogLongPress,
    handleClearSelection,
    handleCreateIssuesFromLogs,
  } = useMultiSelectLogs();

  // 로그 결합 및 필터링 훅
  const {
    filteredLogs,
  } = useCombinedLogs({
    sseLogs: realtimeLogs, // 스토어의 실시간 로그 사용
    storeLogs,
    searchText: currentFilters.searchText,
  });

  // 이슈 생성 핸들러 (필터된 로그 전달)
  const handleCreateIssues = useCallback(() => {
    handleCreateIssuesFromLogs(filteredLogs);
  }, [handleCreateIssuesFromLogs, filteredLogs]);

  // 재연결 핸들러
  const handleRetryConnection = useCallback(() => {
    console.log('수동 재연결 시도');
    forceReconnect();
  }, [forceReconnect]);

  // 무한 스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreLogs) {
      fetchMoreLogs();
    }
  }, [fetchMoreLogs, isLoadingMore, hasMoreLogs]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* 통합된 툴바 컨테이너 */}
      <LogToolbarContainer
        // 검색
        searchText={currentFilters.searchText}
        onSearchChange={setSearchText}
        
        // 필터
        selectedLevel={currentFilters.selectedLevel}
        onLevelChange={setSelectedLevel}
        selectedService={currentFilters.selectedService}
        onServiceChange={setSelectedService}
        services={services}
        isLoading={isLoading}
        
        // 실제 SSE 연결 상태
        connectionStatus={connectionStatus}
        connectionMessage={connectionMessage}
        onRetryConnection={handleRetryConnection}
        reconnectAttempts={reconnectAttempts}
        
        // 다중 선택
        isMultiSelectMode={isMultiSelectMode}
        selectedCount={selectedCount}
        onCreateIssues={handleCreateIssues}
        onClearSelection={handleClearSelection}
      />

      {/* 로그 목록 또는 로딩 인디케이터 */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <LogList 
          logs={filteredLogs}
          isMultiSelectMode={isMultiSelectMode}
          selectedLogIds={selectedLogIds}
          onLogSelect={handleLogSelect}
          onLogLongPress={handleLogLongPress}
          // 무한 스크롤 관련 props
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
          hasMoreLogs={hasMoreLogs}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


 