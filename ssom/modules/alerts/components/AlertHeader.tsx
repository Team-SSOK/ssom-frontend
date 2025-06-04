import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FontFamily } from '@/styles/fonts';

export default function AlertHeader() {
  const { colors } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    console.log("설정이 클릭되었습니다");
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
        
        <Pressable 
          style={styles.iconButton} 
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </Pressable>
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
}); 