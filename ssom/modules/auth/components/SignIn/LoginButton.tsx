import React from 'react';
import { StyleSheet } from 'react-native';
import Button from '@/components/Button';

interface LoginButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function LoginButton({ onPress, disabled = false, isLoading = false }: LoginButtonProps) {
  return (
    <Button
      title={isLoading ? '로그인 중...' : '시스템 접속'}
      onPress={onPress}
      disabled={disabled || isLoading}
      size="large"
      style={styles.loginButton}
    />
  );
}

const styles = StyleSheet.create({
  loginButton: {
    marginTop: 12,
    borderRadius: 12,
  },
}); 