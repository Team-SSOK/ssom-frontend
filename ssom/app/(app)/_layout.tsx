import { ActivityIndicator } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppLayout() {
  const { colors } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isCheckingPassword, setIsCheckingPassword] = useState(true);
  const [hasChangedPassword, setHasChangedPassword] = useState<boolean | null>(null);

  // 비밀번호 변경 상태 확인
  useEffect(() => {
    const checkPasswordStatus = async () => {
      if (!isAuthenticated || !user) {
        setIsCheckingPassword(false);
        return;
      }

      try {
        const passwordChanged = await AsyncStorage.getItem('hasChangedPassword');
        setHasChangedPassword(!!passwordChanged);
      } catch (error) {
        console.warn('비밀번호 상태 확인 오류:', error);
        setHasChangedPassword(false); // 오류 시 안전하게 비밀번호 변경 화면으로
      } finally {
        setIsCheckingPassword(false);
      }
    };

    checkPasswordStatus();
  }, [isAuthenticated, user]);

  if (isLoading || isCheckingPassword) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/sign-in" />;
  }

  // 첫 로그인 사용자는 비밀번호 변경 화면으로
  if (hasChangedPassword === false) {
    return <Redirect href="/(app)/pw-change" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pw-change" options={{ headerShown: false }} />
    </Stack>
  );
}
