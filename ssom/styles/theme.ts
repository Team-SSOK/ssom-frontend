import { MD3LightTheme } from 'react-native-paper';
import { FontFamily } from './fonts';

// IBM Plex Sans KR 폰트가 적용된 테마
export const theme = {
  ...MD3LightTheme,
  fonts: {
    ...MD3LightTheme.fonts,
    default: {
      fontFamily: FontFamily.regular,
      fontWeight: '400' as const,
    },
    displayLarge: {
      fontFamily: FontFamily.bold,
      fontWeight: '700' as const,
      fontSize: 57,
      lineHeight: 64,
    },
    displayMedium: {
      fontFamily: FontFamily.bold,
      fontWeight: '700' as const,
      fontSize: 45,
      lineHeight: 52,
    },
    displaySmall: {
      fontFamily: FontFamily.bold,
      fontWeight: '700' as const,
      fontSize: 36,
      lineHeight: 44,
    },
    headlineLarge: {
      fontFamily: FontFamily.semiBold,
      fontWeight: '600' as const,
      fontSize: 32,
      lineHeight: 40,
    },
    headlineMedium: {
      fontFamily: FontFamily.semiBold,
      fontWeight: '600' as const,
      fontSize: 28,
      lineHeight: 36,
    },
    headlineSmall: {
      fontFamily: FontFamily.semiBold,
      fontWeight: '600' as const,
      fontSize: 24,
      lineHeight: 32,
    },
    titleLarge: {
      fontFamily: FontFamily.medium,
      fontWeight: '500' as const,
      fontSize: 22,
      lineHeight: 28,
    },
    titleMedium: {
      fontFamily: FontFamily.medium,
      fontWeight: '500' as const,
      fontSize: 16,
      lineHeight: 24,
    },
    titleSmall: {
      fontFamily: FontFamily.medium,
      fontWeight: '500' as const,
      fontSize: 14,
      lineHeight: 20,
    },
    bodyLarge: {
      fontFamily: FontFamily.regular,
      fontWeight: '400' as const,
      fontSize: 16,
      lineHeight: 24,
    },
    bodyMedium: {
      fontFamily: FontFamily.regular,
      fontWeight: '400' as const,
      fontSize: 14,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: FontFamily.regular,
      fontWeight: '400' as const,
      fontSize: 12,
      lineHeight: 16,
    },
    labelLarge: {
      fontFamily: FontFamily.medium,
      fontWeight: '500' as const,
      fontSize: 14,
      lineHeight: 20,
    },
    labelMedium: {
      fontFamily: FontFamily.medium,
      fontWeight: '500' as const,
      fontSize: 12,
      lineHeight: 16,
    },
    labelSmall: {
      fontFamily: FontFamily.medium,
      fontWeight: '500' as const,
      fontSize: 11,
      lineHeight: 16,
    },
  },
}; 