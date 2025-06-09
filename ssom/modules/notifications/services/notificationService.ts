import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { notificationApi } from '../apis/notificationApi';
import type {
  NotificationPermissionStatus,
  NotificationSettings,
  PushTokenData,
  NotificationServiceStatus,
  NotificationChannelConfig,
  LocalNotificationData,
  CustomNotificationData,
} from '../types';

/**
 * 알림 서비스 클래스
 * Expo Notifications와 FCM을 통합 관리
 */
export class NotificationService {
  private static instance: NotificationService;
  private status: NotificationServiceStatus = {
    isInitialized: false,
    hasPermission: false,
    registrationStatus: 'pending',
  };

  private constructor() {}

  /**
   * 싱글톤 인스턴스 반환
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * 알림 서비스 초기화
   */
  public async initialize(): Promise<void> {
    try {
      // 물리적 디바이스 체크
      if (!Device.isDevice) {
        console.warn('Push notifications 물리적 디바이스에서만 동작합니다.');
        return;
      }

      // 알림 핸들러 설정
      this.setupNotificationHandler();

      // Android 채널 설정
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }

      // 권한 요청 및 토큰 등록
      await this.requestPermissionsAndRegister();

      this.status.isInitialized = true;
      console.log('🔔 Notification Service 초기화 완료');
    } catch (error) {
      this.status.lastError = error as Error;
      console.error('Notification Service 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 알림 처리 핸들러 설정
   */
  private setupNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  /**
   * Android 알림 채널 설정
   */
  private async setupAndroidChannels(): Promise<void> {
    const channels: NotificationChannelConfig[] = [
      {
        id: 'default',
        name: '기본 알림',
        importance: Notifications.AndroidImportance.HIGH,
        description: '일반적인 알림을 위한 채널',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      },
      {
        id: 'alerts',
        name: '긴급 알림',
        importance: Notifications.AndroidImportance.MAX,
        description: '긴급한 시스템 알림을 위한 채널',
        vibrationPattern: [0, 500, 200, 500],
        lightColor: '#FF0000',
      },
      {
        id: 'system',
        name: '시스템 알림',
        importance: Notifications.AndroidImportance.DEFAULT,
        description: '시스템 상태 알림을 위한 채널',
        vibrationPattern: [0, 100, 100, 100],
        lightColor: '#0066FF',
      },
    ];

    for (const channel of channels) {
      await Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        importance: channel.importance,
        description: channel.description,
        vibrationPattern: channel.vibrationPattern,
        lightColor: channel.lightColor,
        sound: channel.sound,
      });
    }
  }

  /**
   * 권한 요청 및 토큰 등록
   */
  private async requestPermissionsAndRegister(): Promise<void> {
    // 권한 확인
    const permissionStatus = await this.getPermissionStatus();
    
    if (permissionStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('알림 권한이 거부되었습니다.');
      }
    }

    this.status.hasPermission = true;

    // 토큰 획득 및 등록
    await this.registerTokens();
  }

  /**
   * 토큰 획득 및 서버 등록
   */
  private async registerTokens(): Promise<void> {
    try {
      this.status.registrationStatus = 'pending';

      // Native Device Token 획득 (FCM/APNs)
      const nativeTokenResult = await Notifications.getDevicePushTokenAsync();
      const nativeDeviceToken = nativeTokenResult.data;

      // 상태 업데이트
      this.status.nativeDeviceToken = nativeDeviceToken;

      // FCM 토큰을 서버에 등록
      await notificationApi.registerFCMToken(nativeDeviceToken);

      this.status.registrationStatus = 'success';
      
      console.log('🎯 FCM 토큰 등록 성공:', {
        nativeDeviceToken: nativeDeviceToken.substring(0, 50) + '...',
      });
    } catch (error) {
      this.status.registrationStatus = 'failed';
      this.status.lastError = error as Error;
      
      // 4xx 클라이언트 오류의 경우 재시도하지 않음
      const isClientError = (error as any)?.response?.status >= 400 && (error as any)?.response?.status < 500;
      
      if (isClientError) {
        const statusCode = (error as any)?.response?.status;
        console.warn(`⚠️ FCM 등록 클라이언트 오류 (${statusCode}). 서버 측 확인 필요`);
      } else {
        console.error('토큰 등록 실패:', error);
      }
      
      throw error;
    }
  }

  /**
   * 권한 상태 확인
   */
  public async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    const { status } = await Notifications.getPermissionsAsync();
    return status as NotificationPermissionStatus;
  }

  /**
   * 상세 알림 설정 조회
   */
  public async getNotificationSettings(): Promise<NotificationSettings> {
    const settings = await Notifications.getPermissionsAsync();
    return {
      status: settings.status as NotificationPermissionStatus,
      granted: settings.granted,
      canAskAgain: settings.canAskAgain,
      expires: settings.expires,
    };
  }

  /**
   * 로컬 알림 스케줄링
   */
  public async scheduleLocalNotification(
    notificationData: LocalNotificationData,
    triggerOptions?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: (notificationData.data || {}) as Record<string, unknown>,
          sound: notificationData.sound ?? 'default',
          badge: notificationData.badge,
        },
        trigger: triggerOptions || null, // null = 즉시 표시
      });

      console.log('📅 로컬 알림 스케줄링 완료:', identifier);
      return identifier;
    } catch (error) {
      console.error('로컬 알림 스케줄링 실패:', error);
      throw error;
    }
  }

  /**
   * 모든 예약된 알림 취소
   */
  public async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('🗑️ 모든 예약된 알림 취소 완료');
  }

  /**
   * 특정 알림 취소
   */
  public async cancelNotification(identifier: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    console.log('🗑️ 알림 취소 완료:', identifier);
  }

  /**
   * 배지 카운트 설정
   */
  public async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
    console.log('🔴 배지 카운트 설정:', count);
  }

  /**
   * 서비스 상태 조회
   */
  public getStatus(): NotificationServiceStatus {
    return { ...this.status };
  }

  /**
   * 토큰 데이터 조회
   */
  public getTokenData(): PushTokenData | null {
    if (!this.status.nativeDeviceToken) {
      return null;
    }

    return {
      nativeDeviceToken: this.status.nativeDeviceToken,
      platform: Platform.OS as 'ios' | 'android',
      registeredAt: new Date(),
    };
  }

  /**
   * 서비스 재초기화
   */
  public async refresh(): Promise<void> {
    this.status.isInitialized = false;
    await this.initialize();
  }

  
} 