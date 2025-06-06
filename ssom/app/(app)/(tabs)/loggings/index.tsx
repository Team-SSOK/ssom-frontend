
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useLogStore } from '@/modules/logging/stores/logStore';
import { useLogStream } from '@/modules/logging/hooks/useLogStream';
import LogSearchBar from '@/modules/logging/components/LogDashboard/LogSearchBar';
import LogFilterTabs from '@/modules/logging/components/LogDashboard/LogFilterTabs';
import LogServiceDropdown from '@/modules/logging/components/LogDashboard/LogServiceDropdown';
import LogSelectionToolbar from '@/modules/logging/components/LogDashboard/LogSelectionToolbar';
import LogList from '@/modules/logging/components/LogDashboard/LogList';



export default function LogsScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedService, setSelectedService] = useState('ALL');
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  
  // logStore 사용
  const { logs, services, isLoading, fetchLogs, fetchServices, setFilters } = useLogStore();
  
  // SSE 스트림 사용
  const { logs: sseLogs, connect } = useLogStream();

  // 화면 진입시 SSE 자동 연결
  useEffect(() => {
    connect();
  }, [connect]);

  // 서비스 목록 로드
  useEffect(() => {
    const loadServices = async () => {
      try {
        await fetchServices();
      } catch (error) {
        console.log('서비스 목록 로드 실패:', error);
      }
    };

    loadServices();
  }, [fetchServices]);

  // 필터 변경 시 서버에서 데이터 다시 로드
  useEffect(() => {
    const applyFilters = async () => {
      const filters: { app?: string; level?: string } = {};
      
      if (selectedLevel !== 'ALL') {
        filters.level = selectedLevel;
      }
      
      if (selectedService !== 'ALL') {
        filters.app = selectedService;
      }
      
      try {
        setFilters(filters);
        await fetchLogs(filters);
      } catch (error) {
        toast.error('로그 로드 실패', '로그 데이터를 불러오는데 실패했습니다.');
      }
    };

    applyFilters();
  }, [selectedLevel, selectedService, setFilters, fetchLogs]);

  // SSE 로그와 기존 로그 합치기 (SSE 로그가 위에 오도록)
  const combinedLogs = [...sseLogs, ...logs];

  // 클라이언트 사이드 검색 필터링 (서버 검색이 없으므로)
  const filteredLogs = combinedLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const handleLogSelect = (logId: string) => {
    setSelectedLogIds(prev => {
      if (prev.includes(logId)) {
        return prev.filter(id => id !== logId);
      } else {
        return [...prev, logId];
      }
    });
  };

  const handleLogLongPress = (logId: string) => {
    // 다중 선택 모드 활성화 및 해당 로그 선택
    setIsMultiSelectMode(true);
    setSelectedLogIds([logId]);
  };

  const handleClearSelection = () => {
    setSelectedLogIds([]);
    setIsMultiSelectMode(false);
  };

  const handleCreateIssuesFromLogs = () => {
    if (selectedLogIds.length === 0) return;

    const selectedLogs = filteredLogs.filter(log => selectedLogIds.includes(log.logId));
    
    // Pass multiple log IDs and combined metadata
    router.push({
      pathname: '/(app)/(tabs)/issues/create',
      params: {
        fromLog: 'true',
        logIds: selectedLogIds.join(','),
        multiSelect: 'true',
        logApps: selectedLogs.map(log => log.app).join(','),
        logLevels: selectedLogs.map(log => log.level).join(','),
      },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.filterSection}>
        <LogSearchBar 
          searchText={searchText}
          onSearchChange={setSearchText}
        />
        <View style={styles.filterRow}>
          <LogFilterTabs 
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
          />
          <LogServiceDropdown
            services={services}
            selectedService={selectedService}
            onServiceChange={setSelectedService}
            isLoading={isLoading}
          />
        </View>
      </View>

      {isMultiSelectMode && (
        <LogSelectionToolbar
          selectedCount={selectedLogIds.length}
          onCreateIssues={handleCreateIssuesFromLogs}
          onClearSelection={handleClearSelection}
        />
      )}

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
    paddingVertical: 16
  },
  filterSection: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


 