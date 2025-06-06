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
    logId?: string;
    timestamp?: string;
    level?: string;
    logger?: string;
    thread?: string;
    message?: string;
    app?: string;
    fromIssue?: string;
  }>();

  // 이슈에서 접근했는지 여부 확인
  const isFromIssue = params.fromIssue === 'true';
  const logId = params.logId || params.id || '';

  // 로그 상세 조회 관련 상태
  const { currentLog, isLoadingCurrentLog, fetchLogById, clearCurrentLog } = useLogStore();

  // 로그 데이터 결정: 이슈에서 온 경우 API 호출, 아니면 params 사용
  const logDetail: LogEntry = isFromIssue && currentLog ? currentLog : {
    logId,
    timestamp: params.timestamp || '',
    level: (params.level as 'ERROR' | 'WARN' | 'INFO' | 'DEBUG') || 'INFO',
    logger: params.logger || '',
    thread: params.thread || '',
    message: params.message || '',
    app: params.app || '',
  };

  // 페이지 진입 시 로그 데이터 로드 (이슈에서 접근한 경우)
  useEffect(() => {
    if (isFromIssue && logId) {
      fetchLogById(logId);
    }
  }, [isFromIssue, logId, fetchLogById]);

  useEffect(() => {
    const loadExistingAnalysis = async () => {
      if (!logId) return;
      
      // 페이지 진입 시 분석 상태 초기화
      clearAnalysis();
      
      try {
        await getExistingAnalysis(logId);
      } catch (error) {
        // 에러는 logStore에서 이미 처리됨
      }
    };

    loadExistingAnalysis();
  }, [logId, getExistingAnalysis, clearAnalysis]);

  // 컴포넌트 unmount 시 cleanup
  useEffect(() => {
    return () => {
      if (isFromIssue) {
        clearCurrentLog();
      }
      clearAnalysis();
    };
  }, [isFromIssue, clearCurrentLog, clearAnalysis]);

  // 새로운 분석 요청 (API 스펙 5번)
  const handleAnalysisRequest = async () => {
    try {
      await createAnalysis(logDetail);
      toast.success('분석 완료', 'AI 분석이 완료되었습니다.');
    } catch (error) {
      toast.error('분석 실패', 'AI 분석 요청에 실패했습니다.');
    }
  };

  // 이슈에서 접근했을 때 로그 데이터 로딩 중인지 확인
  const isLoading = isFromIssue && isLoadingCurrentLog;

  // 로딩 중이거나 로그 데이터가 없는 경우
  if (isLoading || (isFromIssue && !currentLog)) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <LogDetailHeader 
          logData={{
            logId: logId || '',
            level: '',
            message: isLoading ? '로그 정보를 불러오는 중...' : '로그를 찾을 수 없습니다.',
            app: '',
          }}
        />
      </SafeAreaView>
    );
  }

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