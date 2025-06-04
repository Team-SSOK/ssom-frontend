import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSession } from '@/ctx/useSession';
import { useTheme } from '@/hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PwChangeHeader from '@/modules/auth/components/PwChange/PwChangeHeader';
import PwChangeForm, { PwChangeFormRef, PasswordChangeRequest } from '@/modules/auth/components/PwChange/PwChangeForm';
import PwChangeButton from '@/modules/auth/components/PwChange/PwChangeButton';
import PwChangeRequirements from '@/modules/auth/components/PwChange/PwChangeRequirements';

export default function PasswordChange() {
  const { session } = useSession();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(true);
  const formRef = useRef<PwChangeFormRef>(null);

  useEffect(() => {
    // Check if this is the user's first login
    const checkFirstLogin = async () => {
      try {
        const hasChangedPassword = await AsyncStorage.getItem('hasChangedPassword');
        setIsFirstLogin(!hasChangedPassword);
      } catch (error) {
        console.error('첫 로그인 상태 확인 오류:', error);
        setIsFirstLogin(true); // 오류 시 첫 로그인으로 처리
      }
    };

    checkFirstLogin();
  }, []);

  const handlePasswordChange = async (data: PasswordChangeRequest) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual password change API
      // await authApi.changePassword(data);
      
      console.log('비밀번호 변경 요청 데이터:', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark that password has been changed
      await AsyncStorage.setItem('hasChangedPassword', 'true');
      
      Alert.alert(
        '성공', 
        '비밀번호가 성공적으로 변경되었습니다! 메인 화면으로 이동합니다.',
        [
          {
            text: '확인',
            onPress: () => router.replace('/(app)/(tabs)')
          }
        ]
      );
    } catch (error) {
      Alert.alert('오류', '비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
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
              loading={loading}
            />
            
            <PwChangeButton
              onPress={handleSubmitPress}
              disabled={loading}
              isLoading={loading}
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
