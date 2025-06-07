import { useEffect, useRef } from 'react';
import { useAlertStream } from './useAlertStream';
import { User } from '@/modules/auth/stores/authStore';

interface UseAlertSSEConnectionParams {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthState {
  isAuthenticated: boolean;
  hasUser: boolean;
}

/**
 * 인증 상태에 따라 Alert SSE 연결을 자동으로 관리하는 훅
 * @param params - 인증 상태 정보
 */
export function useAlertSSEConnection({ isAuthenticated, user }: UseAlertSSEConnectionParams) {
  const { connect: connectAlerts, disconnect: disconnectAlerts, loadAlerts } = useAlertStream();
  
  // 연결 상태 추적 (useEffect 반복 실행 방지)
  const isAlertConnectedRef = useRef(false);
  const currentAuthStateRef = useRef<AuthState>({ 
    isAuthenticated: false, 
    hasUser: false 
  });

  // 인증 상태에 따른 Alert SSE 연결 관리
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
      console.log('🔄 인증 상태 변경 감지:', { 
        이전: currentAuthStateRef.current, 
        현재: newAuthState,
        연결필요: shouldConnect 
      });

      if (shouldConnect && !isAlertConnectedRef.current) {
        // 인증된 사용자 - 연결 및 기존 알림 로드
        console.log('🟢 Alert SSE 연결 시작');
        connectAlerts();
        loadAlerts(); // 기존 알림 데이터 자동 로드
        isAlertConnectedRef.current = true;
      } else if (!shouldConnect && isAlertConnectedRef.current) {
        // 인증되지 않은 상태 - 연결 해제
        console.log('🔴 Alert SSE 연결 해제');
        disconnectAlerts();
        isAlertConnectedRef.current = false;
      }
      
      // 현재 상태 업데이트
      currentAuthStateRef.current = newAuthState;
    }
  }, [isAuthenticated, user, connectAlerts, disconnectAlerts, loadAlerts]);

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      if (isAlertConnectedRef.current) {
        console.log('🔚 앱 종료 - Alert SSE 연결 해제');
        disconnectAlerts();
        isAlertConnectedRef.current = false;
      }
    };
  }, [disconnectAlerts]);

  // 훅의 현재 상태를 반환 (디버깅 용도)
  return {
    isConnected: isAlertConnectedRef.current,
    currentAuthState: currentAuthStateRef.current,
  };
} 