import EventSource from 'react-native-sse';
import { getAccessToken } from '@/services/tokenService';
import { apiConfig } from '@/api/apiInstance';
import { LogEntry, LogEventListener, ConnectionEventListener } from '@/modules/logging/types';

/**
 * SSE 로그 스트리밍 서비스
 * 
 * 책임:
 * - Server-Sent Events를 통한 실시간 로그 수신
 * - 연결 관리 및 자동 재연결
 * - JWT 인증 토큰 관리
 * 
 * 참고:
 * - 기존 apiInstance의 baseURL 설정을 재사용
 * - 토큰 관리는 tokenService를 통해 처리
 */
class LoggingSSEService {
  private eventSource: EventSource | null = null;
  private baseUrl: string;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor() {
    // 기존 API 설정과 동일한 baseURL 사용
    this.baseUrl = apiConfig.baseURL;
  }

  // SSE 연결 시작
  async connect(
    onLogReceived: LogEventListener,
    onConnectionEvent: ConnectionEventListener
  ): Promise<void> {
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }

      const sseUrl = `${this.baseUrl}/logging/subscribe`;
      
      this.eventSource = new EventSource(sseUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        timeout: 0,
        pollingInterval: 0, 
      });

      // 연결 오픈 이벤트
      this.eventSource.addEventListener('open', (event) => {
        console.log('🟢 SSE 연결 성공');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        onConnectionEvent({ type: 'connected' });
      });

      // 로그 메시지 수신
      this.eventSource.addEventListener('message', (event) => {
        try {
          if (event.data) {
            console.log('📨 새 로그 수신:', event.data);
            const logData = JSON.parse(event.data) as LogEntry;
            onLogReceived(logData);
          }
        } catch (error) {
          console.log('로그 파싱 오류:', error);
        }
      });

      // 에러 처리
      this.eventSource.addEventListener('error', (event) => {
        console.log('🔴 SSE 연결 오류:', event);
        this.isConnected = false;
        
        if (event.type === 'error') {
          onConnectionEvent({ type: 'error', message: event.message || 'SSE 연결 오류' });
          this.handleReconnect(onLogReceived, onConnectionEvent);
        }
      });

      // 연결 종료
      this.eventSource.addEventListener('close', (event) => {
        console.log('🔴 SSE 연결 종료');
        this.isConnected = false;
        onConnectionEvent({ type: 'disconnected' });
      });

    } catch (error) {
      console.log('SSE 연결 실패:', error);
      onConnectionEvent({ type: 'error', message: '연결 실패' });
    }
  }

  // 자동 재연결 처리
  private handleReconnect(
    onLogReceived: LogEventListener,
    onConnectionEvent: ConnectionEventListener
  ): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('최대 재연결 시도 횟수 초과');
      onConnectionEvent({ type: 'error', message: '재연결 실패 - 최대 시도 횟수 초과' });
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 10000); // 지수 백오프

    console.log(`🔄 ${delay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    onConnectionEvent({ type: 'reconnecting', message: `재연결 중... (${this.reconnectAttempts}/${this.maxReconnectAttempts})` });

    setTimeout(() => {
      this.disconnect();
      this.connect(onLogReceived, onConnectionEvent);
    }, delay);
  }

  // 연결 해제
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.removeAllEventListeners();
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
    this.reconnectAttempts = 0;
    console.log('SSE 연결 해제됨');
  }

  // 연결 상태 확인
  getConnectionStatus(): { connected: boolean; attempts: number } {
    return {
      connected: this.isConnected,
      attempts: this.reconnectAttempts,
    };
  }


}

// 싱글톤 인스턴스
export const loggingSSEApi = new LoggingSSEService(); 