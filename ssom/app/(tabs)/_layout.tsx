import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";

import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E5E5EA",
            paddingTop: 8,
            paddingBottom: 8,
          },
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "대시보드",
            tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>📊</Text>,
            headerTitle: "SSOM 대시보드",
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: "알림",
            tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>🚨</Text>,
            headerTitle: "시스템 알림",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "설정",
            tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>⚙️</Text>,
            headerTitle: "설정",
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
