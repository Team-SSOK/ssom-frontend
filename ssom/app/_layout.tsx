import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Entypo } from '@expo/vector-icons';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useAlertSSEConnection } from '@/modules/alerts/hooks/useAlertSSEConnection';
import { useLogSSEConnection } from '@/modules/logging/hooks/useLogSSEConnection';
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
  const { user, isAuthenticated, isPasswordChanged } = useAuthStore();
  
  // Alert SSE 연결 자동 관리
  useAlertSSEConnection({ isAuthenticated, user });
  
  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated && !!user && isPasswordChanged !== false}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated && !!user}>
        <Stack.Screen 
          name="pw-change" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
            title: 'Password Change',
          }} 
        />
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
