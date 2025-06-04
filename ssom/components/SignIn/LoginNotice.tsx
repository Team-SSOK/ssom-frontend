import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginNotice() {
  const { colors } = useTheme();

  return (
    <View style={[styles.infoContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
      <Text style={[styles.infoText, { color: colors.textSecondary }]}>
        직원 ID는 시스템 관리자에게 문의하세요
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
}); 