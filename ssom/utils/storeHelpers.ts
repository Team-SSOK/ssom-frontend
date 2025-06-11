/**
 * Zustand 스토어용 공통 헬퍼 함수들
 * 
 * 책임:
 * - 반복되는 에러 처리 로직 통합
 * - 일관된 로딩 상태 관리
 * - 에러 메시지 표준화
 * - 사용자 친화적 에러 알림
 */

import Toast from 'react-native-toast-message';

/**
 * 비동기 액션을 안전하게 실행하는 래퍼 함수
 * Toss 원칙: 일관된 에러 처리 패턴 적용
 */
export async function executeAsyncAction<T>(
  action: () => Promise<T>,
  options: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    errorMessage?: string;
    onSuccess?: (result: T) => void;
  }
): Promise<T> {
  const { setLoading, setError, errorMessage, onSuccess } = options;
  
  setLoading(true);
  setError(null);
  
  try {
    const result = await action();
    onSuccess?.(result);
    return result;
  } catch (error) {
    const message = error instanceof Error 
      ? error.message 
      : errorMessage || '작업 중 오류가 발생했습니다.';
    
    // Toss 원칙: 개발자용 로그와 사용자용 알림 분리
    if (__DEV__) console.error('Store action error:', error);
    
    // 사용자에게 친화적인 에러 토스트 표시
    Toast.show({
      type: 'error',
      text1: '오류 발생',
      text2: message,
      visibilityTime: 4000,
    });
    
    setError(message);
    throw error; // 일관된 에러 전파
  } finally {
    setLoading(false);
  }
}

/**
 * 에러 메시지를 표준화하는 함수
 * Toss 원칙: 명확하고 일관된 에러 메시지
 */
export function standardizeErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return fallbackMessage;
}

/**
 * 배열에서 중복을 제거하는 유틸리티 (ID 기반)
 * Toss 원칙: 순수 함수로 부작용 없는 데이터 변환
 */
export function deduplicateById<T extends { id: number | string }>(
  items: T[],
  getId?: (item: T) => number | string
): T[] {
  const getIdFn = getId || ((item: T) => item.id);
  const seen = new Set<number | string>();
  
  return items.filter(item => {
    const id = getIdFn(item);
    if (seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });
} 