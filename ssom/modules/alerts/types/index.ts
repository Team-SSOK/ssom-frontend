/**
 * 알림 관련 타입 정의
 */

export interface AlertEntry {
  alertId: number;
  id: string;
  title: string;
  message: string;
  kind: string;
  isRead: boolean;
  timestamp: string;
  createdAt: string;
  employeeId: string;
}

export interface AlertStatusUpdateRequest {
  alertStatusId: number;
  isRead: boolean;
}

export interface AlertDeleteRequest {
  alertStatusId: number;
}

export interface FCMTokenRequest {
  fcmToken: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
}

export interface AlertsResponse {
  alerts: AlertEntry[];
}

// SSE 이벤트 타입
export interface AlertEventListener {
  (alert: AlertEntry): void;
}

export interface AlertConnectionEventListener {
  (event: { type: 'connected' | 'disconnected' | 'connecting' | 'reconnecting' | 'error'; message?: string }): void;
}

// UI에서 사용하는 알림 타입 (기존 mock과 호환)
export interface Alert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  kind: string;
  isRead: boolean;
  actionRequired?: boolean;
} 