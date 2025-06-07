import apiInstance from '@/api/apiInstance';

// 요청 타입 정의
export interface SignInRequest {
  employeeId: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 응답 타입 정의
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  username: string;
  department: string;
  expiresIn: number;
  biometricEnabled: boolean;
  lastLoginAt: string;
}

export interface UserProfile {
  employeeId: string;
  username: string;
  phoneNumber: string;
  department: string;
  departmentCode: number;
  githubId: string;
}

export interface TokenRefreshResult {
  accessToken: string;
  refreshToken: string;
  username: string;
  department: string;
  expiresIn: number;
  biometricEnabled: boolean;
  lastLoginAt: string;
}

export interface UserResponse {
  username: string;
  department: string;
  expiresIn: number;
  biometricEnabled: boolean;
  lastLoginAt: string;
}

export interface SignInResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

/**
 * 인증 관련 API 클래스
 * 
 * 책임:
 * - 인증 관련 API 엔드포인트 호출
 * - 응답 데이터 변환 (필요시)
 * 
 * 참고:
 * - HTTP 에러, 네트워크 에러, 401 토큰 갱신은 interceptors에서 처리됨
 * - 이 클래스는 interceptors를 신뢰하고 순수한 API 호출만 담당
 */
class AuthApi {
  /**
   * 로그인 API 호출
   * POST /users/login
   */
  async signIn(data: SignInRequest): Promise<SignInResponse> {
    const response = await apiInstance.post<ApiResponse<LoginResult>>(
      '/users/login',
      data,
    );

    const { result } = response.data;
    
    // 응답 데이터 변환
    const transformedResponse: SignInResponse = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        username: result.username,
        department: result.department,
        expiresIn: result.expiresIn,
        biometricEnabled: result.biometricEnabled,
        lastLoginAt: result.lastLoginAt,
      },
    };

    return transformedResponse;
  }

  /**
   * 토큰 갱신 API 호출
   * POST /users/refresh
   */
  async refreshToken(refreshToken: string): Promise<TokenRefreshResult> {
    const response = await apiInstance.post<ApiResponse<TokenRefreshResult>>(
      '/users/refresh',
      { refreshToken },
    );

    return response.data.result;
  }

  /**
   * 로그아웃 API 호출
   * POST /users/logout
   */
  async logout(): Promise<void> {
    await apiInstance.post<ApiResponse<null>>('/users/logout');
  }

  /**
   * 내 정보 조회 API 호출
   * GET /users/profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiInstance.get<ApiResponse<UserProfile>>(
      '/users/profile',
    );

    return response.data.result;
  }

  /**
   * 비밀번호 변경 API 호출
   * PATCH /users/password
   */
  async changePassword(data: PasswordChangeRequest): Promise<void> {
    await apiInstance.patch<ApiResponse<null>>('/users/password', data);
  }
}

// 싱글톤 인스턴스
export const authApi = new AuthApi();
