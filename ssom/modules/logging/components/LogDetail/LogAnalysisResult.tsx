import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { LogAnalysisResult } from '../../types';
import { FontFamily } from '@/styles/fonts';
import Markdown from 'react-native-markdown-display';

interface LogAnalysisResultProps {
  analysis: LogAnalysisResult;
}

export default function LogAnalysisResultComponent({ analysis }: LogAnalysisResultProps) {
  const { colors } = useTheme();

  const markdownStyles = {
    body: {
      color: colors.text,
      fontSize: 14,
      fontFamily: FontFamily.regular,
    },
    heading1: {
      color: colors.text,
      fontSize: 18,
      fontFamily: FontFamily.bold,
      fontWeight: '700',
      marginBottom: 8,
    },
    heading2: {
      color: colors.text,
      fontSize: 16,
      fontFamily: FontFamily.bold,
      fontWeight: '600',
      marginBottom: 6,
    },
    heading3: {
      color: colors.text,
      fontSize: 15,
      fontFamily: FontFamily.bold,
      fontWeight: '600',
      marginBottom: 4,
    },
    paragraph: {
      color: colors.text,
      fontSize: 14,
      fontFamily: FontFamily.regular,
      lineHeight: 20,
      marginBottom: 8,
    },
    list_item: {
      color: colors.text,
      fontSize: 14,
      fontFamily: FontFamily.regular,
      lineHeight: 20,
    },
    code_inline: {
      backgroundColor: colors.background,
      color: colors.primary,
      fontSize: 13,
      fontFamily: FontFamily.regular,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    code_block: {
      backgroundColor: colors.background,
      color: colors.text,
      fontSize: 13,
      fontFamily: FontFamily.regular,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    blockquote: {
      backgroundColor: colors.background,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>🤖 AI 분석 결과</Text>
      
      {/* 요약 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>📝 요약</Text>
        <Markdown style={markdownStyles}>
          {analysis.summary}
        </Markdown>
      </View>

      {/* 위치 정보 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>📍 발생 위치</Text>
        <View style={[styles.locationContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.locationText, { color: colors.text }]}>
            <Text style={{ fontWeight: '600' }}>파일:</Text> {analysis.location.file}
          </Text>
          <Text style={[styles.locationText, { color: colors.text }]}>
            <Text style={{ fontWeight: '600' }}>함수:</Text> {analysis.location.function}
          </Text>
        </View>
      </View>

      {/* 해결책 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>💡 해결책</Text>
        <Markdown style={markdownStyles}>
          {analysis.solution}
        </Markdown>
      </View>

      {/* 상세 해결책 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>🔧 상세 해결 방법</Text>
        <Markdown style={markdownStyles}>
          {analysis.solution_detail}
        </Markdown>
              </View>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    fontWeight: '600',
    marginBottom: 8,
  },

  locationContainer: {
    padding: 12,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    marginBottom: 4,
  },
}); 