import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AlertsTab() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>🚨 시스템 알림</Text>
          <Text style={styles.alertSubtitle}>실시간 시스템 모니터링 및 알림 관리</Text>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>알림 화면이 곧 구현될 예정입니다.</Text>
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
  alertCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 8,
  },
  alertSubtitle: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
    lineHeight: 24,
  },
  placeholderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderText: {
    fontSize: 18,
    color: "#6C757D",
    textAlign: "center",
    lineHeight: 26,
  },
});
