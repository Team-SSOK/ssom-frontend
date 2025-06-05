import { useState, useEffect, useCallback, useRef } from 'react';
import { loggingSSEApi } from '@/modules/logging/sse/loggingSSE';
import { LogEntry, LogEventListener, ConnectionEventListener } from '@/modules/logging/types';

interface UseLogStreamResult {
  logs: LogEntry[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';
  connectionMessage: string;
  connect: () => void;
  disconnect: () => void;
  clearLogs: () => void;
  isConnected: boolean;
}

export function useLogStream(): UseLogStreamResult {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'>('disconnected');
  const [connectionMessage, setConnectionMessage] = useState<string>('연결되지 않음');
  const isConnecting = useRef(false);

  // 새 로그 수신 처리
  const handleLogReceived: LogEventListener = useCallback((log: LogEntry) => {
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
  }, []);

  // 연결 상태 변경 처리
  const handleConnectionEvent: ConnectionEventListener = useCallback((event) => {
    console.log('🔗 연결 이벤트:', event);
    
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
        setConnectionStatus('error');
        setConnectionMessage(event.message || '연결 오류');
        break;
    }
  }, []);

  // SSE 연결 시작
  const connect = useCallback(() => {
    if (isConnecting.current || connectionStatus === 'connected') {
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
        console.error('SSE 연결 실패:', error);
        setConnectionStatus('error');
        setConnectionMessage('연결 실패');
      })
      .finally(() => {
        isConnecting.current = false;
      });
  }, [connectionStatus, handleLogReceived, handleConnectionEvent]);

  // SSE 연결 해제
  const disconnect = useCallback(() => {
    loggingSSEApi.disconnect();
    setConnectionStatus('disconnected');
    setConnectionMessage('연결 해제됨');
    isConnecting.current = false;
  }, []);

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
    clearLogs,
    isConnected: connectionStatus === 'connected',
  };
} 