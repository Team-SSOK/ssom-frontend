import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ConnectionStatus } from '../Common/ConnectionStatus';
import LogSearchBar from './LogSearchBar';
import LogFilterTabs from './LogFilterTabs';
import LogServiceDropdown from './LogServiceDropdown';
import LogSelectionToolbar from './LogSelectionToolbar';
import { ServiceInfo } from '../../types';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'cooldown';

export interface LogToolbarContainerProps {
  // 검색 관련
  searchText: string;
  onSearchChange: (text: string) => void;
  
  // 필터 관련
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  selectedService: string;
  onServiceChange: (service: string) => void;
  services: ServiceInfo[];
  isLoading: boolean;
  
  // 연결 상태 관련
  connectionStatus: ConnectionState;
  connectionMessage: string;
  onRetryConnection: () => void;
  reconnectAttempts: number;
  
  // 다중 선택 관련
  isMultiSelectMode: boolean;
  selectedCount: number;
  onCreateIssues: () => void;
  onClearSelection: () => void;
}

export default function LogToolbarContainer({
  // 검색
  searchText,
  onSearchChange,
  
  // 필터
  selectedLevel,
  onLevelChange,
  selectedService,
  onServiceChange,
  services,
  isLoading,
  
  // 연결 상태
  connectionStatus,
  connectionMessage,
  onRetryConnection,
  reconnectAttempts,
  
  // 다중 선택
  isMultiSelectMode,
  selectedCount,
  onCreateIssues,
  onClearSelection,
}: LogToolbarContainerProps) {
  return (
    <View style={styles.container}>
      {/* 검색 및 필터 섹션 */}
      <View style={styles.filterSection}>
        <LogSearchBar 
          searchText={searchText}
          onSearchChange={onSearchChange}
        />
        <View style={styles.filterRow}>
          <LogFilterTabs 
            selectedLevel={selectedLevel}
            onLevelChange={onLevelChange}
          />
          <LogServiceDropdown
            services={services}
            selectedService={selectedService}
            onServiceChange={onServiceChange}
            isLoading={isLoading}
          />
        </View>
      </View>

      {/* SSE 연결 상태 표시 */}
      <View style={styles.connectionSection}>
        <ConnectionStatus
          status={connectionStatus}
          message={reconnectAttempts > 0 ? `${connectionMessage} (${reconnectAttempts}/10)` : connectionMessage}
          onRetry={onRetryConnection}
          showRetryButton={true}
        />
      </View>

      {/* 다중 선택 툴바 */}
      {isMultiSelectMode && (
        <LogSelectionToolbar
          selectedCount={selectedCount}
          onCreateIssues={onCreateIssues}
          onClearSelection={onClearSelection}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
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
  connectionSection: {
    paddingHorizontal: 16,
  },
}); 