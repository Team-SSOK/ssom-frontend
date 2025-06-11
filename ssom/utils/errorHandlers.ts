/**
 * 에러 처리 유틸리티
 * 스토어 레벨: console.error로 내부 로깅 (개발 환경에만)
 * UI 레벨: 사용자 친화적인 Toast 메시지 제공
 */

export interface ErrorHandlingOptions {
  /** 스토어나 훅 이름 (로깅용) */
  context?: string;
  /** 사용자에게 보여줄 기본 메시지 */
  userMessage?: string;
  /** 개발자 로깅 여부 (기본: true) */
  logToConsole?: boolean;
}

/**
 * 스토어 레벨에서 사용하는 에러 핸들러
 * 개발 환경에서만 console.error로 로깅하고 에러를 다시 throw
 */
export const handleStoreError = (
  error: unknown,
  context: string,
  additionalInfo?: string
): never => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (__DEV__) {
    const logMessage = additionalInfo 
      ? `[${context}] ${additionalInfo}: ${errorMessage}`
      : `[${context}] ${errorMessage}`;
    console.error(logMessage, error);
  }
  
  // UI에서 처리할 수 있도록 에러를 다시 throw
  throw error;
};

/**
 * 일반적인 HTTP 상태 코드에 따른 사용자 친화적 메시지 생성
 */
export const getHttpErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (!(error instanceof Error)) {
    return defaultMessage;
  }

  const message = error.message.toLowerCase();
  
  // 인증 관련 에러
  if (message.includes('401') || message.includes('unauthorized')) {
    return '로그인이 만료되었습니다. 다시 로그인해주세요.';
  }
  
  // 권한 관련 에러
  if (message.includes('403') || message.includes('forbidden')) {
    return '해당 기능에 대한 권한이 없습니다.';
  }
  
  // 찾을 수 없음
  if (message.includes('404') || message.includes('not found')) {
    return '요청하신 정보를 찾을 수 없습니다.';
  }
  
  // 서버 에러
  if (message.includes('500') || message.includes('internal server error')) {
    return '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  // 서비스 이용 불가
  if (message.includes('503') || message.includes('service unavailable')) {
    return '서비스가 일시적으로 이용할 수 없습니다. 잠시 후 다시 시도해주세요.';
  }
  
  // 타임아웃
  if (message.includes('timeout')) {
    return '요청 시간이 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해주세요.';
  }
  
  // 네트워크 에러
  if (message.includes('network') || message.includes('fetch')) {
    return '네트워크 연결을 확인해주세요.';
  }
  
  return defaultMessage;
};

/**
 * 특정 기능별 에러 메시지 매핑
 */
export const getFeatureSpecificErrorMessage = (
  feature: 'login' | 'password' | 'alert' | 'log' | 'issue' | 'analysis',
  error: unknown
): string => {
  const baseMessages = {
    login: '로그인에 실패했습니다.',
    password: '비밀번호 변경에 실패했습니다.',
    alert: '알림 처리에 실패했습니다.',
    log: '로그 처리에 실패했습니다.',
    issue: '이슈 처리에 실패했습니다.',
    analysis: 'AI 분석에 실패했습니다.',
  };

  if (!(error instanceof Error)) {
    return baseMessages[feature];
  }

  const message = error.message.toLowerCase();

  switch (feature) {
    case 'login':
      if (message.includes('401')) {
        return '직원 ID 또는 비밀번호가 올바르지 않습니다.';
      }
      break;
      
    case 'password':
      if (message.includes('400')) {
        return '현재 비밀번호가 올바르지 않거나 새 비밀번호가 정책에 맞지 않습니다.';
      }
      break;
      
    case 'analysis':
      if (message.includes('503')) {
        return 'AI 분석 서비스가 일시적으로 이용할 수 없습니다.';
      }
      if (message.includes('400')) {
        return '분석할 수 없는 데이터 형식입니다.';
      }
      break;
  }

  return getHttpErrorMessage(error, baseMessages[feature]);
};

/**
 * 에러 타입 판별 유틸리티
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes('network') || message.includes('fetch') || message.includes('timeout');
};

export const isAuthError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes('401') || message.includes('unauthorized');
};

export const isServerError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes('500') || message.includes('503') || message.includes('internal server error');
}; 