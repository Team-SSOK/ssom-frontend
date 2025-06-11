import { create } from 'zustand';
import { logApi } from '@/modules/logging/apis/logApi';
import { LogEntry, ServiceInfo, LogFilters, LogFiltersWithPagination, LogAnalysisResult } from '@/modules/logging/types';
import { LOG_CONFIG } from '@/api/constants';

interface LogState {
  // 상태
  logs: LogEntry[];
  services: ServiceInfo[];
  isLoading: boolean;
  filters: LogFilters;
  
  // 무한 스크롤 관련 상태
  isLoadingMore: boolean;
  hasMoreLogs: boolean;
  lastTimestamp?: string;
  lastLogId?: string;
  
  // 로그 상세 조회 관련 상태
  currentLog: LogEntry | null;
  isLoadingCurrentLog: boolean;
  
  // LLM 분석 관련 상태
  analysisResult: LogAnalysisResult | null;
  isAnalyzing: boolean;
  hasExistingAnalysis: boolean | null;
  
  // 액션
  fetchLogs: (filters?: LogFilters) => Promise<void>;
  fetchServices: () => Promise<void>;
  setFilters: (filters: LogFilters) => void;
  clearLogs: () => void;
  addLog: (log: LogEntry) => void; // SSE로 받은 로그 추가용
  
  // 무한 스크롤 관련 액션
  fetchInitialLogs: (filters?: LogFilters) => Promise<void>;
  fetchMoreLogs: () => Promise<void>;
  resetPagination: () => void;
  
  // 로그 상세 조회 관련 액션
  fetchLogById: (logId: string) => Promise<void>;
  clearCurrentLog: () => void;
  
  // LLM 분석 관련 액션
  getExistingAnalysis: (logId: string) => Promise<void>;
  createAnalysis: (logData: LogEntry) => Promise<void>;
  clearAnalysis: () => void;
}

export const useLogStore = create<LogState>((set, get) => ({
  // 초기 상태
  logs: [],
  services: [],
  isLoading: false,
  filters: {},
  
  // 무한 스크롤 관련 초기 상태
  isLoadingMore: false,
  hasMoreLogs: true,
  lastTimestamp: undefined,
  lastLogId: undefined,
  
  // 로그 상세 조회 관련 초기 상태
  currentLog: null,
  isLoadingCurrentLog: false,
  
  // LLM 분석 관련 초기 상태
  analysisResult: null,
  isAnalyzing: false,
  hasExistingAnalysis: null,

  // 로그 목록 조회 (기존 방식 - 호환성 유지)
  fetchLogs: async (filters?: LogFilters) => {
    set({ isLoading: true });
    
    try {
      const logs = await logApi.getLogs(filters || get().filters);
      set({ logs, isLoading: false });
    } catch (error) {
      console.log('로그 조회 실패:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 무한 스크롤을 위한 초기 로그 조회
  fetchInitialLogs: async (filters?: LogFilters) => {
    set({ isLoading: true });
    
    try {
      const currentFilters = filters || get().filters;
      const response = await logApi.getLogsWithPagination(currentFilters);
      
      set({ 
        logs: response.logs,
        lastTimestamp: response.lastTimestamp,
        lastLogId: response.lastLogId,
        hasMoreLogs: response.logs.length > 0 && (response.lastTimestamp !== undefined || response.lastLogId !== undefined),
        isLoading: false 
      });
    } catch (error) {
      console.log('초기 로그 조회 실패:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 추가 로그 조회 (무한 스크롤)
  fetchMoreLogs: async () => {
    const { isLoadingMore, hasMoreLogs, filters, lastTimestamp, lastLogId } = get();
    
    if (isLoadingMore || !hasMoreLogs) {
      return;
    }
    
    set({ isLoadingMore: true });
    
    try {
      const paginationFilters: LogFiltersWithPagination = {
        ...filters,
        searchAfterTimestamp: lastTimestamp,
        searchAfterId: lastLogId,
      };
      
      const response = await logApi.getLogsWithPagination(paginationFilters);
      
      const { logs: currentLogs } = get();
      const newLogs = [...currentLogs, ...response.logs];
      
      set({ 
        logs: newLogs,
        lastTimestamp: response.lastTimestamp,
        lastLogId: response.lastLogId,
        hasMoreLogs: response.logs.length > 0 && (response.lastTimestamp !== undefined || response.lastLogId !== undefined),
        isLoadingMore: false 
      });
    } catch (error) {
      console.log('추가 로그 조회 실패:', error);
      set({ isLoadingMore: false });
      throw error;
    }
  },

  // 페이지네이션 상태 초기화
  resetPagination: () => {
    set({
      lastTimestamp: undefined,
      lastLogId: undefined,
      hasMoreLogs: true,
    });
  },

  // 서비스 목록 조회
  fetchServices: async () => {
    try {
      const services = await logApi.getServices();
      set({ services });
    } catch (error) {
              if(__DEV__) console.error('[LogStore] 서비스 목록 조회 실패:', error);
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
    if (exists) {
      console.log('🔍 [LogStore] 중복 로그 무시:', log.logId);
      return;
    }
    
    // 최신 로그를 맨 앞에 추가 (최대 개수 제한)
    const newLogs = [log, ...logs].slice(0, LOG_CONFIG.MAX_LOGS_COUNT);
    console.log('🔍 [LogStore] 로그 추가됨:', {
      logId: log.logId,
      총개수: newLogs.length,
      이전개수: logs.length,
    });
    set({ logs: newLogs });
  },

  // 기존 LLM 분석 결과 조회
  getExistingAnalysis: async (logId: string) => {
    try {
      const result = await logApi.getExistingAnalysis(logId);
      if (result) {
        set({ 
          analysisResult: result, 
          hasExistingAnalysis: true 
        });
      } else {
        set({ 
          analysisResult: null, 
          hasExistingAnalysis: false 
        });
      }
    } catch (error) {
      if(__DEV__) console.log('기존 분석 조회 실패:', error);
      set({ 
        analysisResult: null, 
        hasExistingAnalysis: false 
      });
      throw error;
    }
  },

  // 새로운 LLM 분석 요청
  createAnalysis: async (logData: LogEntry) => {
    set({ isAnalyzing: true });
    
    try {
      const result = await logApi.createAnalysis(logData);
      set({ 
        analysisResult: result, 
        hasExistingAnalysis: true,
        isAnalyzing: false 
      });
    } catch (error) {
              if(__DEV__) console.error('[LogStore] 분석 요청 실패:', error);
      set({ isAnalyzing: false });
      throw error;
    }
  },

  // 로그 상세 조회
  fetchLogById: async (logId: string) => {
    set({ isLoadingCurrentLog: true });
    
    try {
      const log = await logApi.getLogById(logId);
      set({ 
        currentLog: log, 
        isLoadingCurrentLog: false 
      });
    } catch (error) {
              if(__DEV__) console.error('[LogStore] 로그 상세 조회 실패:', error);
      set({ isLoadingCurrentLog: false });
      throw error;
    }
  },

  // 현재 로그 초기화
  clearCurrentLog: () => {
    set({ currentLog: null });
  },

  // 분석 결과 초기화
  clearAnalysis: () => {
    set({
      analysisResult: null,
      isAnalyzing: false,
      hasExistingAnalysis: null,
    });
  },
})); 