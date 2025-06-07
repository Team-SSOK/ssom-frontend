import EventSource from 'react-native-sse';
import { getAccessToken } from '@/services/tokenService';
import { apiConfig } from '@/api/apiInstance';
import { SSE_CONFIG, HTTP_STATUS } from '@/api/constants';

// 연결 상태 타입 정의
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'cooldown';

// 연결 이벤트 타입
export interface ConnectionEvent {
  type: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';
  message: string;
}

// 이벤트 리스너 타입
export type ConnectionEventListener = (event: ConnectionEvent) => void;

/**
 * SSE 서비스 기본 클래스
 * 
 * 책임:
 * - Server-Sent Events를 통한 실시간 데이터 수신 공통 로직
 * - 스마트한 연결 관리 및 점진적 백오프 재연결
 * - JWT 인증 토큰 관리
 * - 서버 상태 기반 연결 전략
 * 
 * 특징:
 * - 점진적 백오프 (exponential backoff with jitter)
 * - 서버 상태별 다른 재연결 전략
 * - 연결 실패 시 쿨다운 모드
 * - 추상 클래스로 서비스별 특화 구현 허용
 */
export abstract class BaseSSEService<T> {
  protected eventSource: EventSource | null = null;
  protected baseUrl: string;
  protected isConnected: boolean = false;
  protected reconnectAttempts: number = 0;
  protected maxReconnectAttempts: number = SSE_CONFIG.MAX_RECONNECT_ATTEMPTS;
  protected state: ConnectionState = 'disconnected';
  protected reconnectTimeoutId: number | null = null;
  protected cooldownTimeoutId: number | null = null;

  constructor() {
    this.baseUrl = apiConfig.baseURL;
  }

  // 추상 메서드: 각 서비스에서 구현해야 함
  protected abstract getEndpoint(): string;
  protected abstract handleMessage(data: string): T | null;
  protected abstract getServiceName(): string;

  // SSE 연결 시작
  async connect(
    onDataReceived: (data: T) => void,
    onConnectionEvent: ConnectionEventListener
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

      const sseUrl = `${this.baseUrl}${this.getEndpoint()}`;
      
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
        console.log(`🟢 ${this.getServiceName()} SSE 연결 성공`);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.setState('connected', onConnectionEvent);
      });

      // 메시지 수신
      this.eventSource.addEventListener('message', (event) => {
        try {
          if (event.data === 'connected') {
            // SSE 초기화 응답
            console.log(`🔔 ${this.getServiceName()} SSE 초기화 완료`);
            this.isConnected = true;
            this.setState('connected', onConnectionEvent);
            return;
          }
          
          if (event.data) {
            console.log(`📨 새 ${this.getServiceName()} 데이터 수신:`, event.data);
            const parsedData = this.handleMessage(event.data);
            if (parsedData) {
              onDataReceived(parsedData);
            }
          }
        } catch (error) {
          console.log(`${this.getServiceName()} 데이터 파싱 오류:`, error);
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
          this.handleReconnect(onDataReceived, onConnectionEvent);
        } else {
          // 서버 오류일 경우 쿨다운 모드
          this.setState('cooldown', onConnectionEvent, `서버 오류 (${statusCode}) - 잠시 후 재시도`);
          this.handleCooldown(onDataReceived, onConnectionEvent);
        }
      });

      // 연결 종료
      this.eventSource.addEventListener('close', (event) => {
        console.log(`🔴 ${this.getServiceName()} SSE 연결 종료`);
        this.isConnected = false;
        this.setState('disconnected', onConnectionEvent);
      });

    } catch (error) {
      console.log(`${this.getServiceName()} SSE 연결 실패:`, error);
      this.setState('error', onConnectionEvent, '연결 실패');
      this.handleReconnect(onDataReceived, onConnectionEvent);
    }
  }

  // 상태 설정 및 이벤트 전송
  protected setState(
    state: ConnectionState, 
    onConnectionEvent: ConnectionEventListener, 
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
  protected shouldRetryOnError(statusCode: number): boolean {
    // 4xx 클라이언트 오류 중 인증 오류만 재시도
    if (statusCode >= HTTP_STATUS.CLIENT_ERROR_START && statusCode <= HTTP_STATUS.CLIENT_ERROR_END) {
      return HTTP_STATUS.AUTH_ERRORS.includes(statusCode as 401 | 403);
    }
    
    // 5xx 서버 오류는 쿨다운 모드 (재시도 안함)
    if (statusCode >= HTTP_STATUS.SERVER_ERROR_START) {
      return false;
    }
    
    // 네트워크 오류 등은 재시도
    return true;
  }

  // 점진적 백오프 재연결
  protected handleReconnect(
    onDataReceived: (data: T) => void,
    onConnectionEvent: ConnectionEventListener
  ): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setState('cooldown', onConnectionEvent, '최대 재시도 횟수 초과 - 잠시 후 재시도');
      this.handleCooldown(onDataReceived, onConnectionEvent);
      return;
    }

    this.reconnectAttempts++;
    
    // 점진적 백오프 with jitter
    const baseDelay = Math.min(SSE_CONFIG.INITIAL_RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1), SSE_CONFIG.MAX_RECONNECT_DELAY_MS);
    const jitter = Math.random() * SSE_CONFIG.JITTER_RATIO * baseDelay;
    const delay = Math.floor(baseDelay + jitter);

    console.log(`🔄 ${this.getServiceName()} SSE ${Math.floor(delay / 1000)}초 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.setState('reconnecting', onConnectionEvent, `재연결 중... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeoutId = setTimeout(() => {
      this.disconnect();
      this.connect(onDataReceived, onConnectionEvent);
    }, delay);
  }

  // 쿨다운 모드 - 서버 문제일 때 장시간 대기
  protected handleCooldown(
    onDataReceived: (data: T) => void,
    onConnectionEvent: ConnectionEventListener
  ): void {
    console.log(`❄️ ${this.getServiceName()} SSE 쿨다운 모드 - ${SSE_CONFIG.SERVER_ERROR_COOLDOWN_MS / 1000}초 후 재시도`);
    
    this.cooldownTimeoutId = setTimeout(() => {
      this.reconnectAttempts = 0; // 재시도 카운터 리셋
      this.setState('disconnected', onConnectionEvent);
      this.connect(onDataReceived, onConnectionEvent);
    }, SSE_CONFIG.SERVER_ERROR_COOLDOWN_MS);
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
    console.log(`${this.getServiceName()} SSE 연결 해제됨`);
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
    onDataReceived: (data: T) => void,
    onConnectionEvent: ConnectionEventListener
  ): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect(onDataReceived, onConnectionEvent);
  }
} 