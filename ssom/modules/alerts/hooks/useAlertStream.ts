import { useState, useEffect, useCallback, useRef } from 'react';
import { alertSSEApi } from '../apis/alertSSEApi';
import { useAlertStore } from '../stores/alertStore';
import { AlertEntry, AlertEventListener, AlertConnectionEventListener } from '../types';

interface UseAlertStreamResult {
  alerts: AlertEntry[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'cooldown';
  connectionMessage: string;
  connect: () => void;
  disconnect: () => void;
  forceReconnect: () => void;
  loadAlerts: () => Promise<void>;
  markAsRead: (alertId: number) => Promise<void>;
  deleteAlert: (alertId: number) => Promise<void>;
  isConnected: boolean;
  reconnectAttempts: number;
  isLoading: boolean;
  error: string | null;
}

export function useAlertStream(): UseAlertStreamResult {
  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    alerts,
    isLoading,
    error,
    addAlert,
    markAsRead,
    deleteAlert,
    loadAlerts,
  } = useAlertStore();

  // SSE 연결 관련 상태 (로컬 상태로 유지)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'cooldown'>('disconnected');
  const [connectionMessage, setConnectionMessage] = useState<string>('연결되지 않음');
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const isConnecting = useRef(false);
  const connectionStatusRef = useRef<'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'cooldown'>('disconnected');

  // connectionStatus 변경 시 ref 업데이트
  useEffect(() => {
    connectionStatusRef.current = connectionStatus;
  }, [connectionStatus]);

  // 새 알림 수신 처리 - 스토어의 addAlert 사용
  const handleAlertReceived: AlertEventListener = useCallback((alert: AlertEntry) => {
    addAlert(alert);
  }, [addAlert]);

  // 연결 상태 변경 처리
  const handleConnectionEvent: AlertConnectionEventListener = useCallback((event) => {
    console.log('🔗 Alert 연결 이벤트:', event);
    
    // 재연결 시도 횟수 업데이트
    const statusInfo = alertSSEApi.getConnectionStatus();
    setReconnectAttempts(statusInfo.attempts);
    
    switch (event.type) {
      case 'connected':
        setConnectionStatus('connected');
        setConnectionMessage('연결됨');
        break;
      case 'disconnected':
        setConnectionStatus('disconnected');
        setConnectionMessage('연결 해제됨');
        break;
      case 'connecting':
        setConnectionStatus('connecting');
        setConnectionMessage('연결 중...');
        break;
      case 'reconnecting':
        setConnectionStatus('reconnecting');
        setConnectionMessage(event.message || '재연결 중...');
        break;
      case 'error':
        // 서버 문제인지 클라이언트 문제인지 구분
        if (event.message?.includes('500') || event.message?.includes('서버')) {
          setConnectionStatus('cooldown');
        } else {
          setConnectionStatus('error');
        }
        setConnectionMessage(event.message || '연결 오류');
        break;
    }
  }, []);

  // SSE 연결 시작
  const connect = useCallback(() => {
    if (isConnecting.current || connectionStatusRef.current === 'connected') {
      console.log('이미 연결 중이거나 연결됨');
      return;
    }

    isConnecting.current = true;
    setConnectionStatus('connecting');
    setConnectionMessage('연결 중...');

    alertSSEApi.connect(handleAlertReceived, handleConnectionEvent)
      .then(() => {
        console.log('Alert SSE 연결 시도 완료');
      })
      .catch((error) => {
        console.error('Alert SSE 연결 실패:', error);
        setConnectionStatus('error');
        setConnectionMessage('연결 실패');
      })
      .finally(() => {
        isConnecting.current = false;
      });
  }, [handleAlertReceived, handleConnectionEvent]);

  // SSE 연결 해제
  const disconnect = useCallback(() => {
    alertSSEApi.disconnect();
    setConnectionStatus('disconnected');
    setConnectionMessage('연결 해제됨');
    setReconnectAttempts(0);
    isConnecting.current = false;
  }, []);

  // 수동 재연결 (사용자가 버튼 클릭 시)
  const forceReconnect = useCallback(() => {
    console.log('🔄 Alert 수동 재연결 시도');
    setConnectionStatus('connecting');
    setConnectionMessage('재연결 중...');
    isConnecting.current = false;
    
    alertSSEApi.forceReconnect(handleAlertReceived, handleConnectionEvent);
  }, [handleAlertReceived, handleConnectionEvent]);

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    alerts,
    connectionStatus,
    connectionMessage,
    connect,
    disconnect,
    forceReconnect,
    loadAlerts,
    markAsRead,
    deleteAlert,
    isConnected: connectionStatus === 'connected',
    reconnectAttempts,
    isLoading,
    error,
  };
} 