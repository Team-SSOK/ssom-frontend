import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/styles/fonts';

interface RequirementItemProps {
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: any;
}

function RequirementItem({ text, icon, colors }: RequirementItemProps) {
  return (
    <View style={styles.requirementItem}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
        {text}
      </Text>
    </View>
  );
}

export default function PwChangeRequirements() {
  const { colors } = useTheme();

  const requirements = [
    { text: '최소 8자 이상', icon: 'checkmark-circle-outline' as const },
    { text: '영문 대문자 및 소문자 포함', icon: 'checkmark-circle-outline' as const },
    { text: '숫자 1개 이상 포함', icon: 'checkmark-circle-outline' as const },
    { text: '특수문자 1개 이상 포함', icon: 'checkmark-circle-outline' as const },
  ];

  return (
    <View style={[styles.requirements, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.requirementsHeader}>
        <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
        <Text style={[styles.requirementsTitle, { color: colors.text }]}>
          비밀번호 보안 요구사항
        </Text>
      </View>
      
      <View style={styles.requirementsList}>
        {requirements.map((requirement, index) => (
          <RequirementItem
            key={index}
            text={requirement.text}
            icon={requirement.icon}
            colors={colors}
          />
        ))}
      </View>
      
      <View style={styles.securityNote}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
        <Text style={[styles.securityNoteText, { color: colors.textMuted }]}>
          안전한 비밀번호로 시스템을 보호하세요
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  requirements: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
  requirementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  requirementsTitle: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  requirementsList: {
    gap: 8,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    flex: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    marginTop: 8,
  },
  securityNoteText: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    flex: 1,
  },
}); 