import apiInstance from '@/api/apiInstance';
import { ApiResponse } from '@/api/types';
import { 
  ServiceInfo, 
  LogEntry, 
  LogFilters, 
  LogFiltersWithPagination,
  ServicesResponse, 
  LogsResponse,
  LogsResponseWithPagination,
  LogAnalysisResult 
} from '../types';

/**
 * 로그 관련 API 클래스
 * 
 * 책임:
 * - 로그 관련 API 엔드포인트 호출
 * - 응답 데이터 변환 (필요시)
 * 
 * 참고:
 * - HTTP 에러, 네트워크 에러, 401 토큰 갱신은 interceptors에서 처리됨
 * - 이 클래스는 interceptors를 신뢰하고 순수한 API 호출만 담당
 */
class LogApi {

  /**
   * 서비스 목록 조회 (API 스펙 2번)
   * GET /api/logging/services
   */
  async getServices(): Promise<ServiceInfo[]> {
    const response = await apiInstance.get<ApiResponse<ServicesResponse>>(
      '/logging/services'
    );

    return response.data.result.services;
  }

  /**
   * 로그 목록 조회 (API 스펙 3번)
   * GET /api/logging
   */
  async getLogs(filters?: LogFilters): Promise<LogEntry[]> {
    const params: Record<string, string> = {};
    
    if (filters?.app) {
      params.app = filters.app;
    }
    if (filters?.level) {
      params.level = filters.level;
    }

    const response = await apiInstance.get<ApiResponse<LogsResponse>>(
      '/logging',
      { params }
    );

    return response.data.result.logs;
  }

  /**
   * 무한 스크롤을 위한 로그 목록 조회 (API 스펙 3-2번)
   * GET /api/logging
   */
  async getLogsWithPagination(filters?: LogFiltersWithPagination): Promise<LogsResponseWithPagination> {
    const params: Record<string, string> = {};
    
    if (filters?.app) {
      params.app = filters.app;
    }
    if (filters?.level) {
      params.level = filters.level;
    }
    if (filters?.searchAfterTimestamp) {
      params.searchAfterTimestamp = filters.searchAfterTimestamp;
    }
    if (filters?.searchAfterId) {
      params.searchAfterId = filters.searchAfterId;
    }

    const response = await apiInstance.get<ApiResponse<LogsResponseWithPagination>>(
      '/logging/infinitescroll',
      { params }
    );

    return response.data.result;
  }

  // 특정 앱의 로그만 조회하는 헬퍼 메서드
  async getLogsByApp(appName: string): Promise<LogEntry[]> {
    return this.getLogs({ app: appName });
  }

  // 특정 레벨의 로그만 조회하는 헬퍼 메서드
  async getLogsByLevel(level: string): Promise<LogEntry[]> {
    return this.getLogs({ level });
  }

  // 특정 앱과 레벨의 로그 조회하는 헬퍼 메서드
  async getLogsByAppAndLevel(appName: string, level: string): Promise<LogEntry[]> {
    return this.getLogs({ app: appName, level });
  }

  // 에러 로그만 조회하는 헬퍼 메서드
  async getErrorLogs(): Promise<LogEntry[]> {
    return this.getLogs({ level: 'ERROR' });
  }

  // 경고 로그만 조회하는 헬퍼 메서드
  async getWarningLogs(): Promise<LogEntry[]> {
    return this.getLogs({ level: 'WARN' });
  }

  /**
   * 기존 LLM 분석 결과 조회 (API 스펙 4번)
   * GET /api/logging/{logId}
   */
  async getExistingAnalysis(logId: string): Promise<LogAnalysisResult | null> {
    try {
      const response = await apiInstance.get<ApiResponse<LogAnalysisResult>>(
        `/logging/analysis/${logId}`
      );
      return response.data.result;
    } catch (error: any) {
      // 400 에러(기존 분석 없음)는 null 반환
      if (error.response?.status === 400 || error.response?.data?.code === 8003) {
        return null;
      }
      // 다른 에러는 re-throw
      throw error;
    }
  }

  /**
   * 새로운 LLM 분석 요청 (API 스펙 5번)
   * POST /api/logging
   */
  async createAnalysis(logData: LogEntry): Promise<LogAnalysisResult> {
    const response = await apiInstance.post<ApiResponse<LogAnalysisResult>>(
      '/logging/analysis',
      logData
    );
    return response.data.result;
  }

  /**
   * 로그 상세 조회 (API 스펙 6번)
   * GET /api/logging/{logId}
   */
  async getLogById(logId: string): Promise<LogEntry> {
    const response = await apiInstance.get<ApiResponse<LogEntry>>(
      `/logging/${logId}`
    );
    return response.data.result;
  }
}

// 싱글톤 인스턴스
export const logApi = new LogApi(); 