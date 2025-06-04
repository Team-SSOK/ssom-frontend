import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/styles/fonts';

interface PwChangeHeaderProps {
  isFirstLogin?: boolean;
}

export default function PwChangeHeader({ isFirstLogin = true }: PwChangeHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
        <Ionicons name="analytics" size={32} color={colors.white} />
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>
        SSOM 보안 설정
      </Text>
      
      {isFirstLogin ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          보안을 위해 초기 비밀번호를 변경해주세요
        </Text>
      ) : (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          새로운 비밀번호로 변경해주세요
        </Text>
      )}
      
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.textMuted }]}>
          비밀번호 변경
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20,
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