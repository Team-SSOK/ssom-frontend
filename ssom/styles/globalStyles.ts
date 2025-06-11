import { TextStyle } from 'react-native';
import { FontFamily } from './fonts';

// 글로벌 텍스트 스타일 정의
export const globalTextStyle: TextStyle = {
  fontFamily: FontFamily.regular,
};

// Text 컴포넌트의 기본 props
export const defaultTextProps = {
  style: globalTextStyle,
  allowFontScaling: false, // 시스템 폰트 크기 조정 비활성화
};

// TextInput 컴포넌트의 기본 props
export const defaultTextInputProps = {
  style: globalTextStyle,
  allowFontScaling: false,
}; 