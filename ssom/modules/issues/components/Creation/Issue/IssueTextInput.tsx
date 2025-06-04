import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface IssueTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  maxLength?: number;
}

export default function IssueTextInput({
  value,
  onChangeText,
  placeholder,
  error,
  maxLength,
}: IssueTextInputProps) {
  const { colors } = useTheme();

  return (
    <View>
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.critical : colors.border,
            color: colors.text,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
      />
      {error && (
        <Text style={[styles.errorText, { color: colors.critical }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
}); 