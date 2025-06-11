import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface IssueSubmitButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  text?: string;
  loadingText?: string;
}

export default function IssueSubmitButton({
  onPress,
  disabled = false,
  isLoading = false,
  text = '이슈 생성',
  loadingText = '생성 중...',
}: IssueSubmitButtonProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.footer, { borderTopColor: colors.border }]}>
      <Pressable
        style={[
          styles.submitButton,
          {
            backgroundColor: colors.primary,
            opacity: disabled || isLoading ? 0.7 : 1,
          },
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? loadingText : text}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 