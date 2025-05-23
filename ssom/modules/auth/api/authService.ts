import { LoginRequest, LoginResponse, ChangePasswordRequest, User, AuthTokens, ApiError } from "../../../types/auth";
import { AUTH_ENDPOINTS } from "../constants/auth";

// 기본 API URL (실제 환경에서는 환경 변수로 관리)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * API 응답 래퍼 타입
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * HTTP 요청 헬퍼 클래스
 */
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: responseData.message || "요청 처리 중 오류가 발생했습니다.",
            code: responseData.code || "UNKNOWN_ERROR",
            details: responseData.details,
          },
        };
      }

      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      console.error("API 요청 실패:", error);
      return {
        success: false,
        error: {
          message: "네트워크 연결을 확인해주세요.",
          code: "NETWORK_ERROR",
        },
      };
    }
  }

  async post<T>(endpoint: string, data?: object, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async put<T>(endpoint: string, data?: object, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

/**
 * 인증 API 서비스
 */
export class AuthService {
  private static httpClient = new HttpClient(API_BASE_URL);

  /**
   * 로그인
   */
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.httpClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  }

  /**
   * 로그아웃
   */
  static async logout(token: string): Promise<ApiResponse<{ message: string }>> {
    return this.httpClient.post<{ message: string }>(AUTH_ENDPOINTS.LOGOUT, {}, token);
  }

  /**
   * 토큰 갱신
   */
  static async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return this.httpClient.post<AuthTokens>(AUTH_ENDPOINTS.REFRESH, {
      refreshToken,
    });
  }

  /**
   * 비밀번호 변경
   */
  static async changePassword(data: ChangePasswordRequest, token: string): Promise<ApiResponse<{ message: string }>> {
    return this.httpClient.put<{ message: string }>(AUTH_ENDPOINTS.CHANGE_PASSWORD, data, token);
  }

  /**
   * 사용자 프로필 조회
   */
  static async getProfile(token: string): Promise<ApiResponse<User>> {
    return this.httpClient.get<User>(AUTH_ENDPOINTS.PROFILE, token);
  }

  /**
   * 토큰 유효성 검사
   */
  static async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.getProfile(token);
      return response.success;
    } catch {
      return false;
    }
  }

  /**
   * 개발용 Mock 응답 (실제 API가 없을 때)
   */
  static async mockLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // 개발용 Mock 데이터
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 네트워크 지연 시뮬레이션

    if (credentials.email === "test@ssom.com" && credentials.password === "password123!") {
      return {
        success: true,
        data: {
          user: {
            id: "1",
            email: credentials.email,
            name: "테스트 사용자",
            department: "IT",
            role: "admin",
            isFirstLogin: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          tokens: {
            accessToken: "mock_access_token_123",
            refreshToken: "mock_refresh_token_456",
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24시간 후
          },
          message: "로그인 성공",
        },
      };
    }

    return {
      success: false,
      error: {
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        code: "INVALID_CREDENTIALS",
      },
    };
  }
}
