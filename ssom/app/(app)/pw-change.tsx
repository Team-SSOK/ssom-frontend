import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSession } from '@/ctx/useSession';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PwChangeHeader from '@/modules/auth/components/PwChange/PwChangeHeader';
import PwChangeForm, { PwChangeFormRef, PasswordChangeRequest } from '@/modules/auth/components/PwChange/PwChangeForm';
import PwChangeButton from '@/modules/auth/components/PwChange/PwChangeButton';
import PwChangeRequirements from '@/modules/auth/components/PwChange/PwChangeRequirements';

export default function PasswordChange() {
  const { colors } = useTheme();
  const toast = useToast();
  const { changePassword, isLoading, error, clearError } = useAuthStore();
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(true);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const formRef = useRef<PwChangeFormRef>(null);

  useEffect(() => {
    const checkFirstLogin = async () => {
      try {
        const hasChangedPassword = await AsyncStorage.getItem('hasChangedPassword');
        setIsFirstLogin(!hasChangedPassword);
      } catch (error) {
        toast.error('오류', '첫 로그인 상태 확인 중 오류가 발생했습니다.');
        setIsFirstLogin(true); // 오류 시 첫 로그인으로 처리
      }
    };

    checkFirstLogin();
  }, [toast]);

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

  // 에러가 변경되면 Toast로 표시
  useEffect(() => {
    if (error) {
      toast.error('비밀번호 변경 오류', error);
      clearError();
    }
  }, [error, clearError, toast]);


  const handlePasswordChange = async (data: PasswordChangeRequest) => {
    try {
      await changePassword(data);

      await AsyncStorage.setItem('hasChangedPassword', 'true');
      
      toast.showSuccess({
        title: '비밀번호 변경 완료',
        message: '비밀번호가 성공적으로 변경되었습니다! 메인 화면으로 이동합니다.',
        duration: 1000,
        onHide: () => router.replace('/(app)/(tabs)')
      });
    } catch (error) {
      toast.error('비밀번호 변경 오류', error as string);
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
            <PwChangeHeader isFirstLogin={isFirstLogin} />
            
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
