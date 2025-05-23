import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "../modules/auth/store/authContext";

export default function Index() {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    if (!state.isLoading) {
      if (!state.isAuthenticated) {
        // 인증되지 않은 경우 로그인 페이지로 이동
        router.replace("/auth/login");
      } else if (state.user?.isFirstLogin) {
        // 첫 로그인 사용자는 비밀번호 변경 페이지로 이동
        router.replace("/auth/change-password");
      } else {
        // 인증된 사용자는 메인 탭으로 이동
        router.replace("/(tabs)/" as any);
      }
    }
  }, [state.isLoading, state.isAuthenticated, state.user, router]);

  // 로딩 중일 때 표시할 화면
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>앱을 시작하는 중...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
  },
});
