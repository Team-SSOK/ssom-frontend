import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
  useSafeArea?: boolean;
}

export default function LoadingIndicator({ 
  size = 'large',
  color,
  style,
  fullScreen = true,
  useSafeArea = true
}: LoadingIndicatorProps) {
  const { colors } = useTheme();
  const indicatorColor = color || colors.primary;

  const content = (
    <View style={[
      fullScreen ? styles.fullScreenContainer : styles.container,
      style
    ]}>
      <ActivityIndicator size={size} color={indicatorColor} />
    </View>
  );

  if (fullScreen && useSafeArea) {
    return (
      <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: colors.background }]}>
        {content}
      </SafeAreaView>
    );
  }

  if (fullScreen) {
    return (
      <View style={[styles.safeAreaContainer, { backgroundColor: colors.background }]}>
        {content}
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
}); 