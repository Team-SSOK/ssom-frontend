import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { NotificationService } from '../services/notificationService';
import type {
  NotificationServiceStatus,
  PushTokenData,
  NotificationHandler,
  NotificationResponseHandler,
  DeepLinkHandler,
  CustomNotificationData,
} from '../types';

interface UseNotificationsOptions {
  autoInitialize?: boolean;
  enableDeepLinking?: boolean;
  onNotificationReceived?: NotificationHandler;
  onNotificationResponse?: NotificationResponseHandler;
  onDeepLink?: DeepLinkHandler;
}

interface UseNotificationsReturn {
  status: NotificationServiceStatus;
  tokenData: PushTokenData | null;
  isLoading: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  scheduleLocalNotification: (
    title: string,
    body: string,
    data?: CustomNotificationData,
    triggerOptions?: Notifications.NotificationTriggerInput
  ) => Promise<string>;
  setBadgeCount: (count: number) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

/**
 * 알림 관리를 위한 React Hook
 */
export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    autoInitialize = true,
    enableDeepLinking = true,
    onNotificationReceived,
    onNotificationResponse,
    onDeepLink,
  } = options;

  const [status, setStatus] = useState<NotificationServiceStatus>({
    isInitialized: false,
    hasPermission: false,
    registrationStatus: 'pending',
  });
  const [tokenData, setTokenData] = useState<PushTokenData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 리스너 참조
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const appStateListener = useRef<any>(null);

  // 서비스 인스턴스
  const service = useRef(NotificationService.getInstance());

  /**
   * 서비스 상태 업데이트
   */
  const updateStatus = useCallback(() => {
    const currentStatus = service.current.getStatus();
    const currentTokenData = service.current.getTokenData();
    
    setStatus(currentStatus);
    setTokenData(currentTokenData);
    setError(currentStatus.lastError || null);
  }, []);

  /**
   * 초기화 함수
   */
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await service.current.initialize();
      updateStatus();
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('알림 초기화 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateStatus]);

  /**
   * 새로고침 함수
   */
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await service.current.refresh();
      updateStatus();
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('알림 새로고침 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateStatus]);

  /**
   * 정리 함수
   */
  // const cleanup = useCallback(async () => {
  //   try {
  //     await service.current.cleanup();
  //     updateStatus();
  //   } catch (err) {
  //     const error = err as Error;
  //     setError(error);
  //     console.error('알림 정리 실패:', error);
  //   }
  // }, [updateStatus]);

  /**
   * 로컬 알림 스케줄링
   */
  const scheduleLocalNotification = useCallback(async (
    title: string,
    body: string,
    data?: CustomNotificationData,
    triggerOptions?: Notifications.NotificationTriggerInput
  ): Promise<string> => {
    return await service.current.scheduleLocalNotification(
      { title, body, data },
      triggerOptions
    );
  }, []);

  /**
   * 배지 카운트 설정
   */
  const setBadgeCount = useCallback(async (count: number): Promise<void> => {
    await service.current.setBadgeCount(count);
  }, []);

  /**
   * 권한 요청
   */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      
      if (granted) {
        updateStatus();
      }
      
      return granted;
    } catch (err) {
      console.error('권한 요청 실패:', err);
      return false;
    }
  }, [updateStatus]);

  /**
   * 딥링크 처리
   */
  const handleDeepLink = useCallback((notification: Notifications.Notification) => {
    const data = notification.request.content.data as CustomNotificationData;
    const url = data?.url;
    
    if (url && enableDeepLinking) {
      try {
        // 커스텀 핸들러가 있으면 먼저 실행
        onDeepLink?.(url);
        
        // Expo Router로 네비게이션
        router.push(url as any);
      } catch (error) {
        console.error('딥링크 처리 실패:', error);
      }
    }
  }, [enableDeepLinking, onDeepLink]);

  /**
   * 알림 수신 핸들러
   */
  const handleNotificationReceived = useCallback((notification: Notifications.Notification) => {
    console.log('🔔 알림 수신:', notification.request.content);
    
    // 커스텀 핸들러 실행
    onNotificationReceived?.(notification);
  }, [onNotificationReceived]);

  /**
   * 알림 응답 핸들러 (사용자가 알림을 탭했을 때)
   */
  const handleNotificationResponse = useCallback((response: Notifications.NotificationResponse) => {
    console.log('👆 알림 응답:', response.notification.request.content);
    
    // 딥링크 처리
    handleDeepLink(response.notification);
    
    // 커스텀 핸들러 실행
    onNotificationResponse?.(response);
  }, [handleDeepLink, onNotificationResponse]);

  /**
   * 앱 상태 변경 핸들러
   */
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    // 앱이 포그라운드로 돌아올 때 상태 업데이트
    if (nextAppState === 'active') {
      updateStatus();
    }
  }, [updateStatus]);

  /**
   * 초기 알림 응답 처리 (앱이 닫힌 상태에서 알림으로 실행된 경우)
   */
  const handleInitialNotificationResponse = useCallback(async () => {
    try {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response?.notification) {
        handleDeepLink(response.notification);
      }
    } catch (error) {
      console.error('초기 알림 응답 처리 실패:', error);
    }
  }, [handleDeepLink]);

  /**
   * 이벤트 리스너 설정
   */
  useEffect(() => {
    // 알림 수신 리스너
    notificationListener.current = Notifications.addNotificationReceivedListener(
      handleNotificationReceived
    );

    // 알림 응답 리스너 (사용자가 알림을 탭했을 때)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    // 앱 상태 변경 리스너
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    appStateListener.current = subscription;

    // 초기 알림 응답 처리
    handleInitialNotificationResponse();

    return () => {
      // 리스너 정리
      notificationListener.current?.remove();
      responseListener.current?.remove();
      subscription?.remove();
    };
  }, [handleNotificationReceived, handleNotificationResponse, handleAppStateChange, handleInitialNotificationResponse]);

  /**
   * 자동 초기화
   */
  useEffect(() => {
    if (autoInitialize && !status.isInitialized && !isLoading) {
      // 4xx 클라이언트 오류인 경우 더 이상 시도하지 않음
      const isClientError = (error as any)?.response?.status >= 400 && (error as any)?.response?.status < 500;
      if (!isClientError) {
        initialize();
      }
    }
  }, [autoInitialize, status.isInitialized, isLoading, initialize, error]);

  return {
    status,
    tokenData,
    isLoading,
    error,
    initialize,
    refresh,
    scheduleLocalNotification,
    setBadgeCount,
    requestPermissions,
  };
} 