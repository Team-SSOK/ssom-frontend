import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/modules/auth/stores/authStore';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { logout, user } = useAuthStore();

  // 사용자 정보가 없으면 기본값 표시
  const userInfo = user ? {
    name: user.username,
    department: user.department,
    lastLoginAt: user.lastLoginAt,
    biometricEnabled: user.biometricEnabled,
  } : {
    name: '사용자',
    department: '부서 정보 없음',
    lastLoginAt: '',
    biometricEnabled: false,
  };

  const handleLogout = () => {
    Alert.alert(
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
              console.error('로그아웃 오류:', error);
              Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    router.replace('/(app)/pw-change');
  };

  const menuItems = [
    {
      icon: 'key-outline',
      title: '비밀번호 변경',
      onPress: handleChangePassword,
      showArrow: true,
    },
    {
      icon: 'notifications-outline',
      title: '알림 설정',
      onPress: () => {
        Alert.alert('알림', '준비 중인 기능입니다.');
      },
      showArrow: true,
    },
    {
      icon: 'help-circle-outline',
      title: '도움말',
      onPress: () => {
        Alert.alert('도움말', 'SSOM v1.0.0\n\n문의사항은 platform-team@ssok.kr로 연락해주세요.');
      },
      showArrow: true,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            프로필
          </Text>
        </View>

        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={32} color={colors.white} />
          </View>
          
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {userInfo.name}
            </Text>
            <Text style={[styles.userDepartment, { color: colors.textSecondary }]}>
              {userInfo.department}
            </Text>
            
            {userInfo.lastLoginAt && (
              <Text style={[styles.lastLogin, { color: colors.textMuted }]}>
                최근 로그인: {new Date(userInfo.lastLoginAt).toLocaleDateString('ko-KR')}
              </Text>
            )}
          </View>
          
          {userInfo.biometricEnabled && (
            <View style={[styles.biometricBadge, { backgroundColor: colors.success }]}>
              <Ionicons name="finger-print" size={16} color={colors.white} />
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            설정
          </Text>
          
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.menuItem,
                { borderBottomColor: colors.border },
                index === menuItems.length - 1 && styles.lastMenuItem,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={colors.textSecondary}
                />
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </Text>
              </View>
              {item.showArrow && (
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textSecondary}
                />
              )}
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <Pressable
          style={[styles.logoutButton, { backgroundColor: colors.critical }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.white} />
          <Text style={[styles.logoutText, { color: colors.white }]}>
            로그아웃
          </Text>
        </Pressable>

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          SSOM v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userDepartment: {
    fontSize: 12,
  },
  detailsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  menuCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
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
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 40,
  },
  lastLogin: {
    fontSize: 12,
  },
  biometricBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
}); 