import { useMemo } from 'react';
import { LogEntry } from '../types';

interface UseCombinedLogsParams {
  sseLogs: LogEntry[];
  storeLogs: LogEntry[];
  searchText: string;
}

export function useCombinedLogs({ sseLogs, storeLogs, searchText }: UseCombinedLogsParams) {
  // SSE 로그와 기존 로그 합치기 (SSE 로그가 위에 오도록) - useMemo로 최적화
  const combinedLogs = useMemo(() => {
    return [...sseLogs, ...storeLogs];
  }, [sseLogs, storeLogs]);

  // 클라이언트 사이드 검색 필터링 - useMemo로 최적화
  const filteredLogs = useMemo(() => {
    if (!searchText.trim()) {
      return combinedLogs;
    }
    
    const searchLower = searchText.toLowerCase();
    return combinedLogs.filter(log => 
      log.message.toLowerCase().includes(searchLower) ||
      log.app.toLowerCase().includes(searchLower) ||
      log.level.toLowerCase().includes(searchLower)
    );
  }, [combinedLogs, searchText]);

  // 통계 정보 계산 - useMemo로 최적화
  const logStats = useMemo(() => {
    const totalCount = filteredLogs.length;
    const sseCount = sseLogs.length;
    const storeCount = storeLogs.length;
    
    const levelCounts = filteredLogs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const appCounts = filteredLogs.reduce((acc, log) => {
      acc[log.app] = (acc[log.app] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCount,
      sseCount,
      storeCount,
      levelCounts,
      appCounts,
    };
  }, [filteredLogs, sseLogs.length, storeLogs.length]);

  return {
    combinedLogs,
    filteredLogs,
    logStats,
  };
} 