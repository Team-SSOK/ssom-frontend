import React from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontFamily } from '@/styles/fonts';

interface TextInputProps extends RNTextInputProps {
  weight?: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold';
}

export default function TextInput({ style, weight = 'regular', ...props }: TextInputProps) {
  const { colors, fonts } = useTheme();

  const getFontFamily = () => {
    if (weight && fonts[weight]) {
      return fonts[weight];
    }
    return fonts.regular;
  };

  const inputStyle = [
    styles.baseInput,
    { 
      color: colors.text,
      fontFamily: getFontFamily(),
    },
    style,
  ];

  return (
    <RNTextInput
      style={inputStyle}
      placeholderTextColor={colors.textSecondary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  baseInput: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
  },
}); 