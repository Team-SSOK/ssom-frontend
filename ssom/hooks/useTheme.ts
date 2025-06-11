import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography, FontFamily, FontWeight } from '@/styles/fonts';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colorScheme,
    isDark,
    colors: Colors[colorScheme ?? 'light'],
    fonts: FontFamily,
    fontWeights: FontWeight,
    typography: Typography,
  };
}
