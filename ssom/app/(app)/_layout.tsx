import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/modules/auth/stores/authStore';

export default function AppLayout() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Text>Loading...</Text>;
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
