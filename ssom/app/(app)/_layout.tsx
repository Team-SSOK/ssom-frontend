import { ActivityIndicator } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useTheme } from '@/hooks/useTheme';

export default function AppLayout() {
  const { colors } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="pw-change" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
