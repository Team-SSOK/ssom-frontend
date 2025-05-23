import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "../modules/auth/store/authContext";
import LoginScreen from "../modules/auth/components/LoginScreen";
import ChangePasswordScreen from "../modules/auth/components/ChangePasswordScreen";

export default function Index() {
  const router = useRouter();
  const { state } = useAuth();

  // 로딩 중일 때 표시할 화면
  if (state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>앱을 시작하는 중...</Text>
      </View>
    );
  }

  // 인증되지 않은 경우 로그인 화면 표시
  if (!state.isAuthenticated) {
    return <LoginScreen />;
  }

  // 첫 로그인 사용자는 비밀번호 변경 화면 표시
  if (state.user?.isFirstLogin) {
    return <ChangePasswordScreen />;
  }

  // 인증된 사용자는 대시보드로 이동
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>환영합니다, {state.user?.name}님!</Text>
      <Text style={styles.infoText}>대시보드 화면이 곧 구현될 예정입니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
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
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
    lineHeight: 24,
  },
});
