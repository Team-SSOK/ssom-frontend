import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';

interface IssueFormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  maxLength?: number;
}

export default function IssueFormField({
  label,
  required = false,
  error,
  ...textInputProps
}: IssueFormFieldProps) {
  const { colors } = useTheme();

  const isMultiline = textInputProps.multiline;
  const inputHeight = isMultiline ? (textInputProps.numberOfLines || 4) * 24 : 52;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && <Text style={{ color: colors.critical }}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.critical : colors.border,
            color: colors.text,
            height: inputHeight,
          },
          isMultiline && styles.multilineInput,
          textInputProps.disabled && { opacity: 0.6 },
        ]}
        placeholderTextColor={colors.textSecondary}
        {...textInputProps}
      />
      {error && (
        <Text style={[styles.errorText, { color: colors.critical }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  multilineInput: {
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
  },
}); 