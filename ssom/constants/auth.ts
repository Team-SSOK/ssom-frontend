// 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER_DATA: "auth_user_data",
  TOKEN_EXPIRES_AT: "auth_token_expires_at",
} as const;

// API 엔드포인트
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  CHANGE_PASSWORD: "/auth/change-password",
  PROFILE: "/auth/profile",
} as const;

// 에러 메시지
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 올바르지 않습니다.",
  TOKEN_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요.",
  NETWORK_ERROR: "네트워크 연결을 확인해주세요.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
  PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
  WEAK_PASSWORD: "비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함해야 합니다.",
} as const;

// 검증 규칙
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: "올바른 이메일 형식을 입력해주세요.",
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE: "비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함해야 합니다.",
  },
} as const;

// 토큰 만료 시간 (밀리초)
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5분

// 회사 브랜딩
export const COMPANY_INFO = {
  NAME: "SSOM",
  FULL_NAME: "System Status & Operations Monitoring",
  LOGO_TEXT: "SSOM",
  TAGLINE: "실시간 시스템 관제 솔루션",
} as const;
