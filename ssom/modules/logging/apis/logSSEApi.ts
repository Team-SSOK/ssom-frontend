import { BaseSSEService, ConnectionEventListener } from '@/api/baseSSEService';
import { LogEntry, LogEventListener, ConnectionEventListener as LogConnectionEventListener } from '@/modules/logging/types';

/**
 * SSE 로그 스트리밍 서비스
 * 
 * 책임:
 * - BaseSSEService를 상속받아 로그 특화 SSE 구현
 * - 로그 데이터 파싱 및 변환
 * - 로그 관련 엔드포인트 정의
 */
class LoggingSSEService extends BaseSSEService<LogEntry> {
  
  // 로그 SSE 엔드포인트 정의
  protected getEndpoint(): string {
    return '/logging/subscribe';
  }

  // 로그 데이터 파싱
  protected handleMessage(data: string): LogEntry | null {
    try {
      return JSON.parse(data) as LogEntry;
    } catch (error) {
      console.log('로그 파싱 오류:', error);
      return null;
    }
  }

  // 서비스 이름 정의
  protected getServiceName(): string {
    return 'Logging';
  }

  // 기본 클래스의 메서드를 그대로 사용하되, 타입 호환성을 위한 간단한 오버로드
  async connect(
    onLogReceived: LogEventListener,
    onConnectionEvent: LogConnectionEventListener
  ): Promise<void> {
    return super.connect(onLogReceived, onConnectionEvent as ConnectionEventListener);
  }

  forceReconnect(
    onLogReceived: LogEventListener,
    onConnectionEvent: LogConnectionEventListener
  ): void {
    return super.forceReconnect(onLogReceived, onConnectionEvent as ConnectionEventListener);
  }
}

// 싱글톤 인스턴스
export const loggingSSEApi = new LoggingSSEService(); 