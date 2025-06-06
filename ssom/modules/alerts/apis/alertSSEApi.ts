import EventSource from 'react-native-sse';
import { getAccessToken } from '@/services/tokenService';
import { apiConfig } from '@/api/apiInstance';
import { AlertEntry, AlertEventListener, AlertConnectionEventListener } from '../types';

// 연결 상태 타입 정의
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'cooldown';

/**
 * SSE 알림 스트리밍 서비스
 * 
 * 책임:
 * - Server-Sent Events를 통한 실시간 알림 수신
 * - 스마트한 연결 관리 및 점진적 백오프 재연결
 * - JWT 인증 토큰 관리
 * - 서버 상태 기반 연결 전략
 * 
 * 개선사항:
 * - 점진적 백오프 (exponential backoff with jitter)
 * - 서버 상태별 다른 재연결 전략
 * - 연결 실패 시 쿨다운 모드
 * - 불필요한 console.error 제거
 */
class AlertSSEService {
  private eventSource: EventSource | null = null;
  private baseUrl: string;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private state: ConnectionState = 'disconnected';
  private reconnectTimeoutId: number | null = null;
  private cooldownTimeoutId: number | null = null;
  
  // 백오프 설정
  private readonly baseDelay = 1000; // 1초
  private readonly maxDelay = 30000; // 30초
  private readonly cooldownDelay = 60000; // 1분 쿨다운

  constructor() {
    // 기존 API 설정과 동일한 baseURL 사용
    this.baseUrl = apiConfig.baseURL;
  }

