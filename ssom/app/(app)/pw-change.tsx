import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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
  const { changePassword, isLoading } = useAuthStore();
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
        setIsFirstLogin(true); 
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
      console.warn('비밀번호 변경 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.';
      toast.error('비밀번호 변경 오류', errorMessage);
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
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
