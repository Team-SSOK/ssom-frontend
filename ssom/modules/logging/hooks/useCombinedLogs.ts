import { useMemo } from 'react';
import { LogEntry } from '../types';

interface UseCombinedLogsParams {
  sseLogs: LogEntry[];
  storeLogs: LogEntry[];
  searchText: string;
}

export function useCombinedLogs({ sseLogs, storeLogs, searchText }: UseCombinedLogsParams) {
  // SSE 로그와 기존 로그 합치기 + 중복 제거 (logId 기준) - useMemo로 최적화
  const combinedLogs = useMemo(() => {
    // 모든 로그를 합친 후 logId 기준으로 중복 제거
    const allLogs = [...sseLogs, ...storeLogs];
    const logMap = new Map<string, LogEntry>();
    
    // logId를 키로 사용하여 중복 제거 (나중에 추가된 로그가 우선)
    allLogs.forEach(log => {
      logMap.set(log.logId, log);
    });
    
    // Map의 값들을 배열로 변환
    return Array.from(logMap.values());
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