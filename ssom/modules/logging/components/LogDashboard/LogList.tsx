import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
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
  logs: LogData[];
  isMultiSelectMode?: boolean;
  selectedLogIds?: string[];
  onLogSelect?: (logId: string) => void;
  onLogLongPress?: (logId: string) => void;
}

export default function LogList({ 
  logs, 
  isMultiSelectMode = false,
  selectedLogIds = [],
  onLogSelect,
  onLogLongPress
}: LogListProps) {
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
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
}); 