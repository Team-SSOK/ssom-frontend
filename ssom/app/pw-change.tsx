import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import PwChangeHeader from '@/modules/auth/components/PwChange/PwChangeHeader';
import PwChangeForm, { PwChangeFormRef, PasswordChangeRequest } from '@/modules/auth/components/PwChange/PwChangeForm';
import PwChangeButton from '@/modules/auth/components/PwChange/PwChangeButton';
import PwChangeRequirements from '@/modules/auth/components/PwChange/PwChangeRequirements';

export default function PasswordChange() {
  const { colors } = useTheme();
  const toast = useToast();
  const { changePassword, isLoading } = useAuthStore();
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

      toast.showSuccess({
        title: '비밀번호 변경 완료',
        message: '비밀번호가 성공적으로 변경되었습니다! 메인 화면으로 이동합니다.',
        duration: 1000,
        onHide: () => router.replace('/(app)/(tabs)')
      });
    } catch (error) {
      console.warn('비밀번호 변경 실패:', error);
      toast.error('비밀번호 변경 오류', '비밀번호 변경에 실패했습니다');
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