import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface IssueMetaInfoBannerProps {
  isAnalyzing?: boolean;
  fromLog?: boolean;
  logId?: string;
}

export default function IssueMetaInfoBanner({ 
  isAnalyzing = false, 
  fromLog = false, 
  logId 
}: IssueMetaInfoBannerProps) {
  const { colors } = useTheme();

  if (!isAnalyzing && !fromLog) {
    return null;
  }

  return (
    <>
      {/* AI 분석 중 표시 */}
      {isAnalyzing && (
        <View style={[styles.banner, { backgroundColor: colors.surface }]}>
          <Ionicons name="sync" size={20} color={colors.primary} />
          <Text style={[styles.bannerText, { color: colors.text }]}>
            AI가 로그를 분석하여 이슈 템플릿을 생성하는 중...
          </Text>
        </View>
      )}

      {/* Log Context (if from log) */}
      {fromLog && !isAnalyzing && (
        <View style={[styles.banner, { backgroundColor: colors.surface }]}>
          <Ionicons name="document-text" size={20} color={colors.primary} />
          <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.bannerText, { color: colors.text }]}>
            로그 기반 AI 분석 완료 (ID: {logId})
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 