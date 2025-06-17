import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export default function DrawerProfile() {
  const { colors } = useTheme();
  const { profile, logout } = useAuthStore();

  if (!profile) {
    return null;
  }

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/sign-in');
          },
        },
      ]
    );
  };
  
  const handleProfilePress = () => {
    router.push('/(app)/(tabs)/profile');
  };

  return (
    <View style={[styles.footerContainer, { borderTopColor: colors.border }]}>
      <Pressable style={styles.profileSection} onPress={handleProfilePress}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Ionicons name="person" size={24} color="white" />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
            {profile.username}
          </Text>
          <Text style={[styles.userMeta, { color: colors.textSecondary }]} numberOfLines={1}>
            {profile.employeeId} • {profile.department}
          </Text>
        </View>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userMeta: {
    fontSize: 13,
    color: '#888',
  },
  logoutIcon: {
    padding: 8,
  },
}); 