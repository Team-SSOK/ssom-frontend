import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FontFamily } from '@/styles/fonts';

interface AlertHeaderProps {
  onMarkAllAsRead?: () => void;
  hasUnreadAlerts?: boolean;
}

export default function AlertHeader({ 
  onMarkAllAsRead, 
  hasUnreadAlerts = false 
}: AlertHeaderProps) {
  const { colors } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const handleMarkAllPress = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.headerContent}>
        <Pressable 
          style={styles.iconButton} 
          onPress={handleBackPress}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        
        <Text style={[styles.title, { color: colors.text }]}>
          알림
        </Text>
        
        {hasUnreadAlerts ? (
          <Pressable 
            style={[styles.markAllButton, { backgroundColor: colors.primary }]} 
            onPress={handleMarkAllPress}
          >
            <Text style={[styles.markAllText, { color: colors.background }]}>
              모두 읽음
            </Text>
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 