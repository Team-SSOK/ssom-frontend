import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontFamily } from '@/styles/fonts';

export default function AppVersionInfo() {
  const { colors } = useTheme();

  return (
    <View style={styles.footer}>
      <Text style={[styles.footerText, { color: colors.textMuted }]}>
        SSOK Corporation
      </Text>
      <Text style={[styles.versionText, { color: colors.textMuted }]}>
        v1.0.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    fontWeight: '400',
  },
}); 