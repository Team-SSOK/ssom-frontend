import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/modules/auth/stores/authStore';

export function SplashScreenController() {
  const { isLoading } = useAuthStore();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
