import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function MetricsTab() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.metricsCard}>
          <Text style={styles.metricsTitle}>📈 시스템 메트릭</Text>
          <Text style={styles.metricsSubtitle}>실시간 성능 지표 및 분석 데이터</Text>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>메트릭 화면이 곧 구현될 예정입니다.</Text>
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
  metricsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 8,
  },
  metricsSubtitle: {
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
