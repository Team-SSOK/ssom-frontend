import { TextStyle } from 'react-native';

// IBM Plex Sans KR 폰트 패밀리 정의
export const FontFamily = {
  regular: 'IBMPlexSansKR-Regular',
  medium: 'IBMPlexSansKR-Medium',
  semiBold: 'IBMPlexSansKR-SemiBold',
  bold: 'IBMPlexSansKR-Bold',
  light: 'IBMPlexSansKR-Light',
  extraLight: 'IBMPlexSansKR-ExtraLight',
  thin: 'IBMPlexSansKR-Thin',
} as const;

// 폰트 웨이트 정의
export const FontWeight = {
  thin: '100',
  extraLight: '200', 
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

// 기본 텍스트 스타일 (모든 텍스트에 적용)
export const baseTextStyle: TextStyle = {
  fontFamily: FontFamily.regular,
  fontWeight: FontWeight.regular,
};

// 타이포그래피 스타일 정의
export const Typography = {
  // 헤딩
  h1: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  h5: {
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  h6: {
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    fontSize: 16,
    lineHeight: 24,
  },

  // 본문
  body1: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  body3: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 12,
    lineHeight: 18,
  },

  // 버튼
  button: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonSmall: {
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    fontSize: 14,
    lineHeight: 20,
  },

  // 캡션
  caption: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    fontSize: 10,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
} as const; 