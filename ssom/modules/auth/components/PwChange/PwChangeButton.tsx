import React from 'react';
import { StyleSheet } from 'react-native';
import Button from '@/components/Button';

interface PwChangeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function PwChangeButton({ 
  onPress, 
  disabled = false, 
  isLoading = false 
}: PwChangeButtonProps) {
  return (
    <Button
      title={isLoading ? '비밀번호 변경 중...' : '비밀번호 변경'}
      onPress={onPress}
      disabled={disabled || isLoading}
      size="large"
      style={styles.changeButton}
    />
  );
}

const styles = StyleSheet.create({
  changeButton: {
    marginTop: 12,
    borderRadius: 12,
  },
}); 