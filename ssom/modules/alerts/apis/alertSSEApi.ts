import { BaseSSEService, ConnectionEventListener } from '@/api/baseSSEService';
import { AlertEntry, AlertEventListener, AlertConnectionEventListener } from '../types';

/**
 * SSE 알림 스트리밍 서비스
 * 
 * 책임:
 * - BaseSSEService를 상속받아 알림 특화 SSE 구현
 * - 알림 데이터 파싱 및 변환
 * - 알림 관련 엔드포인트 정의
 * - 백엔드 SSE 이벤트 타입과 일치하는 처리
 */
class AlertSSEService extends BaseSSEService<AlertEntry> {
  
  // 알림 SSE 엔드포인트 정의 - API 스펙에 맞춤
  protected getEndpoint(): string {
    return '/alert/subscribe';
  }

  // 알림 데이터 파싱
  protected handleMessage(data: string): AlertEntry | null {
    try {
      // 백엔드에서 "connected" 문자열을 보내는 경우 (초기 연결)
      if (data === 'connected') {
        console.log('🔔 Alert SSE 초기화 완료');
        return null; // 실제 알림 데이터가 아니므로 null 반환
      }
      
      // heartbeat 처리
      if (data === 'ping') {
        console.log('💓 Alert SSE heartbeat 수신');
        return null;
      }
      
      // 실제 알림 데이터 파싱
      return JSON.parse(data) as AlertEntry;
    } catch (error) {
      console.log('알림 파싱 오류:', error);
      return null;
    }
  }

  // 서비스 이름 정의
  protected getServiceName(): string {
    return 'Alert';
  }

  // 기본 클래스의 메서드를 그대로 사용하되, 타입 호환성을 위한 간단한 오버로드
  async connect(
    onAlertReceived: AlertEventListener,
    onConnectionEvent: AlertConnectionEventListener
  ): Promise<void> {
    return super.connect(onAlertReceived, onConnectionEvent as ConnectionEventListener);
  }

  forceReconnect(
    onAlertReceived: AlertEventListener,
    onConnectionEvent: AlertConnectionEventListener
  ): void {
    return super.forceReconnect(onAlertReceived, onConnectionEvent as ConnectionEventListener);
  }
}

// 싱글톤 인스턴스
export const alertSSEApi = new AlertSSEService();
