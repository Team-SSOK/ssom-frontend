import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/styles/fonts';

export default function AppLogo() {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
        <Ionicons name="analytics" size={40} color={colors.white} />
      </View>
      
      <Text style={[styles.appName, { color: colors.text }]}>
        SSOM
      </Text>
      
      <Text style={[styles.appSubtitle, { color: colors.primary }]}>
        System Service Operations Monitoring
      </Text>
      
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.textMuted }]}>
          로그인
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 32,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
}); 