import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { useAuth } from "@/modules/auth/store/authContext";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { COMPANY_INFO, VALIDATION_RULES, AUTH_ERRORS } from "@/modules/auth/constants/auth";
import { ChangePasswordRequest } from "@/types/auth";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePwdScreen: React.FC = () => {
  const router = useRouter();
  const { state, changePassword, logout } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // 진입 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  /**
   * 폼 유효성 검사
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 현재 비밀번호 검증
    if (!formData.currentPassword) {
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
    }

    // 새 비밀번호 검증
    if (!formData.newPassword) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요.";
    } else if (formData.newPassword.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      newErrors.newPassword = VALIDATION_RULES.PASSWORD.MESSAGE;
    } else if (!VALIDATION_RULES.PASSWORD.PATTERN.test(formData.newPassword)) {
      newErrors.newPassword = VALIDATION_RULES.PASSWORD.MESSAGE;
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = AUTH_ERRORS.PASSWORD_MISMATCH;
    }

    // 현재 비밀번호와 새 비밀번호가 같은지 확인
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "새 비밀번호는 현재 비밀번호와 달라야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 입력 값 변경 핸들러
   */
  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 입력 시 해당 필드의 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * 비밀번호 변경 처리
   */
  const handleChangePassword = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const request: ChangePasswordRequest = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      const success = await changePassword(request);

      if (success) {
        Alert.alert("비밀번호 변경 완료", "비밀번호가 성공적으로 변경되었습니다.", [
          {
            text: "확인",
            onPress: () => router.replace("/"),
          },
        ]);
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      Alert.alert("오류", "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 나중에 변경하기 (로그아웃)
   */
  const handleSkip = (): void => {
    Alert.alert(
      "비밀번호 변경 건너뛰기",
      "보안을 위해 비밀번호를 변경하는 것이 좋습니다.\n정말 나중에 변경하시겠습니까?",
      [
        { text: "계속 변경", style: "cancel" },
        {
          text: "나중에 변경",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.background}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              {/* 헤더 */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText}>{COMPANY_INFO.LOGO_TEXT}</Text>
                </View>
                <Text style={styles.title}>비밀번호 변경</Text>
                <Text style={styles.subtitle}>보안을 위해 초기 비밀번호를 변경해주세요.</Text>
              </View>

              {/* 비밀번호 변경 폼 */}
              <View style={styles.formContainer}>
                <View style={styles.formCard}>
                  <TextInput
                    label="현재 비밀번호"
                    value={formData.currentPassword}
                    onChangeText={handleInputChange("currentPassword")}
                    error={errors.currentPassword}
                    placeholder="현재 비밀번호를 입력하세요"
                    isPassword
                    leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                    testID="current-password-input"
                    required
                  />

                  <TextInput
                    label="새 비밀번호"
                    value={formData.newPassword}
                    onChangeText={handleInputChange("newPassword")}
                    error={errors.newPassword}
                    placeholder="새 비밀번호를 입력하세요"
                    isPassword
                    leftIcon={<Text style={styles.inputIcon}>🔑</Text>}
                    hint="8자 이상, 영문, 숫자, 특수문자 포함"
                    testID="new-password-input"
                    required
                  />

                  <TextInput
                    label="비밀번호 확인"
                    value={formData.confirmPassword}
                    onChangeText={handleInputChange("confirmPassword")}
                    error={errors.confirmPassword}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    isPassword
                    leftIcon={<Text style={styles.inputIcon}>✅</Text>}
                    testID="confirm-password-input"
                    required
                  />

                  <Button
                    title="비밀번호 변경"
                    onPress={handleChangePassword}
                    loading={isLoading}
                    style={styles.changeButton}
                    testID="change-password-button"
                  />

                  <Button
                    title="나중에 변경"
                    onPress={handleSkip}
                    variant="outline"
                    style={styles.skipButton}
                    testID="skip-button"
                  />
                </View>
              </View>

              {/* 보안 안내 */}
              <View style={styles.securityInfoContainer}>
                <Text style={styles.securityInfoTitle}>🛡️ 보안 안내</Text>
                <Text style={styles.securityInfoText}>
                  • 다른 서비스와 다른 비밀번호 사용{"\n"}• 개인정보가 포함되지 않은 비밀번호{"\n"}• 정기적인 비밀번호
                  변경 권장
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 32,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  inputIcon: {
    fontSize: 16,
  },
  changeButton: {
    marginTop: 16,
    marginBottom: 12,
  },
  skipButton: {
    marginTop: 8,
  },
  securityInfoContainer: {
    marginTop: 32,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  securityInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  securityInfoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
});

export default ChangePwdScreen;
