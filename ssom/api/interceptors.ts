import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getTokens } from '@/services/tokenService';
import { logRequest, logResponse, logError, logAuthEvent } from './logger';
import { 
  getIsRefreshing, 
  addToRefreshQueue, 
  handleTokenRefresh 
} from './tokenHandler';

// 토큰이 필요없는 엔드포인트들 (로그인, 토큰 갱신 등)
const AUTH_ENDPOINTS = ['/users/login', '/users/refresh'];

/**
 * 인증이 필요없는 엔드포인트인지 확인
 */
const isAuthEndpoint = (url?: string): boolean => {
  return AUTH_ENDPOINTS.some(endpoint => url?.includes(endpoint));
};

/**
 * HTTP 상태 코드에 따른 사용자 친화적인 에러 메시지 생성
 */
const createUserFriendlyErrorMessage = (error: AxiosError): Error => {
  const { response } = error;
  
  if (response) {
    const status = response.status;
    const serverMessage = (response.data as any)?.message;
    
    // 개발 환경에서 디버깅용 로그
    if (__DEV__) {
      console.log('[API Interceptor] 서버 에러 응답:', {
        status,
        serverMessage,
        fullResponse: response.data,
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
      case 404:
        return new Error('요청한 리소스를 찾을 수 없습니다.');
      case 409:
        return new Error(serverMessage || '이미 존재하는 데이터입니다.');
      case 422:
        return new Error(serverMessage || '입력한 데이터를 처리할 수 없습니다.');
      case 429:
        return new Error('너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.');
      case 500:
        return new Error('서버 내부 오류가 발생했습니다.');
      case 502:
        return new Error('서버 연결 오류가 발생했습니다.');
      case 503:
        return new Error('서비스를 일시적으로 사용할 수 없습니다.');
      default:
        return new Error(serverMessage || '서버 오류가 발생했습니다.');
    }
  } else if (error.request) {
    // 네트워크 에러
    if (error.message?.includes('timeout')) {
      return new Error('요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.');
    }
    return new Error('네트워크 연결을 확인해주세요.');
  } else {
    // 기타 에러
    return new Error('알 수 없는 오류가 발생했습니다.');
  }
};

/**
 * 요청 인터셉터 생성
 */
export const createRequestInterceptor = () => {
  return async (config: InternalAxiosRequestConfig) => {
    try {
      const isAuth = isAuthEndpoint(config.url);

      // 인증이 필요한 엔드포인트에만 토큰 추가
      if (!isAuth) {
        const { accessToken } = await getTokens();
        if (accessToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      // 요청 로그
      const { accessToken } = await getTokens();
      logRequest(config, accessToken || undefined, isAuth);

    } catch (error) {
      if (__DEV__) {
        console.log('[apiInstance][REQUEST] ❌ 토큰 조회 실패:', error);
      }
    }
    return config;
  };
};

/**
 * 요청 에러 인터셉터
 */
export const createRequestErrorInterceptor = () => {
  return (error: any) => {
    if (__DEV__) {
      console.log('[apiInstance][REQUEST] ❌ 인터셉터 오류:', error);
    }
    return Promise.reject(error);
  };
};

/**
 * 응답 성공 인터셉터
 */
export const createResponseInterceptor = () => {
  return (response: AxiosResponse) => {
    logResponse(response);
    return response;
  };
};

/**
 * 응답 에러 인터셉터 생성
 * 
 * 책임:
 * - 401 에러 및 토큰 갱신 처리
 * - HTTP 상태 코드별 사용자 친화적인 에러 메시지 생성
 * - 네트워크 에러 처리
 */
export const createResponseErrorInterceptor = (apiInstance: AxiosInstance) => {
  return async (error: AxiosError) => {
    logError(error);

    const { response, config } = error;

    // 401 에러 처리 및 토큰 갱신
    if (response?.status === 401 && !(config as any)?._retry) {
      // 인증 관련 엔드포인트는 토큰 갱신 시도하지 않음
      if (isAuthEndpoint(config?.url)) {
        logAuthEvent('auth_endpoint_401', config?.url);
        return Promise.reject(createUserFriendlyErrorMessage(error));
      }

      // FCM 등록은 토큰 갱신 시도하지 않음
      if (config?.url?.includes('/notification/fcm/register')) {
        logAuthEvent('fcm_register_error');
        return Promise.reject(new Error('Push notification registration failed'));
      }

      // 이미 토큰 갱신 중이면 대기열에 추가
      if (getIsRefreshing()) {
        await addToRefreshQueue();
        // 토큰 갱신 완료 후 원래 요청 재시도
        (config as any)._retry = true;
        return apiInstance(config!);
      }

      // 토큰 갱신 시작
      (config as any)._retry = true;

      try {
        const newAccessToken = await handleTokenRefresh();
        
        if (config?.headers) {
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // 원래 요청 재시도
        return apiInstance(config!);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // 모든 HTTP 에러에 대해 사용자 친화적인 메시지 생성
    return Promise.reject(createUserFriendlyErrorMessage(error));
  };
};

/**
 * API 인스턴스에 모든 인터셉터 설정
 */
export const setupInterceptors = (apiInstance: AxiosInstance) => {
  // 요청 인터셉터
  apiInstance.interceptors.request.use(
    createRequestInterceptor(),
    createRequestErrorInterceptor()
  );

  // 응답 인터셉터
  apiInstance.interceptors.response.use(
    createResponseInterceptor(),
    createResponseErrorInterceptor(apiInstance)
  );
}; 