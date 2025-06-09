import { Notification, NotificationResponse } from 'expo-notifications';

// FCM API 요청 타입 (fcm-api-spec.md 기반)
export interface FCMRegistrationRequest {
  fcmToken: string;
}

export interface FCMRegistrationResponse {
  success: boolean;
  message?: string;
}

// Expo Push Token 관련 타입
export interface PushTokenData {
  nativeDeviceToken: string;
  platform: 'ios' | 'android';
  registeredAt: Date;
}

// 알림 권한 상태
export type NotificationPermissionStatus = 
  | 'granted' 
  | 'denied' 
  | 'undetermined';

// 알림 설정 (Expo의 NotificationPermissionsStatus 기반)
export interface NotificationSettings {
  status: NotificationPermissionStatus;
  granted: boolean;
  canAskAgain: boolean;
  expires: 'never' | number;
}

// 커스텀 알림 데이터
export interface CustomNotificationData {
  url?: string;
  alertId?: string;
  type?: 'alert' | 'general' | 'system';
  actionRequired?: boolean;
  [key: string]: unknown;
}

// 알림 채널 설정 (Android)
export interface NotificationChannelConfig {
  id: string;
  name: string;
  importance: number;
  description?: string;
  sound?: string;
  vibrationPattern?: number[];
  lightColor?: string;
}

// 로컬 알림 스케줄링
export interface LocalNotificationData {
  title: string;
  body: string;
  data?: CustomNotificationData;
  sound?: string | boolean;
  badge?: number;
  channelId?: string;
}

// 알림 서비스 상태
export interface NotificationServiceStatus {
  isInitialized: boolean;
  hasPermission: boolean;
  nativeDeviceToken?: string;
  registrationStatus: 'pending' | 'success' | 'failed';
  lastError?: Error;
}

// 알림 응답 핸들러 타입
export type NotificationHandler = (notification: Notification) => void;
export type NotificationResponseHandler = (response: NotificationResponse) => void;

// 딥링크 핸들러
export type DeepLinkHandler = (url: string) => void; 