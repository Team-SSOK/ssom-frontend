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

// SSE 이벤트 리스너 타입
export type LogEventListener = (log: LogEntry) => void;
export type ConnectionEventListener = (event: { type: string; message?: string }) => void;

// API 응답 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
}

export interface ServicesResponse {
  services: ServiceInfo[];
}

export interface LogsResponse {
  logs: LogEntry[];
} 