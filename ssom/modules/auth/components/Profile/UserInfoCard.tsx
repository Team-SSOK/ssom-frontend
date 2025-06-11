import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { User } from '@/modules/auth/stores/authStore';

interface UserInfoCardProps {
  userInfo: User;
}

export default function UserInfoCard({ userInfo }: UserInfoCardProps) {
  const { colors } = useTheme();

  if (!userInfo) {
    return null;
  }

  return (
    <View style={[styles.userCard, { backgroundColor: colors.card }]}>
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Ionicons name="person" size={32} color={colors.white} />
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {userInfo.username}
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
  );
}

const styles = StyleSheet.create({
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
  userDetail: {
    fontSize: 12,
    marginTop: 2,
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