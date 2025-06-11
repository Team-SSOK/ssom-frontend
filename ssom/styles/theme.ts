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
      ...MD3LightTheme.fonts.displayLarge,
      fontFamily: FontFamily.bold,
    },
    displayMedium: {
      ...MD3LightTheme.fonts.displayMedium,
      fontFamily: FontFamily.bold,
    },
    displaySmall: {
      ...MD3LightTheme.fonts.displaySmall,
      fontFamily: FontFamily.bold,
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: FontFamily.semiBold,
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontFamily: FontFamily.semiBold,
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: FontFamily.semiBold,
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: FontFamily.medium,
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: FontFamily.medium,
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: FontFamily.medium,
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: FontFamily.regular,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: FontFamily.regular,
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: FontFamily.regular,
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: FontFamily.medium,
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: FontFamily.medium,
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontFamily: FontFamily.medium,
    },
  },
}; 