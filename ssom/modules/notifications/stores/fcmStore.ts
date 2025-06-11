import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { NotificationService } from '../services/notificationService';

interface FCMState {
  // 권한 요청 상태
  permissionRequested: boolean;
  permissionGranted: boolean;
  
  // FCM 토큰 상태
  fcmToken: string | null;
  registrationStatus: 'idle' | 'pending' | 'success' | 'failed';
  
  // 오류 상태
  lastError: string | null;
  
  // Actions
  requestPermissionOnce: () => Promise<void>;
  initializeFCM: () => Promise<void>;
  resetPermissionRequest: () => void;
  updateTokenStatus: (token: string | null, status: 'pending' | 'success' | 'failed') => void;
}

export const useFCMStore = create<FCMState>()(
  persist(
    (set, get) => ({
      // Initial state
      permissionRequested: false,
      permissionGranted: false,
      fcmToken: null,
      registrationStatus: 'idle',
      lastError: null,

      // 최초 1번만 권한 요청
      requestPermissionOnce: async () => {
        const { permissionRequested } = get();
        
        console.log('🔍 FCM 권한 요청 함수 호출됨. 현재 상태:', { permissionRequested });
        
        if (permissionRequested) {
          console.log('📱 FCM 권한 이미 요청됨 - 건너뛰기');
          return;
        }

        console.log('📱 FCM 권한 다이얼로그 표시 준비...');

        return new Promise((resolve) => {
          Alert.alert(
            '푸시 알림 권한',
            '중요한 알림을 받기 위해 알림 권한이 필요합니다.\n권한을 허용하시겠습니까?',
            [
              {
                text: '나중에',
                style: 'cancel',
                onPress: () => {
                  console.log('📱 사용자가 FCM 권한을 거부함');
                  set({ 
                    permissionRequested: true, 
                    permissionGranted: false 
                  });
                  resolve();
                },
              },
              {
                text: '허용',
                onPress: async () => {
                  try {
                    console.log('📱 FCM 권한 허용 - 초기화 시작...');
                    set({ 
                      permissionRequested: true, 
                      permissionGranted: true,
                      registrationStatus: 'pending'
                    });
                    
                    await get().initializeFCM();
                    console.log('✅ FCM 초기화 완료');
                    resolve();
                  } catch (error) {
                    if (__DEV__) console.error('[FCMStore] FCM 초기화 실패:', error);
                    set({ 
                      registrationStatus: 'failed',
                      lastError: error instanceof Error ? error.message : '알 수 없는 오류'
                    });
                    resolve();
                  }
                },
              },
            ],
            { cancelable: false }
          );
        });
      },

      // FCM 초기화 (권한 요청 + 토큰 등록)
      initializeFCM: async () => {
        try {
          set({ registrationStatus: 'pending', lastError: null });
          
          const notificationService = NotificationService.getInstance();
          await notificationService.initialize();
          
          const tokenData = notificationService.getTokenData();
          
          set({ 
            fcmToken: tokenData?.nativeDeviceToken || null,
            registrationStatus: 'success',
            lastError: null
          });
          
          console.log('🎯 FCM 초기화 및 등록 완료');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
          set({ 
            registrationStatus: 'failed',
            lastError: errorMessage
          });
          
          if (__DEV__) console.error('[FCMStore] FCM 초기화 실패:', error);
          throw error;
        }
      },

      // 개발용: 권한 요청 상태 리셋
      resetPermissionRequest: () => {
        set({ 
          permissionRequested: false,
          permissionGranted: false,
          fcmToken: null,
          registrationStatus: 'idle',
          lastError: null
        });
        console.log('🔄 FCM 권한 상태 리셋됨');
      },

      // 토큰 상태 업데이트 (외부에서 호출용)
      updateTokenStatus: (token: string | null, status: 'pending' | 'success' | 'failed') => {
        set({ 
          fcmToken: token,
          registrationStatus: status
        });
      },
    }),
    {
      name: 'fcm-store',
      storage: createJSONStorage(() => AsyncStorage),
      // 민감한 정보는 제외하고 필요한 상태만 persist
      partialize: (state) => ({
        permissionRequested: state.permissionRequested,
        permissionGranted: state.permissionGranted,
      }),
    }
  )
); 