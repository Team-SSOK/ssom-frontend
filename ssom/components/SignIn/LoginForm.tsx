import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginInput from './LoginInput';
import LoginButton from './LoginButton';

interface LoginFormProps {
  onSubmit: (employeeId: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [form, setForm] = useState({
    employeeId: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    await onSubmit(form.employeeId, form.password);
  };

  const isFormValid = form.employeeId.trim() && form.password.trim();

  return (
    <View style={styles.formContainer}>
      <LoginInput
        value={form.employeeId}
        onChangeText={(text) => setForm({ ...form, employeeId: text.toUpperCase() })}
        placeholder="직원 ID"
        iconName="person-outline"
        editable={!isLoading}
        autoCapitalize="characters"
      />

      <LoginInput
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        placeholder="비밀번호"
        iconName="lock-closed-outline"
        secureTextEntry={!showPassword}
        showPasswordToggle={true}
        onTogglePassword={() => setShowPassword(!showPassword)}
        editable={!isLoading}
      />

      <LoginButton
        onPress={handleSubmit}
        disabled={!isFormValid}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 32,
  },
}); 