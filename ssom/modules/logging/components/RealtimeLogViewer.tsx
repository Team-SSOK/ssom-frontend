import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useLogStore } from '@/modules/logging/stores/logStore';
import LogList from './LogDashboard/LogList';

interface RealtimeLogViewerProps {
  title?: string;
  maxHeight?: number;
}

/**
 * 실시간 로그 뷰어 컴포넌트
 * 
 * SSE를 통해 받아온 로그를 실시간으로 표시합니다.
 * LogList.tsx의 스토어 데이터를 사용합니다.
 */
export default function RealtimeLogViewer({ 
  title = '실시간 로그', 
  maxHeight = 400 
}: RealtimeLogViewerProps) {
  const { colors } = useTheme();
  const { logs } = useLogStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* 헤더 */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {logs.length}개
        </Text>
      </View>

      {/* 로그 목록 */}
      <View style={[styles.logContainer, { maxHeight }]}>
        {logs.length > 0 ? (
          <LogList 
            useStoreData={true}
            isMultiSelectMode={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              실시간 로그를 기다리는 중...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  count: {
    fontSize: 14,
    fontWeight: '500',
  },
  logContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 