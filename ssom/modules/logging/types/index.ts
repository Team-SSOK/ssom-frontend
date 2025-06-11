// 공통 로그 타입 정의
export interface LogEntry {
  logId: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  logger: string;
  thread: string;
  message: string;
  app: string;
}

// 서비스 정보 타입
export interface ServiceInfo {
  serviceName: string;
  count: number;
}

// 로그 필터 옵션
export interface LogFilters {
  app?: string;    // 서비스 이름으로 필터링
  level?: string;  // 로그 레벨로 필터링 (WARN, ERROR 등)
}

// 무한 스크롤을 위한 확장된 로그 필터
export interface LogFiltersWithPagination extends LogFilters {
  searchAfterTimestamp?: string;  // 이전에 마지막으로 조회한 로그의 timestamp
  searchAfterId?: string;         // 이전에 마지막으로 조회한 로그의 로그 ID
}

// SSE 이벤트 리스너 타입
export type LogEventListener = (log: LogEntry) => void;
export type ConnectionEventListener = (event: { type: 'connected' | 'disconnected' | 'connecting' | 'reconnecting' | 'error'; message: string }) => void;

// API 응답 타입 (공통 타입으로 이동됨)

export interface ServicesResponse {
  services: ServiceInfo[];
}

export interface LogsResponse {
  logs: LogEntry[];
}

// 무한 스크롤을 위한 확장된 로그 응답 타입
export interface LogsResponseWithPagination {
  logs: LogEntry[];
  lastTimestamp?: string;  // 다음 페이지 요청을 위한 마지막 타임스탬프
  lastLogId?: string;      // 다음 페이지 요청을 위한 마지막 로그 ID
}

// LLM 분석 결과 타입
export interface LogAnalysisResult {
  summary: string;
  location: {
    file: string;
    function: string;
  };
  solution: string;
  solution_detail: string;
}

export interface LogAnalysisResponse {
  summary: string;
  location: {
    file: string;
    function: string;
  };
  solution: string;
  solution_detail: string;
} 