/**
 * API 공통 타입 정의
 * 
 * 책임:
 * - 모든 API에서 공통으로 사용되는 응답 타입 정의
 * - 일관된 API 응답 구조 보장
 */

/**
 * 표준 API 응답 포맷
 */
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
}

/**
 * 페이지네이션 메타데이터
 */
// export interface PaginationMeta {
//   page: number;
//   size: number;
//   total: number;
//   totalPages: number;
// }

/**
 * 페이지네이션된 응답
 */
// export interface PaginatedResponse<T> {
//   data: T[];
//   meta: PaginationMeta;
// }

/**
 * 에러 응답 타입
 */
export interface ErrorResponse {
  isSuccess: false;
  code: number;
  message: string;
  result: null;
  timestamp?: string;
  path?: string;
} 