import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface IssueTextareaProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  numberOfLines?: number;
  minHeight?: number;
}

export default function IssueTextarea({
  value,
  onChangeText,
  placeholder,
  error,
  numberOfLines = 4,
  minHeight = 100,
}: IssueTextareaProps) {
  const { colors } = useTheme();

  return (
    <View>
      <TextInput
        style={[
          styles.textArea,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.critical : colors.border,
            color: colors.text,
            minHeight,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
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
  textArea: {
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