  // SSE 연결 시작
  async connect(
    onAlertReceived: AlertEventListener,
    onConnectionEvent: AlertConnectionEventListener
  ): Promise<void> {
    // 이미 연결 중이거나 쿨다운 상태면 무시
    if (this.state === 'connecting' || this.state === 'connected' || this.state === 'cooldown') {
      return;
    }

    try {
      this.setState('connecting', onConnectionEvent);

      const token = await getAccessToken();
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }

      const sseUrl = `${this.baseUrl}/alert/subscribe`;
      
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
        console.log('🟢 Alert SSE 연결 성공');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.setState('connected', onConnectionEvent);
      });

      // 알림 메시지 수신
      this.eventSource.addEventListener('message', (event) => {
        try {
          if (event.data === 'connected') {
            // SSE 초기화 응답
            console.log('🔔 Alert SSE 초기화 완료');
            this.isConnected = true;
            this.setState('connected', onConnectionEvent);
            return;
          }
          
          if (event.data) {
            console.log('🔔 새 알림 수신:', event.data);
            const alertData = JSON.parse(event.data) as AlertEntry;
            onAlertReceived(alertData);
          }
        } catch (error) {
          console.log('알림 파싱 오류:', error);
        }
      });

      // 에러 처리 - 서버 상태별 다른 전략
      this.eventSource.addEventListener('error', (event: any) => {
        this.isConnected = false;
        
        // 서버 상태 코드에 따른 처리
        const statusCode = event.xhrStatus || event.status || 0;
        const shouldRetry = this.shouldRetryOnError(statusCode);
        
        if (shouldRetry) {
          this.setState('error', onConnectionEvent, `연결 오류 (${statusCode})`);
          this.handleReconnect(onAlertReceived, onConnectionEvent);
        } else {
          // 서버 오류일 경우 쿨다운 모드
          this.setState('cooldown', onConnectionEvent, `서버 오류 (${statusCode}) - 잠시 후 재시도`);
          this.handleCooldown(onAlertReceived, onConnectionEvent);
        }
      });

      // 연결 종료
      this.eventSource.addEventListener('close', (event) => {
        console.log('🔴 Alert SSE 연결 종료');
        this.isConnected = false;
        this.setState('disconnected', onConnectionEvent);
      });

    } catch (error) {
      console.log('Alert SSE 연결 실패:', error);
      this.setState('error', onConnectionEvent, '연결 실패');
      this.handleReconnect(onAlertReceived, onConnectionEvent);
    }
  }

  // 상태 설정 및 이벤트 전송
  private setState(
    state: ConnectionState, 
    onConnectionEvent: AlertConnectionEventListener, 
    message?: string
  ): void {
    this.state = state;
    
    const eventMap = {
      disconnected: { type: 'disconnected' as const, message: message || '연결 해제됨' },
      connecting: { type: 'connecting' as const, message: message || '연결 중...' },
      connected: { type: 'connected' as const, message: message || '연결됨' },
      reconnecting: { type: 'reconnecting' as const, message: message || '재연결 중...' },
      error: { type: 'error' as const, message: message || '연결 오류' },
      cooldown: { type: 'error' as const, message: message || '서버 문제로 대기 중...' },
    };

    onConnectionEvent(eventMap[state]);
  }

  // 에러 코드별 재시도 여부 결정
  private shouldRetryOnError(statusCode: number): boolean {
    // 4xx 클라이언트 오류 중 일부는 재시도
    if (statusCode >= 400 && statusCode < 500) {
      return statusCode === 401 || statusCode === 403; // 인증 오류만 재시도
    }
    
    // 5xx 서버 오류는 쿨다운 모드
    if (statusCode >= 500) {
      return false;
    }
    
    // 네트워크 오류 등은 재시도
    return true;
  }

  // 점진적 백오프 재연결
  private handleReconnect(
    onAlertReceived: AlertEventListener,
    onConnectionEvent: AlertConnectionEventListener
  ): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setState('cooldown', onConnectionEvent, '최대 재시도 횟수 초과 - 잠시 후 재시도');
      this.handleCooldown(onAlertReceived, onConnectionEvent);
      return;
    }

    this.reconnectAttempts++;
    
    // 점진적 백오프 with jitter
    const baseDelay = Math.min(this.baseDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxDelay);
    const jitter = Math.random() * 0.3 * baseDelay; // 30% jitter
    const delay = Math.floor(baseDelay + jitter);

    console.log(`🔄 Alert SSE ${Math.floor(delay / 1000)}초 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.setState('reconnecting', onConnectionEvent, `재연결 중... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeoutId = setTimeout(() => {
      this.disconnect();
      this.connect(onAlertReceived, onConnectionEvent);
    }, delay);
  }

  // 쿨다운 모드 - 서버 문제일 때 장시간 대기
  private handleCooldown(
    onAlertReceived: AlertEventListener,
    onConnectionEvent: AlertConnectionEventListener
  ): void {
    console.log(`❄️ Alert SSE 쿨다운 모드 - ${this.cooldownDelay / 1000}초 후 재시도`);
    
    this.cooldownTimeoutId = setTimeout(() => {
      this.reconnectAttempts = 0; // 재시도 카운터 리셋
      this.setState('disconnected', onConnectionEvent);
      this.connect(onAlertReceived, onConnectionEvent);
    }, this.cooldownDelay);
  }

  // 연결 해제
  disconnect(): void {
    // 타이머 정리
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    
    if (this.cooldownTimeoutId) {
      clearTimeout(this.cooldownTimeoutId);
      this.cooldownTimeoutId = null;
    }

    if (this.eventSource) {
      this.eventSource.removeAllEventListeners();
      this.eventSource.close();
      this.eventSource = null;
    }
    
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.state = 'disconnected';
    console.log('Alert SSE 연결 해제됨');
  }

  // 연결 상태 확인
  getConnectionStatus(): { connected: boolean; state: ConnectionState; attempts: number } {
    return {
      connected: this.isConnected,
      state: this.state,
      attempts: this.reconnectAttempts,
    };
  }

  // 수동 재연결 (사용자가 버튼 클릭 시)
  forceReconnect(
    onAlertReceived: AlertEventListener,
    onConnectionEvent: AlertConnectionEventListener
  ): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect(onAlertReceived, onConnectionEvent);
  }
}

// 싱글톤 인스턴스
export const alertSSEApi = new AlertSSEService();
