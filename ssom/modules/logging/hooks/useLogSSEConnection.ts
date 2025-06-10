import { useEffect, useRef } from 'react';
import { useLogStream } from './useLogStream';
import { User } from '@/modules/auth/stores/authStore';

interface UseLogSSEConnectionParams {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthState {
  isAuthenticated: boolean;
  hasUser: boolean;
}

/**
 * 인증 상태에 따라 Logging SSE 연결을 자동으로 관리하는 훅
 * @param params - 인증 상태 정보
 */
export function useLogSSEConnection({ isAuthenticated, user }: UseLogSSEConnectionParams) {
  const { connect: connectLogs, disconnect: disconnectLogs } = useLogStream();
  
  // 연결 상태 추적 (useEffect 반복 실행 방지)
  const isLogConnectedRef = useRef(false);
  const currentAuthStateRef = useRef<AuthState>({ 
    isAuthenticated: false, 
    hasUser: false 
  });

  // 인증 상태에 따른 Logging SSE 연결 관리
  useEffect(() => {
    const newAuthState: AuthState = { 
      isAuthenticated: !!isAuthenticated, 
      hasUser: !!user 
    };
    
    const shouldConnect = newAuthState.isAuthenticated && newAuthState.hasUser;
    const authStateChanged = 
      currentAuthStateRef.current.isAuthenticated !== newAuthState.isAuthenticated ||
      currentAuthStateRef.current.hasUser !== newAuthState.hasUser;

    // 인증 상태가 변경되었을 때만 처리
    if (authStateChanged) {
      console.log('🔄 로깅 인증 상태 변경 감지:', { 
        이전: currentAuthStateRef.current, 
        현재: newAuthState,
        연결필요: shouldConnect 
      });

      if (shouldConnect && !isLogConnectedRef.current) {
        // 인증된 사용자 - 연결
        console.log('🟢 Logging SSE 연결 시작');
        connectLogs();
        isLogConnectedRef.current = true;
      } else if (!shouldConnect && isLogConnectedRef.current) {
        // 인증되지 않은 상태 - 연결 해제
        console.log('🔴 Logging SSE 연결 해제');
        disconnectLogs();
        isLogConnectedRef.current = false;
      }
      
      // 현재 상태 업데이트
      currentAuthStateRef.current = newAuthState;
    }
  }, [isAuthenticated, user, connectLogs, disconnectLogs]);

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      if (isLogConnectedRef.current) {
        console.log('🔚 앱 종료 - Logging SSE 연결 해제');
        disconnectLogs();
        isLogConnectedRef.current = false;
      }
    };
  }, [disconnectLogs]);

  // 훅의 현재 상태를 반환 (디버깅 용도)
  return {
    isConnected: isLogConnectedRef.current,
    currentAuthState: currentAuthStateRef.current,
  };
} 