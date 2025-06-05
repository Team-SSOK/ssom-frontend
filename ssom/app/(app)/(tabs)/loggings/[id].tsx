import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLocalSearchParams } from 'expo-router';
import LogDetailHeader from '@/modules/logging/components/LogDetail/LogDetailHeader';
import LogDetailBasicInfo from '@/modules/logging/components/LogDetail/LogDetailBasicInfo';
import LogDetailMetadata from '@/modules/logging/components/LogDetail/LogDetailMetadata';

export default function LogDetailScreen() {
  const { colors } = useTheme();
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
  const logDetail = {
    logId: params.logId || params.id,
    timestamp: params.timestamp,
    level: params.level,
    logger: params.logger,
    thread: params.thread,
    message: params.message,
    app: params.app,
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

        <LogDetailMetadata
          logId={logDetail.logId || ''}
          logger={logDetail.logger || ''}
          thread={logDetail.thread || ''}
          app={logDetail.app || ''}
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