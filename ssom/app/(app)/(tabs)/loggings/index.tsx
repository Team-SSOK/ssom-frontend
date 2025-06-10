import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLogStore } from '@/modules/logging/stores/logStore';
import { useLogFilters } from '@/modules/logging/hooks/useLogFilters';
import { useMultiSelectLogs } from '@/modules/logging/hooks/useMultiSelectLogs';
import { useCombinedLogs } from '@/modules/logging/hooks/useCombinedLogs';
import LogToolbarContainer from '@/modules/logging/components/LogDashboard/LogToolbarContainer';
import LogList from '@/modules/logging/components/LogDashboard/LogList';

export default function LogsScreen() {
  const { colors } = useTheme();
  
  // 로그 필터링 훅
  const {
    logs: storeLogs,
    services,
    isLoading,
    currentFilters,
    setSearchText,
    setSelectedLevel,
    setSelectedService,
  } = useLogFilters();

  // SSE 연결은 _layout.tsx에서 관리하므로, 여기서는 스토어의 실시간 로그만 사용
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

  // 임시 연결 상태 (SSE는 _layout.tsx에서 관리)
  const connectionStatus = 'connected';
  const connectionMessage = '연결됨 (전역 관리)';
  const handleRetryConnection = () => {
    console.log('연결은 전역에서 관리됩니다');
  };
  const reconnectAttempts = 0;

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
        
        // 연결 상태 (전역 관리)
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


 