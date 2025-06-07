import { create } from 'zustand';
import { logApi } from '@/modules/logging/apis/logApi';
import { LogEntry, ServiceInfo, LogFilters, LogAnalysisResult } from '@/modules/logging/types';
import { LOG_CONFIG } from '@/api/constants';

interface LogState {
  // 상태
  logs: LogEntry[];
  services: ServiceInfo[];
  isLoading: boolean;
  filters: LogFilters;
  
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
  
  // 로그 상세 조회 관련 초기 상태
  currentLog: null,
  isLoadingCurrentLog: false,
  
  // LLM 분석 관련 초기 상태
  analysisResult: null,
  isAnalyzing: false,
  hasExistingAnalysis: null,

  // 로그 목록 조회
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

  // 서비스 목록 조회
  fetchServices: async () => {
    try {
      const services = await logApi.getServices();
      set({ services });
    } catch (error) {
      console.log('서비스 목록 조회 실패:', error);
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
    
    // 최신 로그를 맨 앞에 추가 (최대 개수 제한)
    const newLogs = [log, ...logs].slice(0, LOG_CONFIG.MAX_LOGS_COUNT);
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
      console.log('기존 분석 조회 실패:', error);
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
      console.log('분석 요청 실패:', error);
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
      console.log('로그 상세 조회 실패:', error);
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