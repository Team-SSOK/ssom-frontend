import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import PwChangeInput from './PwChangeInput';

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PwChangeFormProps {
  onSubmit: (data: PasswordChangeRequest) => Promise<void>;
  loading: boolean;
}

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormVisibility {
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface PwChangeFormRef {
  submit: () => Promise<void>;
  isValid: () => boolean;
}

const PwChangeForm = forwardRef<PwChangeFormRef, PwChangeFormProps>(({ onSubmit, loading }, ref) => {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [visibility, setVisibility] = useState<FormVisibility>({
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 최소 8자 이상이어야 합니다';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const requestData: PasswordChangeRequest = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };
      await onSubmit(requestData);
    }
  };

  const isFormValid = () => {
    return formData.currentPassword.trim().length > 0 && 
           formData.newPassword.trim().length > 0 && 
           formData.confirmPassword.trim().length > 0 &&
           formData.newPassword === formData.confirmPassword &&
           formData.newPassword.length >= 8;
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    isValid: isFormValid,
  }));

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleVisibility = (field: keyof FormVisibility) => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <View style={styles.form}>
      <PwChangeInput
        label="현재 비밀번호"
        value={formData.currentPassword}
        onChangeText={(text) => updateField('currentPassword', text)}
        placeholder="현재 비밀번호를 입력하세요"
        secureTextEntry={!visibility.showCurrentPassword}
        onToggleVisibility={() => toggleVisibility('showCurrentPassword')}
        error={errors.currentPassword}
        editable={!loading}
      />

      <PwChangeInput
        label="새 비밀번호"
        value={formData.newPassword}
        onChangeText={(text) => updateField('newPassword', text)}
        placeholder="새 비밀번호를 입력하세요 (최소 8자)"
        secureTextEntry={!visibility.showNewPassword}
        onToggleVisibility={() => toggleVisibility('showNewPassword')}
        error={errors.newPassword}
        editable={!loading}
      />

      <PwChangeInput
        label="새 비밀번호 확인"
        value={formData.confirmPassword}
        onChangeText={(text) => updateField('confirmPassword', text)}
        placeholder="새 비밀번호를 다시 입력하세요"
        secureTextEntry={!visibility.showConfirmPassword}
        onToggleVisibility={() => toggleVisibility('showConfirmPassword')}
        error={errors.confirmPassword}
        editable={!loading}
      />
    </View>
  );
});

PwChangeForm.displayName = 'PwChangeForm';

export default PwChangeForm;
export type { PasswordChangeRequest };

const styles = StyleSheet.create({
  form: {
    marginBottom: 24,
  },
}); 