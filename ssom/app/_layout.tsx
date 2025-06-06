import { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Entypo } from '@expo/vector-icons';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useAlertStream } from '@/modules/alerts/hooks/useAlertStream';
import { PaperProvider } from 'react-native-paper';
import { theme } from '@/styles/theme';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/styles/toastConfig';
import {
  IBMPlexSansKR_100Thin,
  IBMPlexSansKR_200ExtraLight,
  IBMPlexSansKR_300Light,
  IBMPlexSansKR_400Regular,
  IBMPlexSansKR_500Medium,
  IBMPlexSansKR_600SemiBold,
  IBMPlexSansKR_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-kr';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function Root() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          ...Entypo.font,
          // IBM Plex Sans KR 폰트 로드
          'IBMPlexSansKR-Thin': IBMPlexSansKR_100Thin,
          'IBMPlexSansKR-ExtraLight': IBMPlexSansKR_200ExtraLight,
          'IBMPlexSansKR-Light': IBMPlexSansKR_300Light,
          'IBMPlexSansKR-Regular': IBMPlexSansKR_400Regular,
          'IBMPlexSansKR-Medium': IBMPlexSansKR_500Medium,
          'IBMPlexSansKR-SemiBold': IBMPlexSansKR_600SemiBold,
          'IBMPlexSansKR-Bold': IBMPlexSansKR_700Bold,
        });

        // Initialize auth store
        await initialize();

        // Artificially delay for two seconds to simulate a slow loading
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [initialize]);

  // Hide splash screen when auth loading is complete
  useEffect(() => {
    if (!isLoading && appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <RootNavigator />
      <Toast config={toastConfig} />
    </PaperProvider>
  );
}

function RootNavigator() {
  const { user, isAuthenticated } = useAuthStore();
  
  // 전역 Alert SSE 연결 관리
  const { connect: connectAlerts, disconnect: disconnectAlerts, loadAlerts } = useAlertStream();
  
  // 연결 상태 추적 (useEffect 반복 실행 방지)
  const isAlertConnectedRef = useRef(false);
  const currentAuthStateRef = useRef({ isAuthenticated: false, hasUser: false });

  // 인증 상태에 따른 Alert SSE 연결 관리
  useEffect(() => {
    const newAuthState = { 
      isAuthenticated: !!isAuthenticated, 
      hasUser: !!user 
    };
    
    const shouldConnect = newAuthState.isAuthenticated && newAuthState.hasUser;
    const authStateChanged = 
      currentAuthStateRef.current.isAuthenticated !== newAuthState.isAuthenticated ||
      currentAuthStateRef.current.hasUser !== newAuthState.hasUser;

    // 인증 상태가 변경되었을 때만 처리
    if (authStateChanged) {
      console.log('🔄 인증 상태 변경 감지:', { 
        이전: currentAuthStateRef.current, 
        현재: newAuthState,
        연결필요: shouldConnect 
      });

             if (shouldConnect && !isAlertConnectedRef.current) {
         // 인증된 사용자 - 연결 및 기존 알림 로드
         console.log('🟢 Alert SSE 연결 시작');
         connectAlerts();
         loadAlerts(); // 기존 알림 데이터 자동 로드
         isAlertConnectedRef.current = true;
      } else if (!shouldConnect && isAlertConnectedRef.current) {
        // 인증되지 않은 상태 - 연결 해제
        console.log('🔴 Alert SSE 연결 해제');
        disconnectAlerts();
        isAlertConnectedRef.current = false;
      }
      
      // 현재 상태 업데이트
      currentAuthStateRef.current = newAuthState;
    }

    // 컴포넌트 언마운트 시에만 연결 해제
    return () => {
      if (isAlertConnectedRef.current) {
        console.log('🔚 앱 종료 - Alert SSE 연결 해제');
        disconnectAlerts();
        isAlertConnectedRef.current = false;
      }
    };
  }, [isAuthenticated, user]); // 함수들을 의존성에서 제거

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated && !!user}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated || !user}>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
            presentation: 'modal',
            title: 'Sign In',
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
