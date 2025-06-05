import { create } from 'zustand';
import { logApi } from '@/modules/logging/apis/logApi';
import { LogEntry, ServiceInfo, LogFilters } from '@/modules/logging/types';

interface LogState {
  // 상태
  logs: LogEntry[];
  services: ServiceInfo[];
  isLoading: boolean;
  filters: LogFilters;
  
  // 액션
  fetchLogs: (filters?: LogFilters) => Promise<void>;
  fetchServices: () => Promise<void>;
  setFilters: (filters: LogFilters) => void;
  clearLogs: () => void;
  addLog: (log: LogEntry) => void; // SSE로 받은 로그 추가용
}

export const useLogStore = create<LogState>((set, get) => ({
  // 초기 상태
  logs: [],
  services: [],
  isLoading: false,
  filters: {},

  // 로그 목록 조회
  fetchLogs: async (filters?: LogFilters) => {
    set({ isLoading: true });
    
    try {
      const logs = await logApi.getLogs(filters || get().filters);
      set({ logs, isLoading: false });
    } catch (error) {
      console.error('로그 조회 실패:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 서비스 목록 조회
  fetchServices: async () => {
    try {
      const services = await logApi.getServices();
      set({ services });
    } catch (error) {
      console.error('서비스 목록 조회 실패:', error);
      throw error;
    }
  },

  // 필터 설정
  setFilters: (filters: LogFilters) => {
    set({ filters });
  },

  // 로그 목록 초기화
  clearLogs: () => {
    set({ logs: [] });
  },

  // SSE로 받은 실시간 로그 추가
  addLog: (log: LogEntry) => {
    const { logs } = get();
    
    // 중복 방지
    const exists = logs.some(existingLog => existingLog.logId === log.logId);
    if (exists) return;
    
    // 최신 로그를 맨 앞에 추가 (최대 100개로 제한)
    const newLogs = [log, ...logs].slice(0, 100);
    set({ logs: newLogs });
  },
})); 