import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import { useAuth } from "../../modules/auth/store/authContext";
import Button from "../../components/Button";

export default function DashboardTab() {
  const { state, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* 사용자 정보 카드 */}
        <View style={styles.userCard}>
          <Text style={styles.welcomeText}>환영합니다, {state.user?.name}님! 👋</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>부서:</Text>
            <Text style={styles.userInfoValue}>{state.user?.department}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>권한:</Text>
            <Text style={styles.userInfoValue}>{state.user?.role}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>이메일:</Text>
            <Text style={styles.userInfoValue}>{state.user?.email}</Text>
          </View>
        </View>

        {/* 시스템 상태 카드 */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>📊 시스템 상태 개요</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>활성 서버</Text>
              <Text style={[styles.statusValue, styles.statusGreen]}>12/15</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>CPU 사용률</Text>
              <Text style={[styles.statusValue, styles.statusYellow]}>67%</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>메모리 사용률</Text>
              <Text style={[styles.statusValue, styles.statusGreen]}>45%</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>활성 알림</Text>
              <Text style={[styles.statusValue, styles.statusRed]}>3</Text>
            </View>
          </View>
        </View>

        {/* 최근 활동 카드 */}
        <View style={styles.activityCard}>
          <Text style={styles.cardTitle}>📋 최근 활동</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Text style={styles.activityTime}>2분 전</Text>
              <Text style={styles.activityText}>서버 DB-01에서 높은 CPU 사용률 감지</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityTime}>15분 전</Text>
              <Text style={styles.activityText}>백업 작업이 성공적으로 완료됨</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityTime}>1시간 전</Text>
              <Text style={styles.activityText}>새로운 사용자 계정이 생성됨</Text>
            </View>
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <View style={styles.actionSection}>
          <Button title="로그아웃" onPress={handleLogout} variant="outline" style={styles.logoutButton} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 16,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
    textAlign: "center",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userInfoLabel: {
    fontSize: 16,
    color: "#6C757D",
    fontWeight: "500",
  },
  userInfoValue: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusItem: {
    width: "48%",
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statusGreen: {
    color: "#28A745",
  },
  statusYellow: {
    color: "#FFC107",
  },
  statusRed: {
    color: "#DC3545",
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
    paddingLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: "#6C757D",
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: "#1C1C1E",
    lineHeight: 20,
  },
  actionSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButton: {
    marginTop: 8,
  },
});
