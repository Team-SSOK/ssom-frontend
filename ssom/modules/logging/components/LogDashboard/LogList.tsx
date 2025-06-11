import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useLogStore } from '@/modules/logging/stores/logStore';
import { useFab } from '@/contexts/FabContext';
import LogItem from './LogItem';

interface LogData {
  logId: string;
  timestamp: string;
  level: string;
  logger: string;
  thread: string;
  message: string;
  app: string;
}

interface LogListProps {
  logs?: LogData[]; // 선택적으로 로그 데이터 전달
  useStoreData?: boolean; // 스토어 데이터를 사용할지 여부
  isMultiSelectMode?: boolean;
  selectedLogIds?: string[];
  onLogSelect?: (logId: string) => void;
  onLogLongPress?: (logId: string) => void;
}

export default function LogList({ 
  logs: externalLogs, 
  useStoreData = false,
  isMultiSelectMode = false,
  selectedLogIds = [],
  onLogSelect,
  onLogLongPress
}: LogListProps) {
  const { handleScroll } = useFab();
  
  // 스토어에서 로그 데이터 가져오기 (useStoreData가 true일 때)
  const { logs: storeLogs } = useLogStore();
  
  // 사용할 로그 데이터 결정
  const logs = useStoreData ? storeLogs : (externalLogs || []);

  const renderLogItem = ({ item }: { item: LogData }) => (
    <LogItem 
      item={item}
      isMultiSelectMode={isMultiSelectMode}
      isSelected={selectedLogIds.includes(item.logId)}
      onSelect={onLogSelect}
      onLongPress={onLogLongPress}
    />
  );

  return (
    <FlatList
      data={logs}
      renderItem={renderLogItem}
      keyExtractor={(item) => item.logId}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      // 스크롤 이벤트
      onScroll={handleScroll}
      scrollEventThrottle={16}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
}); 