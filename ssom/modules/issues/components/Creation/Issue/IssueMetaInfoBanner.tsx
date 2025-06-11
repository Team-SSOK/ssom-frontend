import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface IssueMetaInfoBannerProps {
  isAnalyzing?: boolean;
  fromLog?: boolean;
  logId?: string;
  logIds?: string[];
  multiSelect?: boolean;
}

export default function IssueMetaInfoBanner({ 
  isAnalyzing = false, 
  fromLog = false, 
  logId,
  logIds,
  multiSelect = false
}: IssueMetaInfoBannerProps) {
  const { colors } = useTheme();

  if (!isAnalyzing && !fromLog) {
    return null;
  }

  const getAnalyzingText = () => {
    if (multiSelect && logIds && logIds.length > 1) {
      return `AI가 ${logIds.length}개 로그를 분석하여 이슈 템플릿을 생성하는 중...`;
    }
    return 'AI가 로그를 분석하여 이슈 템플릿을 생성하는 중...';
  };

  const getCompletedText = () => {
    if (multiSelect && logIds && logIds.length > 1) {
      return `다중 로그 AI 분석 완료 (${logIds.length}개 로그)`;
    }
    return `로그 기반 AI 분석 완료 (ID: ${logId})`;
  };

  return (
    <>
      {/* AI 분석 중 표시 */}
      {isAnalyzing && (
        <View style={[styles.banner, { backgroundColor: colors.surface }]}>
          <Ionicons name="sync" size={20} color={colors.primary} />
          <Text style={[styles.bannerText, { color: colors.text }]}>
            {getAnalyzingText()}
          </Text>
        </View>
      )}

      {/* Log Context (if from log) */}
      {fromLog && !isAnalyzing && (
        <View style={[styles.banner, { backgroundColor: colors.surface }]}>
          <Ionicons 
            name={multiSelect ? "documents" : "document-text"} 
            size={20} 
            color={colors.primary} 
          />
          <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.bannerText, { color: colors.text }]}>
            {getCompletedText()}
          </Text>
        </View>
      )}

      {/* 다중 로그 상세 정보 */}
      {fromLog && !isAnalyzing && multiSelect && logIds && logIds.length > 1 && (
        <View style={[styles.detailBanner, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            분석된 로그 ID: {logIds.slice(0, 3).join(', ')}{logIds.length > 3 ? ` 외 ${logIds.length - 3}개` : ''}
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
  detailBanner: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
    marginTop: -12,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '400',
  },
}); 