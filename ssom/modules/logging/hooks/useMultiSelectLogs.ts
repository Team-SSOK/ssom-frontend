import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { LogEntry } from '../types';
import { buildLogIssueParams } from '../utils/buildLogIssueParams';

export function useMultiSelectLogs() {
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const handleLogSelect = useCallback((logId: string) => {
    setSelectedLogIds(prev => {
      if (prev.includes(logId)) {
        return prev.filter(id => id !== logId);
      } else {
        return [...prev, logId];
      }
    });
  }, []);

  const handleLogLongPress = useCallback((logId: string) => {
    // 다중 선택 모드 활성화 및 해당 로그 선택
    setIsMultiSelectMode(true);
    setSelectedLogIds([logId]);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedLogIds([]);
    setIsMultiSelectMode(false);
  }, []);

  const selectAll = useCallback((logIds: string[]) => {
    setSelectedLogIds(logIds);
    setIsMultiSelectMode(true);
  }, []);

  const toggleSelectMode = useCallback(() => {
    setIsMultiSelectMode(prev => !prev);
    if (isMultiSelectMode) {
      setSelectedLogIds([]);
    }
  }, [isMultiSelectMode]);

  // 이슈 생성 핸들러
  const handleCreateIssuesFromLogs = useCallback((filteredLogs: LogEntry[]) => {
    if (selectedLogIds.length === 0) return;

    const selectedLogs = filteredLogs.filter(log => selectedLogIds.includes(log.logId));
    
    try {
      const params = buildLogIssueParams(selectedLogs, true);
      
      router.push({
        pathname: '/(app)/(tabs)/issues/create',
        params: params as any,
      });
    } catch (error) {
      console.error('이슈 생성 파라미터 구성 실패:', error);
    }
  }, [selectedLogIds]);

  // 단일 로그에서 이슈 생성
  const handleCreateIssueFromSingleLog = useCallback((log: LogEntry) => {
    try {
      const params = buildLogIssueParams([log], false);
      
      router.push({
        pathname: '/(app)/(tabs)/issues/create',
        params: params as any,
      });
    } catch (error) {
      console.error('단일 로그 이슈 생성 실패:', error);
    }
  }, []);

  return {
    // 상태
    selectedLogIds,
    isMultiSelectMode,
    selectedCount: selectedLogIds.length,
    
    // 액션
    handleLogSelect,
    handleLogLongPress,
    handleClearSelection,
    selectAll,
    toggleSelectMode,
    handleCreateIssuesFromLogs,
    handleCreateIssueFromSingleLog,
  };
} 