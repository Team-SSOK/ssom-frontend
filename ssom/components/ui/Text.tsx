import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'body3' | 'button' | 'buttonSmall' | 'caption' | 'overline';
  weight?: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold';
}

export default function Text({ children, style, variant, weight, ...props }: TextProps) {
  const { typography, fonts, colors } = useTheme();

  const getVariantStyle = () => {
    if (variant && typography[variant]) {
      return typography[variant];
    }
    return typography.body2; // 기본 스타일
  };

  const getFontFamily = () => {
    if (weight && fonts[weight]) {
      return fonts[weight];
    }
    return fonts.regular; // 기본 폰트
  };

  const textStyle = [
    styles.baseText,
    { color: colors.text },
    getVariantStyle(),
    weight && { fontFamily: getFontFamily() },
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'IBMPlexSansKR-Regular',
  },
}); 