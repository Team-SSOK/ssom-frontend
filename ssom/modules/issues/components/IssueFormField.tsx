import React from 'react';
import { View, StyleSheet } from 'react-native';
import SectionLabel from './Creation/Common/SectionLabel';
import IssueTextInput from './Creation/Issue/IssueTextInput';
import IssueTextarea from './Creation/Issue/IssueTextarea';

export interface IssueFormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  disabled?: boolean;
}

export default function IssueFormField({
  label,
  value,
  onChangeText,
  placeholder = '',
  required = false,
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  disabled = false,
}: IssueFormFieldProps) {
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <SectionLabel text={label} required={required} />
      {multiline ? (
        <IssueTextarea
          value={value}
          onChangeText={disabled ? () => {} : onChangeText}
          placeholder={placeholder}
          error={error}
          numberOfLines={numberOfLines}
        />
      ) : (
        <IssueTextInput
          value={value}
          onChangeText={disabled ? () => {} : onChangeText}
          placeholder={placeholder}
          error={error}
          maxLength={maxLength}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  disabled: {
    opacity: 0.6,
  },
}); 