import { Stack } from "expo-router";
import { AuthProvider } from "../modules/auth/store/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/changePwd" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
