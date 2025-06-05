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
 */
export const createResponseErrorInterceptor = (apiInstance: AxiosInstance) => {
  return async (error: AxiosError) => {
    logError(error);

    const { response, config } = error;

    // 401이 아니거나 이미 재시도한 요청이면 그대로 에러 반환
    if (response?.status !== 401 || (config as any)?._retry) {
      return Promise.reject(error);
    }

    // 인증 관련 엔드포인트는 토큰 갱신 시도하지 않음
    if (isAuthEndpoint(config?.url)) {
      logAuthEvent('auth_endpoint_401', config?.url);
      return Promise.reject(error);
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