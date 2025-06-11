import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAlertModal } from '@/components';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useFab } from '@/contexts/FabContext';
import UserInfoCard from '@/modules/auth/components/Profile/UserInfoCard';
import UserDetailsCard from '@/modules/auth/components/Profile/UserDetailsCard';
import MenuSection from '@/modules/auth/components/Profile/MenuSection';
import LoadingState from '@/modules/auth/components/Profile/LoadingState';
import LogoutButton from '@/modules/auth/components/Profile/LogoutButton';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { AlertModal, alert } = useAlertModal();
  const { user, profile, isLoading, getProfile } = useAuthStore();
  const { handleScroll } = useFab();

  useEffect(() => {
    getProfile();
  }, []);

  if (isLoading || !user || !profile) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            프로필
          </Text>
        </View>

        {/* User Info Card */}
        {user.username !== null && <UserInfoCard userInfo={user} />}

        {/* User Details Card */}
        <UserDetailsCard userInfo={profile} />

        {/* Menu Items */}
        <MenuSection onAlert={alert} />

        {/* Logout Button */}
        <LogoutButton onAlert={alert} />

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          SSOM v1.0.0
        </Text>
      </ScrollView>
      
      {/* AlertModal 컴포넌트 */}
      <AlertModal />
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
    fontSize: 20,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 40,
  },
}); 