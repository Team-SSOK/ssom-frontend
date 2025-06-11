import * as Notifications from 'expo-notifications';
import type { CustomNotificationData } from '../types';

/**
 * 알림 관련 유틸리티 함수들
 */

/**
 * 서버 알림을 로컬 알림으로 변환
 */
export function createAlertNotification(
  alertTitle: string,
  alertMessage: string,
  alertId?: string
): {
  title: string;
  body: string;
  data: CustomNotificationData;
} {
  return {
    title: `🚨 ${alertTitle}`,
    body: alertMessage,
    data: {
      type: 'alert',
      alertId,
      actionRequired: true,
      url: alertId ? `/(app)/(tabs)/alerts?alertId=${alertId}` : '/(app)/(tabs)/alerts',
    },
  };
}

/**
 * 시스템 알림 생성
 */
export function createSystemNotification(
  title: string,
  message: string,
  url?: string
): {
  title: string;
  body: string;
  data: CustomNotificationData;
} {
  return {
    title: `⚙️ ${title}`,
    body: message,
    data: {
      type: 'system',
      url: url || '/(app)/(tabs)',
    },
  };
}

/**
 * 일반 알림 생성
 */
export function createGeneralNotification(
  title: string,
  message: string,
  url?: string
): {
  title: string;
  body: string;
  data: CustomNotificationData;
} {
  return {
    title,
    body: message,
    data: {
      type: 'general',
      url: url || '/(app)/(tabs)',
    },
  };
}

/**
 * 지연 알림 스케줄링 (초 단위)
 */
export function createDelayedTrigger(seconds: number): Notifications.TimeIntervalTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds,
    repeats: false,
  };
}

/**
 * 반복 알림 스케줄링 (분 단위)
 */
export function createRepeatingTrigger(minutes: number): Notifications.TimeIntervalTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: minutes * 60,
    repeats: true,
  };
}

/**
 * 특정 시간 알림 스케줄링
 */
export function createDateTrigger(date: Date): Notifications.DateTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date,
  };
}

/**
 * 알림 채널 ID 결정
 */
export function getChannelId(type: CustomNotificationData['type']): string {
  switch (type) {
    case 'alert':
      return 'alerts';
    case 'system':
      return 'system';
    default:
      return 'default';
  }
}

/**
 * 알림 중요도 결정 (Android)
 */
export function getNotificationImportance(type: CustomNotificationData['type']): number {
  switch (type) {
    case 'alert':
      return Notifications.AndroidImportance.MAX;
    case 'system':
      return Notifications.AndroidImportance.HIGH;
    default:
      return Notifications.AndroidImportance.DEFAULT;
  }
}

/**
 * 알림 데이터에서 URL 추출
 */
export function extractUrlFromNotification(notification: Notifications.Notification): string | null {
  const data = notification.request.content.data as CustomNotificationData;
  return data?.url || null;
}

/**
 * 알림 타입 확인
 */
export function getNotificationType(notification: Notifications.Notification): CustomNotificationData['type'] {
  const data = notification.request.content.data as CustomNotificationData;
  return data?.type || 'general';
}

/**
 * 액션이 필요한 알림인지 확인
 */
export function isActionRequired(notification: Notifications.Notification): boolean {
  const data = notification.request.content.data as CustomNotificationData;
  return data?.actionRequired || false;
}

/**
 * 알림 배지 카운트 계산
 */
export function calculateBadgeCount(unreadAlerts: number, unreadNotifications: number = 0): number {
  return unreadAlerts + unreadNotifications;
} 