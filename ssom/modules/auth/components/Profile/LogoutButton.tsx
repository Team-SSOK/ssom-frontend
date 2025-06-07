import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useToast } from '@/hooks/useToast';
import { useAlertModal } from '@/components';

export default function LogoutButton() {
  const { colors } = useTheme();
  const { logout } = useAuthStore();
  const toast = useToast();
  const { alert } = useAlertModal();

  const handleLogout = () => {
    alert(
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
            try {
              await logout();
              // 로그아웃 성공 시 자동으로 라우팅됩니다 (_layout.tsx의 Stack.Protected 설정에 의해)
            } catch (error) {
              if (__DEV__) console.error('로그아웃 오류:', error);
              toast.error('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  return (
    <Pressable
      style={[styles.logoutButton, { backgroundColor: colors.critical }]}
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