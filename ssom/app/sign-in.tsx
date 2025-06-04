import { router } from 'expo-router';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { useAlert } from '@/hooks/useAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLogo from '@/modules/auth/components/SignIn/AppLogo';
import LoginForm from '@/modules/auth/components/SignIn/LoginForm';
import LoginNotice from '@/modules/auth/components/SignIn/LoginNotice';
import AppVersionInfo from '@/modules/auth/components/SignIn/AppVersionInfo';

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

  const checkFirstLogin = async (): Promise<boolean> => {
    try {
      const hasChangedPassword = await AsyncStorage.getItem('hasChangedPassword');
      return !hasChangedPassword; // 비밀번호를 변경한 적이 없으면 첫 로그인
    } catch (error) {
      console.error('첫 로그인 상태 확인 오류:', error);
      return true; // 오류 시 안전하게 첫 로그인으로 처리
    }
  };

  const handleLogin = async (employeeId: string, password: string) => {
    if (!employeeId.trim() || !password.trim()) {
      showErrorAlert('직원 ID와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 로그인 요청
      await login({
        employeeId: employeeId.trim(),
        password: password.trim(),
      });

      // 로그인 성공 후 첫 로그인 여부 확인
      const isFirstLogin = await checkFirstLogin();
      
      console.log('로그인 완료 - 첫 로그인 여부:', isFirstLogin);
      
      if (isFirstLogin) {
        // 첫 로그인이면 비밀번호 변경 페이지로 이동
        console.log('첫 로그인 감지 - pw-change로 리다이렉트');
        router.replace('/(app)/pw-change');
      } else {
        // 이미 비밀번호를 변경한 사용자는 메인 탭으로 이동
        console.log('기존 사용자 - 메인 탭으로 리다이렉트');
        router.replace('/(app)/(tabs)');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      showErrorAlert('로그인 중 오류가 발생했습니다.');
    }
  };

  // 개발용: 첫 로그인 상태 리셋
  const resetFirstLoginStatus = async () => {
    try {
      await AsyncStorage.removeItem('hasChangedPassword');
      console.log('첫 로그인 상태가 리셋되었습니다.');
    } catch (error) {
      console.error('첫 로그인 상태 리셋 오류:', error);
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
            
            {/* 개발용 리셋 버튼 */}
            {__DEV__ && (
              <Pressable 
                style={[styles.devButton, { borderColor: colors.textMuted }]}
                onPress={resetFirstLoginStatus}
              >
                <Text style={[styles.devButtonText, { color: colors.textMuted }]}>
                  [DEV] 첫 로그인 상태 리셋
                </Text>
              </Pressable>
            )}
            
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
  devButton: {
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  devButtonText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
