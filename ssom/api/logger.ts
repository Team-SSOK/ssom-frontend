import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * API 로깅 전용 파일
 * 
 * 책임:
 * - API 요청/응답 로그 출력 (개발 환경에서만)
 * - 토큰 갱신 관련 로그
 * - 인증 관련 특별 상황 로그
 * 
 * 역할 제한:
 * - 에러 처리 없음 (순수 로깅만)
 * - 비즈니스 로직 없음
 * - 프로덕션 환경에서는 동작 안함
 */

const LOG_TAG = '[apiInstance]';

interface RequestLogData {
  method: string;
  url: string;
  headers: Record<string, string>;
  data: any;
  params: any;
}

interface ResponseLogData {
  method: string;
  url: string;
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
}

interface ErrorLogData {
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  errorMessage: string;
  responseData?: any;
  headers?: any;
  isNetworkError: boolean;
  isTimeoutError: boolean;
}

/**
 * API 요청 로그를 출력합니다
 */
export const logRequest = (config: AxiosRequestConfig, accessToken?: string, isAuthEndpoint = false) => {
  if (!__DEV__) return;

  const logData: RequestLogData = {
    method: config.method?.toUpperCase() || 'UNKNOWN',
    url: `${config.baseURL}${config.url}`,
    headers: {
      Authorization: !isAuthEndpoint && accessToken 
        ? `Bearer ${accessToken.substring(0, 20)}...` 
        : isAuthEndpoint ? 'Not required' : 'None',
      'Content-Type': config.headers?.['Content-Type'] || 'application/json',
    },
    data: config.data || 'No body',
    params: config.params || 'No params',
  };

  console.log(`${LOG_TAG}[REQUEST] 🚀`, logData);
};

/**
 * API 응답 성공 로그를 출력합니다
 */
export const logResponse = (response: AxiosResponse) => {
  if (!__DEV__) return;

  const logData: ResponseLogData = {
    method: response.config.method?.toUpperCase() || 'UNKNOWN',
    url: response.config.url || 'UNKNOWN',
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: {
      'content-type': response.headers['content-type'] || '',
      'content-length': response.headers['content-length'] || '',
    },
  };

  console.log(`${LOG_TAG}[RESPONSE] ✅`, logData);
};

/**
 * API 응답 실패 로그를 출력합니다
 */
export const logError = (error: AxiosError) => {
  if (!__DEV__) return;

  const { response, config, message } = error;

  const logData: ErrorLogData = {
    method: config?.method?.toUpperCase() || 'UNKNOWN',
    url: config?.url || 'UNKNOWN',
    status: response?.status,
    statusText: response?.statusText,
    errorMessage: message,
    responseData: response?.data,
    headers: response?.headers,
    isNetworkError: !response && message.includes('Network'),
    isTimeoutError: message.includes('timeout'),
  };

  console.log(`${LOG_TAG}[RESPONSE] ❌`, logData);
};

/**
 * 특별한 상황에 대한 로그를 출력합니다
 */
export const logInfo = (message: string, data?: any) => {
  if (!__DEV__) return;
  
  if (data) {
    console.log(`${LOG_TAG}[INFO] ℹ️ ${message}`, data);
  } else {
    console.log(`${LOG_TAG}[INFO] ℹ️ ${message}`);
  }
};

/**
 * 토큰 갱신 관련 로그를 출력합니다
 */
export const logTokenRefresh = (success: boolean, error?: any) => {
  if (!__DEV__) return;

  if (success) {
    console.log(`${LOG_TAG}[RESPONSE] 🔄 토큰 갱신 성공`);
  } else {
    console.log(`${LOG_TAG}[RESPONSE] ❌ 토큰 갱신 실패:`, error);
  }
};

/**
 * 인증 관련 특별 상황 로그
 */
export const logAuthEvent = (event: string, url?: string) => {
  if (!__DEV__) return;

  switch (event) {
    case 'auth_endpoint_401':
      console.log(`${LOG_TAG}[RESPONSE] 인증 엔드포인트에서 401 에러, 토큰 갱신 시도하지 않음: ${url}`);
      break;
    case 'fcm_register_error':
      console.log(`${LOG_TAG}[RESPONSE] FCM 등록 중 토큰 오류, 로그인 프로세스 유지`);
      break;
    case '401_error_check':
      console.log(`${LOG_TAG}[RESPONSE] 401 에러 체크:`, { url });
      break;
  }
}; 