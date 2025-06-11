import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { LoadingIndicator } from '@/components';
import { useToast } from '@/hooks/useToast';
import { useLocalSearchParams } from 'expo-router';
import LogDetailHeader from '@/modules/logging/components/LogDetail/LogDetailHeader';
import LogDetailBasicInfo from '@/modules/logging/components/LogDetail/LogDetailBasicInfo';
import LogDetailMetadata from '@/modules/logging/components/LogDetail/LogDetailMetadata';
import LogAnalysisResultComponent from '@/modules/logging/components/LogDetail/LogAnalysisResult';
import { useLogStore } from '@/modules/logging/stores/logStore';

export default function LogDetailScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  
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
  }>();

  const logId = params.logId || params.id || '';

  const { currentLog, isLoadingCurrentLog, fetchLogById, clearCurrentLog } = useLogStore();

  useEffect(() => {
    if(!logId){
      toast.error('로그 정보를 불러오는 중...', '로그를 찾을 수 없습니다.');
      return;
    }

    fetchLogById(logId);
    clearAnalysis();
    getExistingAnalysis(logId);

    return () => {
      clearCurrentLog();
      clearAnalysis();
    }
  },[logId])

  const handleAnalysisRequest = async () => {
    if (!currentLog) return;
    
    try {
      await createAnalysis(currentLog);
      toast.success('분석 완료', 'AI 분석이 완료되었습니다.');
    } catch (error) {
      toast.error('분석 실패', 'AI 분석 요청에 실패했습니다.');
    }
  };

  if(isLoadingCurrentLog || !currentLog){
    return <LoadingIndicator />
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <LogDetailHeader 
        logData={{
          logId: currentLog.logId,
          level: currentLog.level,
          message: currentLog.message,
          app: currentLog.app,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LogDetailBasicInfo
          level={currentLog.level}
          timestamp={currentLog.timestamp}
          app={currentLog.app}
          message={currentLog.message}
        />

        {/* AI 분석 결과 표시 */}
        {analysisResult && (
          <LogAnalysisResultComponent analysis={analysisResult} />
        )}

        <LogDetailMetadata
          logId={currentLog.logId}
          logger={currentLog.logger}
          thread={currentLog.thread}
          app={currentLog.app}
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