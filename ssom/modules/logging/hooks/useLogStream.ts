import { useState, useEffect, useCallback, useRef } from 'react';
import { loggingSSEApi } from '@/modules/logging/apis/logSSEApi';
import { useLogStore } from '@/modules/logging/stores/logStore';
import { LogEntry, LogEventListener, ConnectionEventListener } from '@/modules/logging/types';
import Toast from 'react-native-toast-message';

interface UseLogStreamResult {
  logs: LogEntry[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'cooldown';
  connectionMessage: string;
  connect: () => void;
  disconnect: () => void;
  forceReconnect: () => void;
  clearLogs: () => void;
  isConnected: boolean;
  reconnectAttempts: number;
}

export function useLogStream(): UseLogStreamResult {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'cooldown'>('disconnected');
  const [connectionMessage, setConnectionMessage] = useState<string>('연결되지 않음');
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const isConnecting = useRef(false);

  // 로그 스토어에서 addLog 액션 가져오기
  const { addLog } = useLogStore();

  // 컴포넌트 마운트 시 현재 SSE 연결 상태와 동기화
  useEffect(() => {
    const statusInfo = loggingSSEApi.getConnectionStatus();
    setReconnectAttempts(statusInfo.attempts);
    
    if (statusInfo.connected && statusInfo.state === 'connected') {
      setConnectionStatus('connected');
      setConnectionMessage('연결됨');
      console.log('🔄 기존 SSE 연결 상태와 동기화됨');
    } else {
      setConnectionStatus(statusInfo.state);
      switch (statusInfo.state) {
        case 'connecting':
          setConnectionMessage('연결 중...');
          break;
        case 'reconnecting':
          setConnectionMessage('재연결 중...');
          break;
        case 'error':
          setConnectionMessage('연결 오류');
          break;
        case 'cooldown':
          setConnectionMessage('서버 문제로 대기 중...');
          break;
        default:
          setConnectionMessage('연결되지 않음');
      }
    }
  }, []);

  // 새 로그 수신 처리 - 로컬 상태와 스토어 모두 업데이트
  const handleLogReceived: LogEventListener = useCallback((log: LogEntry) => {
    
    // 1. 로컬 상태 업데이트 (기존 로직)
    setLogs(prevLogs => {
      // 중복 방지: 같은 logId가 이미 있으면 추가하지 않음
      const exists = prevLogs.some(existingLog => existingLog.logId === log.logId);
      if (exists) {
        return prevLogs;
      }
      
      // 최신 로그를 맨 위에 추가 (최대 100개로 제한)
      const newLogs = [log, ...prevLogs];
      return newLogs.slice(0, 100);
    });
    
    // 2. 스토어에도 로그 추가 (LogList.tsx에서 사용 가능)
    addLog(log);
  }, [addLog]);

  // 연결 상태 변경 처리
  const handleConnectionEvent: ConnectionEventListener = useCallback((event) => {
    console.log('🔗 연결 이벤트:', event);
    
    // 재연결 시도 횟수 업데이트
    const statusInfo = loggingSSEApi.getConnectionStatus();
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
    // 실제 SSE 연결 상태 확인
    const statusInfo = loggingSSEApi.getConnectionStatus();
    if (isConnecting.current || statusInfo.connected) {
      console.log('이미 연결 중이거나 연결됨');
      return;
    }

    isConnecting.current = true;
    setConnectionStatus('connecting');
    setConnectionMessage('연결 중...');

    loggingSSEApi.connect(handleLogReceived, handleConnectionEvent)
      .then(() => {
        console.log('SSE 연결 시도 완료');
      })
      .catch((error) => {
        if (__DEV__) console.error('[LogStream] SSE 연결 실패:', error);
        
        Toast.show({
          type: 'error',
          text1: '로그 연결 실패',
          text2: '실시간 로그 연결에 실패했습니다.',
          visibilityTime: 4000,
        });
        
        setConnectionStatus('error');
        setConnectionMessage('연결 실패');
      })
      .finally(() => {
        isConnecting.current = false;
      });
  }, [handleLogReceived, handleConnectionEvent]);

  // SSE 연결 해제
  const disconnect = useCallback(() => {
    loggingSSEApi.disconnect();
    setConnectionStatus('disconnected');
    setConnectionMessage('연결 해제됨');
    setReconnectAttempts(0);
    isConnecting.current = false;
  }, []);

  // 수동 재연결 (사용자가 버튼 클릭 시)
  const forceReconnect = useCallback(() => {
    console.log('🔄 수동 재연결 시도');
    setConnectionStatus('connecting');
    setConnectionMessage('재연결 중...');
    isConnecting.current = false;
    
    loggingSSEApi.forceReconnect(handleLogReceived, handleConnectionEvent);
  }, [handleLogReceived, handleConnectionEvent]);

  // 로그 목록 초기화
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    logs,
    connectionStatus,
    connectionMessage,
    connect,
    disconnect,
    forceReconnect,
    clearLogs,
    isConnected: connectionStatus === 'connected',
    reconnectAttempts,
  };
} 