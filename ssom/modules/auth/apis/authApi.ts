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

// API 클래스
export class AuthApi {
  async signIn(data: SignInRequest): Promise<SignInResponse> {
    try {
      const response = await apiInstance.post<ApiResponse<LoginResult>>(
        '/users/login',
        data,
      );

      const { result } = response.data;
      
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
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * 토큰 갱신 API 호출
   * POST /users/refresh
   */
  async refreshToken(refreshToken: string): Promise<TokenRefreshResult> {
    try {
      const response = await apiInstance.post<ApiResponse<TokenRefreshResult>>(
        '/users/refresh',
        { refreshToken },
      );

      return response.data.result;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * 로그아웃 API 호출
   * POST /users/logout
   */
  async logout(): Promise<void> {
    try {
      await apiInstance.post<ApiResponse<null>>('/users/logout');
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * 내 정보 조회 API 호출
   * GET /users/profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiInstance.get<ApiResponse<UserProfile>>(
        '/users/profile',
      );

      return response.data.result;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * 비밀번호 변경 API 호출
   * PATCH /users/password
   */
  async changePassword(data: PasswordChangeRequest): Promise<void> {
    try {
      await apiInstance.patch<ApiResponse<null>>('/users/password', data);
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * API 에러 처리 유틸리티
   */
  private handleApiError(error: any): Error {
    if (error.response) {
      // 서버에서 응답한 에러
      const status = error.response.status;
      const serverMessage = error.response.data?.message;
      
      // 개발 환경에서 디버깅용 로그
      if (__DEV__) {
        console.log('[AuthApi] 서버 에러 응답:', {
          status,
          serverMessage,
          fullResponse: error.response.data,
        });
      }

      switch (status) {
        case 400:
          // 400 에러는 서버 메시지를 그대로 사용 (유효성 검사 실패 등)
          return new Error(serverMessage || '잘못된 요청입니다.');
        case 401:
          return new Error(serverMessage || '인증에 실패했습니다. 직원 ID와 비밀번호를 확인해주세요.');
        case 403:
          return new Error(serverMessage || '접근 권한이 없습니다.');
        case 409:
          return new Error(serverMessage || '이미 존재하는 데이터입니다.');
        case 429:
          return new Error('너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.');
        case 500:
          return new Error('서버 내부 오류가 발생했습니다.');
        default:
          return new Error(serverMessage || '서버 오류가 발생했습니다.');
      }
    } else if (error.request) {
      // 네트워크 에러
      return new Error('네트워크 연결을 확인해주세요.');
    } else {
      // 기타 에러
      return new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
}

// 싱글톤 인스턴스 생성
export const authApi = new AuthApi();
