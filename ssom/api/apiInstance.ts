import axios from 'axios';
import { setupInterceptors } from './interceptors';

/**
 * API 인스턴스 설정 파일
 * 
 * 책임:
 * - Axios 인스턴스 생성 및 기본 설정
 * - Base URL, 타임아웃, 기본 헤더 설정
 * - 인터셉터 연결
 * 
 * 역할 제한:
 * - 에러 처리 없음 (interceptors에서 담당)
 * - 비즈니스 로직 없음 (API 클래스에서 담당)
 */

// const BASE_URL = 'https://ssom.ssok.kr/api';
const BASE_URL = 'http://kudong.kr:55037/api';
const DEFAULT_TIMEOUT = 30000; // LLM 분석을 위해 30초로 증가

/**
 * 메인 API 클라이언트 생성
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 
    'Content-Type': 'application/json' 
  },
  timeout: DEFAULT_TIMEOUT,
});

/**
 * 인터셉터 설정
 */
setupInterceptors(api);

/**
 * API 클라이언트 export
 */
export default api;

/**
 * API 설정 정보 export (필요시 사용)
 */
export const apiConfig = {
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
} as const;
