import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/modules/auth/stores/authStore';

interface LogoutButtonProps {
  onAlert: (title: string, message?: string, buttons?: Array<{
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }>) => void;
}

export default function LogoutButton({ onAlert }: LogoutButtonProps) {
  const { colors } = useTheme();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    
    onAlert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.logoutButton, 
        { 
          backgroundColor: colors.critical,
          opacity: pressed ? 0.8 : 1 
        }
      ]}
      onPress={handleLogout}
    >
      <Ionicons name="log-out-outline" size={20} color={colors.white} />
      <Text style={[styles.logoutText, { color: colors.white }]}>
        로그아웃
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 