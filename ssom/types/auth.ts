// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  role: "admin" | "operator" | "viewer";
  isFirstLogin: boolean;
  createdAt: string;
  updatedAt: string;
}

// 인증 토큰 타입
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// 로그인 요청 데이터
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 데이터
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

// 비밀번호 변경 요청 데이터
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// API 에러 응답
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

// 인증 상태
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// 인증 컨텍스트 액션
export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; tokens: AuthTokens } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

// 권한 검사를 위한 타입
export type Permission = "read_metrics" | "read_logs" | "manage_users" | "admin_access";

export interface UserPermissions {
  department: string;
  role: string;
  permissions: Permission[];
}
