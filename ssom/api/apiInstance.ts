import axios from 'axios';
import { setupInterceptors } from './interceptors';


const BASE_URL = 'https://ssom.ssok.kr/api';
const DEFAULT_TIMEOUT = 10000;

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
