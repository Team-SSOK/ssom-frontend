import { router } from 'expo-router';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { useAlert } from '@/hooks/useAlert';
import AppLogo from '@/components/SignIn/AppLogo';
import LoginForm from '@/components/SignIn/LoginForm';
import LoginNotice from '@/components/SignIn/LoginNotice';
import AppVersionInfo from '@/components/SignIn/AppVersionInfo';

export default function SignIn() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const { colors } = useTheme();
  const { showErrorAlert } = useAlert();

  // 에러가 변경되면 Alert로 표시
  useEffect(() => {
    if (error) {
      showErrorAlert(error, clearError);
    }
  }, [error, clearError, showErrorAlert]);

  const handleLogin = async (employeeId: string, password: string) => {
    if (!employeeId.trim() || !password.trim()) {
      showErrorAlert('직원 ID와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 임시로 email 형식으로 변환하여 기존 로그인 시스템과 호환
      await login({
        employeeId: employeeId.trim(),
        password: password.trim(),
      });
      router.replace('/(app)/(tabs)/logs');
    } catch (error) {
      console.error('로그인 오류:', error);
      showErrorAlert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <AppLogo />
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            <LoginNotice />
            <AppVersionInfo />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
});
