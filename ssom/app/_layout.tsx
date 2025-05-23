import { Stack } from "expo-router";
import { AuthProvider } from "../modules/auth/store/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </AuthProvider>
  );
}
