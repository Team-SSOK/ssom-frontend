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
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useFCMStore } from '@/modules/notifications';
import AppLogo from '@/modules/auth/components/SignIn/AppLogo';
import LoginForm from '@/modules/auth/components/SignIn/LoginForm';
import LoginNotice from '@/modules/auth/components/SignIn/LoginNotice';
import AppVersionInfo from '@/modules/auth/components/SignIn/AppVersionInfo';

export default function SignIn() {
  const { login, isLoading } = useAuthStore();
  const { colors } = useTheme();
  const toast = useToast();
  const { resetPermissionRequest } = useFCMStore();

  const handleLogin = async (employeeId: string, password: string) => {
    if (!employeeId.trim() || !password.trim()) {
      toast.error('입력 오류', '직원 ID와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      await login({
        employeeId: employeeId.trim(),
        password: password.trim(),
      });

      console.log('로그인 완료 - 앱으로 이동...');
      toast.success('로그인 성공', '환영합니다!');
      
      router.replace('/(app)/(tabs)');
    } catch (error) {
      console.warn('로그인 실패:', error);
      toast.error('로그인 오류', "로그인에 실패했습니다");
    }
  };

  // 개발용: 첫 로그인 상태 리셋
  const resetFirstLoginStatus = async () => {
    try {
      const { clearAuth } = useAuthStore.getState();
      await clearAuth();
      
      // FCM 권한 요청 상태도 함께 리셋
      resetPermissionRequest();
      
      toast.success('개발자 도구', '모든 인증 데이터가 리셋되었습니다.');
    } catch (error) {
      toast.error('개발자 도구', '리셋 중 오류가 발생했습니다.');
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
                  [DEV] 모든 인증 데이터 리셋
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
