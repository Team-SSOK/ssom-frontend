import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useFCMStore } from '@/modules/notifications';
import { getFeatureSpecificErrorMessage } from '@/utils/errorHandlers';
import PwChangeHeader from '@/modules/auth/components/PwChange/PwChangeHeader';
import PwChangeForm, { PwChangeFormRef, PasswordChangeRequest } from '@/modules/auth/components/PwChange/PwChangeForm';
import PwChangeButton from '@/modules/auth/components/PwChange/PwChangeButton';
import PwChangeRequirements from '@/modules/auth/components/PwChange/PwChangeRequirements';

export default function PasswordChange() {
  const { colors } = useTheme();
  const toast = useToast();
  const { changePassword, isLoading } = useAuthStore();
  const { requestPermissionOnce } = useFCMStore();
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const formRef = useRef<PwChangeFormRef>(null);

  // 폼 유효성 상태를 주기적으로 체크
  useEffect(() => {
    const checkFormValidity = () => {
      if (formRef.current) {
        setIsFormValid(formRef.current.isValid());
      }
    };

    const interval = setInterval(checkFormValidity, 100); // 100ms마다 체크
    return () => clearInterval(interval);
  }, []);

  const handlePasswordChange = async (data: PasswordChangeRequest) => {
    try {
      await changePassword(data);

      console.log('비밀번호 변경 완료 - FCM 권한 요청 시작...');

      // 비밀번호 변경 완료 후 FCM 권한 요청
      const requestFCMPermission = async () => {
        try {
          await requestPermissionOnce();
          
          // 권한 요청 후 상태 확인
          const currentState = useFCMStore.getState();
          console.log('📱 FCM 권한 처리 완료. 현재 상태:', {
            permissionGranted: currentState.permissionGranted,
            registrationStatus: currentState.registrationStatus,
            fcmToken: currentState.fcmToken ? '토큰 있음' : '토큰 없음'
          });
          
          if (currentState.permissionGranted && currentState.registrationStatus === 'success') {
            console.log('✅ FCM 등록 성공');
          } else if (currentState.permissionGranted && currentState.registrationStatus === 'failed') {
            console.log('❌ FCM 등록 실패');
          }
        } catch (error) {
          console.error('📱 FCM 권한 처리 중 오류:', error);
        }
      };

      toast.showSuccess({
        title: '비밀번호 변경 완료',
        message: '비밀번호가 성공적으로 변경되었습니다! 메인 화면으로 이동합니다.',
        duration: 1000,
        onHide: async () => {
          // 토스트가 사라진 후 FCM 권한 요청
          await requestFCMPermission();
          router.replace('/(app)/(tabs)');
        }
      });
    } catch (error) {
      const errorMessage = getFeatureSpecificErrorMessage('password', error);
      toast.error('비밀번호 변경 실패', errorMessage);
    }
  };

  const handleSubmitPress = () => {
    formRef.current?.submit();
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <PwChangeHeader />
            
            <PwChangeForm
              ref={formRef}
              onSubmit={handlePasswordChange}
              loading={isLoading}
            />
            
            <PwChangeButton
              onPress={handleSubmitPress}
              disabled={isLoading || !isFormValid}
              isLoading={isLoading}
            />
            
            <PwChangeRequirements />
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
}); 