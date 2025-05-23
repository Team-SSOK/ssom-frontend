import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { useAuth } from "@/modules/auth/store/authContext";
import Button from "@//components/Button";
import TextInput from "@/components/TextInput";
import { COMPANY_INFO, VALIDATION_RULES } from "@/modules/auth/constants/auth";
import { LoginRequest } from "@/types/auth";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { state, login, clearError } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    // 에러 상태 변경 시 에러 메시지 표시
    if (state.error) {
      Alert.alert("로그인 실패", state.error, [{ text: "확인", onPress: clearError }]);
    }
  }, [state.error]);

  /**
   * 폼 유효성 검사
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!VALIDATION_RULES.EMAIL.PATTERN.test(formData.email)) {
      newErrors.email = VALIDATION_RULES.EMAIL.MESSAGE;
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      newErrors.password = `비밀번호는 최소 ${VALIDATION_RULES.PASSWORD.MIN_LENGTH}자 이상이어야 합니다.`;
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
   * 로그인 처리
   */
  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    const credentials: LoginRequest = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    const success = await login(credentials);

    if (success) {
      // 로그인 성공 시 대시보드로 이동
      router.replace("/");
    }
  };

  /**
   * 비밀번호 찾기 (현재는 placeholder)
   */
  const handleForgotPassword = (): void => {
    Alert.alert("비밀번호 찾기", "시스템 관리자에게 문의하여 비밀번호를 재설정하세요.", [{ text: "확인" }]);
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.background}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* 로고 및 브랜딩 영역 */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>{COMPANY_INFO.LOGO_TEXT}</Text>
            </View>
            <Text style={styles.companyName}>{COMPANY_INFO.FULL_NAME}</Text>
            <Text style={styles.tagline}>{COMPANY_INFO.TAGLINE}</Text>
          </View>

          {/* 로그인 폼 */}
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>로그인</Text>

              <TextInput
                label="이메일"
                value={formData.email}
                onChangeText={handleInputChange("email")}
                error={errors.email}
                placeholder="example@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<Text style={styles.inputIcon}>📧</Text>}
                testID="email-input"
                required
              />

              <TextInput
                label="비밀번호"
                value={formData.password}
                onChangeText={handleInputChange("password")}
                error={errors.password}
                placeholder="비밀번호를 입력하세요"
                isPassword
                leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                testID="password-input"
                required
              />

              <Button
                title="로그인"
                onPress={handleLogin}
                loading={state.isLoading}
                style={styles.loginButton}
                testID="login-button"
              />

              <Button
                title="비밀번호 찾기"
                onPress={handleForgotPassword}
                variant="outline"
                style={styles.forgotButton}
                testID="forgot-password-button"
              />
            </View>
          </View>

          {/* 개발용 안내 */}
          <View style={styles.devInfoContainer}>
            <Text style={styles.devInfoTitle}>개발용 테스트 계정</Text>
            <Text style={styles.devInfoText}>
              이메일: test@ssom.com{"\n"}
              비밀번호: password123!
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
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
    width: 90,
    height: 90,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "400",
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
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 32,
  },
  inputIcon: {
    fontSize: 16,
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 12,
  },
  forgotButton: {
    marginTop: 8,
  },
  devInfoContainer: {
    marginTop: 32,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 400,
  },
  devInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  devInfoText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default LoginScreen;
