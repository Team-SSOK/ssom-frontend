import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { FontFamily } from './fonts';
import { theme } from './theme';

const styles = StyleSheet.create({
  base: {
    borderLeftWidth: 4,
    borderRadius: 12,
    height: 'auto',
    minHeight: 60,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
  },
  contentContainer: {
    paddingHorizontal: 0,
  },
  text1: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
    lineHeight: 22,
    marginBottom: 2,
  },
  text2: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
    opacity: 0.8,
  },
});

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={[
        styles.base,
        {
          borderLeftColor: theme.colors.primary,
          backgroundColor: '#F0F9F0',
        }
      ]}
      contentContainerStyle={styles.contentContainer}
      text1Style={[
        styles.text1,
        { color: '#1B5E20' }
      ]}
      text2Style={[
        styles.text2,
        { color: '#2E7D32' }
      ]}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={[
        styles.base,
        {
          borderLeftColor: theme.colors.error,
          backgroundColor: '#FFEBEE',
        }
      ]}
      contentContainerStyle={styles.contentContainer}
      text1Style={[
        styles.text1,
        { color: '#C62828' }
      ]}
      text2Style={[
        styles.text2,
        { color: '#D32F2F' }
      ]}
    />
  ),

  info: (props: any) => (
    <InfoToast
      {...props}
      style={[
        styles.base,
        {
          borderLeftColor: theme.colors.secondary,
          backgroundColor: '#E3F2FD',
        }
      ]}
      contentContainerStyle={styles.contentContainer}
      text1Style={[
        styles.text1,
        { color: '#1565C0' }
      ]}
      text2Style={[
        styles.text2,
        { color: '#1976D2' }
      ]}
    />
  ),

  // 경고용 커스텀 토스트
  warning: ({ text1, text2, ...props }: any) => (
    <View style={[
      styles.base,
      {
        borderLeftColor: '#FF9800',
        backgroundColor: '#FFF3E0',
      }
    ]}>
      <Text style={[
        styles.text1,
        { color: '#E65100' }
      ]}>
        {text1}
      </Text>
      {text2 && (
        <Text style={[
          styles.text2,
          { color: '#F57C00' }
        ]}>
          {text2}
        </Text>
      )}
    </View>
  ),
}; 