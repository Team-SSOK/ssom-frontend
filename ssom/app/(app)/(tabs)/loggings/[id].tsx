import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useLocalSearchParams } from 'expo-router';
import LogDetailHeader from '@/modules/logging/components/LogDetail/LogDetailHeader';
import LogDetailBasicInfo from '@/modules/logging/components/LogDetail/LogDetailBasicInfo';
import LogDetailMetadata from '@/modules/logging/components/LogDetail/LogDetailMetadata';
import LogAnalysisResultComponent from '@/modules/logging/components/LogDetail/LogAnalysisResult';
import { useLogStore } from '@/modules/logging/stores/logStore';
import { LogEntry, LogAnalysisResult } from '@/modules/logging/types';

export default function LogDetailScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  
  // logStore에서 분석 관련 상태와 액션 가져오기
  const { 
    analysisResult, 
    isAnalyzing, 
    hasExistingAnalysis, 
    getExistingAnalysis, 
    createAnalysis,
    clearAnalysis 
  } = useLogStore();
  
  const params = useLocalSearchParams<{
    id: string;
    logId: string;
    timestamp: string;
    level: string;
    logger: string;
    thread: string;
    message: string;
    app: string;
  }>();

  // params로 받은 실제 로그 데이터 사용
  const logDetail: LogEntry = {
    logId: params.logId || params.id || '',
    timestamp: params.timestamp || '',
    level: (params.level as 'ERROR' | 'WARN' | 'INFO' | 'DEBUG') || 'INFO',
    logger: params.logger || '',
    thread: params.thread || '',
    message: params.message || '',
    app: params.app || '',
  };

  // 페이지 진입 시 기존 분석 결과 조회 (API 스펙 4번)
  useEffect(() => {
    const loadExistingAnalysis = async () => {
      if (!logDetail.logId) return;
      
      // 페이지 진입 시 분석 상태 초기화
      clearAnalysis();
      
      try {
        await getExistingAnalysis(logDetail.logId);
      } catch (error) {
        // 에러는 logStore에서 이미 처리됨
      }
    };

    loadExistingAnalysis();
  }, [logDetail.logId, getExistingAnalysis, clearAnalysis]);

  // 새로운 분석 요청 (API 스펙 5번)
  const handleAnalysisRequest = async () => {
    try {
      await createAnalysis(logDetail);
      toast.success('분석 완료', 'AI 분석이 완료되었습니다.');
    } catch (error) {
      toast.error('분석 실패', 'AI 분석 요청에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <LogDetailHeader 
        logData={{
          logId: logDetail.logId || '',
          level: logDetail.level || '',
          message: logDetail.message || '',
          app: logDetail.app || '',
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LogDetailBasicInfo
          level={logDetail.level || ''}
          timestamp={logDetail.timestamp || ''}
          app={logDetail.app || ''}
          message={logDetail.message || ''}
        />

        {/* AI 분석 결과 표시 */}
        {analysisResult && (
          <LogAnalysisResultComponent analysis={analysisResult} />
        )}

        <LogDetailMetadata
          logId={logDetail.logId || ''}
          logger={logDetail.logger || ''}
          thread={logDetail.thread || ''}
          app={logDetail.app || ''}
          showAnalysisButton={hasExistingAnalysis === false}
          onAnalysisRequest={handleAnalysisRequest}
          isAnalyzing={isAnalyzing}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 