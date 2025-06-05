
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useLogStore } from '@/modules/logging/stores/logStore';
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

  // 서비스 목록 로드
  useEffect(() => {
    const loadServices = async () => {
      try {
        await fetchServices();
      } catch (error) {
        console.error('서비스 목록 로드 실패:', error);
        // 서비스 목록 로드 실패는 치명적이지 않으므로 toast 없이 진행
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

  // 클라이언트 사이드 검색 필터링 (서버 검색이 없으므로)
  const filteredLogs = logs.filter(log => {
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


// // ========== SSE 테스트 UI ==========
// import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTheme } from '@/hooks/useTheme';
// import { useLogStream } from '@/modules/logs/hooks/useLogStream';
// import { FontFamily } from '@/styles/fonts';

// export default function LogsScreen() {
//   const { colors } = useTheme();
//   const { 
//     logs, 
//     connectionStatus, 
//     connectionMessage, 
//     connect, 
//     disconnect, 
//     clearLogs, 
//     isConnected 
//   } = useLogStream();

//   const getStatusColor = () => {
//     switch (connectionStatus) {
//       case 'connected': return colors.success || '#4CAF50';
//       case 'connecting': 
//       case 'reconnecting': return colors.warning || '#FF9800';
//       case 'error': return colors.critical || '#F44336';
//       default: return colors.textMuted;
//     }
//   };

//   const formatTime = (timestamp: string) => {
//     try {
//       return new Date(timestamp).toLocaleTimeString('ko-KR');
//     } catch {
//       return timestamp;
//     }
//   };

//   const getLevelColor = (level: string) => {
//     switch (level) {
//       case 'ERROR': return '#F44336';
//       case 'WARN': return '#FF9800';
//       case 'INFO': return '#2196F3';
//       case 'DEBUG': return '#9E9E9E';
//       default: return colors.text;
//     }
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       {/* 헤더 */}
//       <View style={styles.header}>
//         <Text style={[styles.title, { color: colors.text }]}>
//           SSE 로그 스트림 테스트
//         </Text>
        
//         {/* 연결 상태 */}
//         <View style={styles.statusContainer}>
//           <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
//           <Text style={[styles.statusText, { color: colors.text }]}>
//             {connectionMessage}
//           </Text>
//         </View>
        
//         {/* 컨트롤 버튼들 */}
//         <View style={styles.buttonContainer}>
//           <Pressable
//             style={[
//               styles.button, 
//               { backgroundColor: isConnected ? colors.critical : colors.primary }
//             ]}
//             onPress={isConnected ? disconnect : connect}
//             disabled={connectionStatus === 'connecting'}
//           >
//             <Text style={[styles.buttonText, { color: colors.white }]}>
//               {isConnected ? '연결 해제' : connectionStatus === 'connecting' ? '연결 중...' : '연결'}
//             </Text>
//           </Pressable>
          
//           <Pressable
//             style={[styles.button, { backgroundColor: colors.textMuted }]}
//             onPress={clearLogs}
//           >
//             <Text style={[styles.buttonText, { color: colors.white }]}>
//               로그 지우기
//             </Text>
//           </Pressable>
//         </View>
//       </View>

//       {/* 로그 목록 */}
//       <ScrollView 
//         style={styles.logContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         {logs.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={[styles.emptyText, { color: colors.textMuted }]}>
//               {isConnected ? '로그를 기다리는 중...' : 'SSE 연결을 시작하세요'}
//             </Text>
//           </View>
//         ) : (
//           logs.map((log, index) => (
//             <View 
//               key={`${log.logId}-${index}`} 
//               style={[styles.logItem, { backgroundColor: colors.card, borderColor: colors.border }]}
//             >
//               {/* 로그 헤더 */}
//               <View style={styles.logHeader}>
//                 <Text style={[styles.logLevel, { color: getLevelColor(log.level) }]}>
//                   {log.level}
//                 </Text>
//                 <Text style={[styles.logTime, { color: colors.textMuted }]}>
//                   {formatTime(log.timestamp)}
//                 </Text>
//                 <Text style={[styles.logApp, { color: colors.primary }]}>
//                   {log.app}
//                 </Text>
//               </View>
              
//               {/* 로그 메시지 */}
//               <Text style={[styles.logMessage, { color: colors.text }]}>
//                 {log.message}
//               </Text>
              
//               {/* 로그 세부정보 */}
//               <Text style={[styles.logDetails, { color: colors.textMuted }]}>
//                 {log.logger} • {log.thread}
//               </Text>
//             </View>
//           ))
//         )}
//       </ScrollView>
      
//       {/* 하단 정보 */}
//       <View style={styles.footer}>
//         <Text style={[styles.footerText, { color: colors.textMuted }]}>
//           로그 수: {logs.length}/100 | 상태: {connectionStatus}
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingVertical: 16
//   },
//   header: {
//     padding: 16,
//     paddingBottom: 12,
//   },
//   title: {
//     fontSize: 24,
//     fontFamily: FontFamily.bold,
//     fontWeight: '700',
//     marginBottom: 16,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   statusText: {
//     fontSize: 14,
//     fontFamily: FontFamily.medium,
//     fontWeight: '500',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   button: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 80,
//   },
//   buttonText: {
//     fontSize: 14,
//     fontFamily: FontFamily.medium,
//     fontWeight: '500',
//   },
//   logContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontFamily: FontFamily.regular,
//     textAlign: 'center',
//   },
//   logItem: {
//     marginBottom: 8,
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//   },
//   logHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//     gap: 8,
//   },
//   logLevel: {
//     fontSize: 12,
//     fontFamily: FontFamily.bold,
//     fontWeight: '700',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     minWidth: 50,
//     textAlign: 'center',
//   },
//   logTime: {
//     fontSize: 12,
//     fontFamily: FontFamily.medium,
//   },
//   logApp: {
//     fontSize: 11,
//     fontFamily: FontFamily.medium,
//     flex: 1,
//     textAlign: 'right',
//   },
//   logMessage: {
//     fontSize: 14,
//     fontFamily: FontFamily.regular,
//     lineHeight: 20,
//     marginBottom: 4,
//   },
//   logDetails: {
//     fontSize: 11,
//     fontFamily: FontFamily.regular,
//     opacity: 0.7,
//   },
//   footer: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(0,0,0,0.1)',
//   },
//   footerText: {
//     fontSize: 12,
//     fontFamily: FontFamily.regular,
//     textAlign: 'center',
//   },
// }); 