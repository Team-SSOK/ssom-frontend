/**
 * API 관련 상수 정의
 * 
 * 책임:
 * - 매직 넘버/문자열 제거
 * - 설정값의 의도를 명확히 표현
 * - 타입 안전성 향상
 */

// SSE 연결 설정
export const SSE_CONFIG = {
  /** 최초 재연결 시도 시 지연 시간 (ms) */
  INITIAL_RECONNECT_DELAY_MS: 1000,
  
  /** 최대 재연결 지연 시간 (ms) */
  MAX_RECONNECT_DELAY_MS: 30000,
  
  /** 서버 오류 시 쿨다운 시간 (ms) */
  SERVER_ERROR_COOLDOWN_MS: 60000,
  
  /** 최대 재연결 시도 횟수 */
  MAX_RECONNECT_ATTEMPTS: 10,
  
  /** 백오프 지터 비율 (30%) */
  JITTER_RATIO: 0.3,
} as const;

// API 요청 설정
export const API_CONFIG = {
  /** 기본 API 타임아웃 (ms) */
  DEFAULT_TIMEOUT_MS: 30000,
  
  /** LLM 분석용 확장 타임아웃 (ms) */
  LLM_ANALYSIS_TIMEOUT_MS: 30000,
} as const;

// Alert 관련 설정
export const ALERT_CONFIG = {
  /** 최대 보관할 알림 개수 */
  MAX_ALERTS_COUNT: 100,
} as const;

// 로그 레벨 정의
export const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN', 
  INFO: 'INFO',
  DEBUG: 'DEBUG',
} as const;

export type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];

// HTTP 상태 코드 분류
export const HTTP_STATUS = {
  /** 클라이언트 오류 범위 시작 */
  CLIENT_ERROR_START: 400,
  
  /** 클라이언트 오류 범위 끝 */
  CLIENT_ERROR_END: 499,
  
  /** 서버 오류 범위 시작 */
  SERVER_ERROR_START: 500,
  
  /** 인증 관련 상태 코드들 */
  AUTH_ERRORS: [401, 403] as const,
} as const; 