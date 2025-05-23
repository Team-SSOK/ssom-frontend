import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "../store/authContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireFirstLogin?: boolean;
}

/**
 * 보호된 라우트 컴포넌트
 * 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
 * 첫 로그인 사용자를 비밀번호 변경 페이지로 리다이렉트
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireFirstLogin = false }) => {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    if (!state.isLoading) {
      if (!state.isAuthenticated) {
        // 인증되지 않은 경우 로그인 페이지로 이동
        router.replace("/");
        return;
      }

      if (state.user?.isFirstLogin && !requireFirstLogin) {
        // 첫 로그인 사용자는 비밀번호 변경 페이지로 이동
        router.replace("/");
        return;
      }

      if (!state.user?.isFirstLogin && requireFirstLogin) {
        // 첫 로그인이 아닌 사용자가 비밀번호 변경 페이지에 접근하려는 경우 메인으로 이동
        router.replace("/");
        return;
      }
    }
  }, [state.isLoading, state.isAuthenticated, state.user, requireFirstLogin, router]);

  // 로딩 중일 때 표시할 화면
  if (state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>인증 확인 중...</Text>
      </View>
    );
  }

  // 인증되지 않은 경우 빈 화면 표시 (리다이렉트 중)
  if (!state.isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>로그인 페이지로 이동 중...</Text>
      </View>
    );
  }

  // 첫 로그인 사용자 리다이렉트 중
  if (state.user?.isFirstLogin && !requireFirstLogin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>비밀번호 변경 페이지로 이동 중...</Text>
      </View>
    );
  }

  // 인증된 사용자에게 컨텐츠 표시
  return <>{children}</>;
};

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

export default ProtectedRoute;
