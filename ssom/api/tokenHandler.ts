import axios from 'axios';
import { getTokens, saveTokens } from '@/services/tokenService';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { logTokenRefresh } from './logger';

const BASE_URL = 'https://ssom.ssok.kr/api';

// 토큰 갱신용 별도 클라이언트 (인터셉터 없음)
const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// 토큰 갱신 진행 중인지 추적
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

/**
 * 대기 중인 요청들을 처리하는 함수
 */
const processQueue = (error: any, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * 토큰 갱신이 진행 중인지 확인
 */
export const getIsRefreshing = () => isRefreshing;

/**
 * 토큰 갱신 대기열에 요청 추가
 */
export const addToRefreshQueue = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
};

/**
 * 토큰 갱신 처리
 */
export const handleTokenRefresh = async (): Promise<string> => {
  if (isRefreshing) {
    throw new Error('Token refresh already in progress');
  }

  isRefreshing = true;

  try {
    const { refreshToken } = await getTokens();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const { data } = await refreshClient.post('/users/refresh', {
      refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      data.result;

    await saveTokens(newAccessToken, newRefreshToken);

    processQueue(undefined, newAccessToken);
    logTokenRefresh(true);

    return newAccessToken;
  } catch (refreshError) {
    logTokenRefresh(false, refreshError);

    // 대기 중인 요청들에 실패 알림
    processQueue(refreshError, undefined);

    // 인증 상태 초기화
    useAuthStore.getState().resetAuth();

    throw refreshError;
  } finally {
    isRefreshing = false;
  }
};

/**
 * 토큰 갱신 상태 리셋 (테스트용)
 */
export const resetTokenRefreshState = () => {
  isRefreshing = false;
  failedQueue = [];
}; 