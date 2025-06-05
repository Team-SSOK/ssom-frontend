import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface LogDetailMetadataProps {
  logId: string;
  logger: string;
  thread: string;
  app: string;
  showAnalysisButton?: boolean;
  onAnalysisRequest?: () => void;
  isAnalyzing?: boolean;
}

export default function LogDetailMetadata({ 
  logId, 
  logger, 
  thread, 
  app, 
  showAnalysisButton = false,
  onAnalysisRequest,
  isAnalyzing = false 
}: LogDetailMetadataProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        기본 정보
      </Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            로그 ID:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {logId}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Logger:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {logger}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Thread:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {thread}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            애플리케이션:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {app}
          </Text>
        </View>
      </View>

      {showAnalysisButton && (
        <Pressable
          style={[
            styles.analysisButton,
            { 
              backgroundColor: colors.primary,
              opacity: isAnalyzing ? 0.7 : 1 
            }
          ]}
          onPress={onAnalysisRequest}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="analytics" size={20} color="white" />
          )}
          <Text style={[styles.analysisButtonText, { color: 'white' }]}>
            {isAnalyzing ? 'AI 분석 중...' : 'AI 분석 요청'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  analysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  analysisButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 