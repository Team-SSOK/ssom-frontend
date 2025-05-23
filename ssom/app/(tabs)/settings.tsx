import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";

import { useAuth } from "../../modules/auth/store/authContext";
import Button from "../../components/Button";

export default function SettingsTab() {
  const { state, logout } = useAuth();

  const handleChangePassword = () => {
    Alert.alert("비밀번호 변경", "비밀번호 변경 기능이 곧 구현될 예정입니다.");
  };

  const handleNotificationSettings = () => {
    Alert.alert("알림 설정", "알림 설정 기능이 곧 구현될 예정입니다.");
  };

  const handleAbout = () => {
    Alert.alert("SSOM 정보", "System Status & Operations Monitoring\n버전: 1.0.0\n\n실시간 시스템 관제 솔루션", [
      { text: "확인" },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* 사용자 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 정보</Text>
          <View style={styles.userInfoCard}>
            <View style={styles.userInfoRow}>
              <Text style={styles.label}>이름</Text>
              <Text style={styles.value}>{state.user?.name}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.label}>이메일</Text>
              <Text style={styles.value}>{state.user?.email}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.label}>부서</Text>
              <Text style={styles.value}>{state.user?.department}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.label}>권한</Text>
              <Text style={styles.value}>{state.user?.role}</Text>
            </View>
          </View>
        </View>

        {/* 보안 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>보안 설정</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
              <Text style={styles.settingLabel}>🔒 비밀번호 변경</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 알림 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleNotificationSettings}>
              <Text style={styles.settingLabel}>🔔 알림 설정</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
              <Text style={styles.settingLabel}>ℹ️ 앱 정보</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 로그아웃 섹션 */}
        <View style={styles.section}>
          <Button title="로그아웃" onPress={handleLogout} variant="danger" style={styles.logoutButton} />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 12,
    marginLeft: 4,
  },
  userInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  label: {
    fontSize: 16,
    color: "#6C757D",
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  settingLabel: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  settingArrow: {
    fontSize: 20,
    color: "#C7C7CC",
    fontWeight: "300",
  },
  logoutButton: {
    marginTop: 20,
  },
});
