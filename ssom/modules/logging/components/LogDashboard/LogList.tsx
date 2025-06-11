import React from 'react';
import { FlatList, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
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
  isMultiSelectMode?: boolean;
  selectedLogIds?: string[];
  onLogSelect?: (logId: string) => void;
  onLogLongPress?: (logId: string) => void;
  // 무한 스크롤 관련 props
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMoreLogs?: boolean;
}

// LogItem 높이 계산: padding(16*2) + content(~40) + marginBottom(12) = ~84
const ITEM_HEIGHT = 84;

export default function LogList({ 
  logs = [],
  isMultiSelectMode = false,
  selectedLogIds = [],
  onLogSelect,
  onLogLongPress,
  onLoadMore,
  isLoadingMore = false,
  hasMoreLogs = true,
}: LogListProps) {
  const { colors } = useTheme();
  const { handleScroll } = useFab();

  const renderLogItem = ({ item }: { item: LogData }) => (
    <LogItem 
      item={item}
      isMultiSelectMode={isMultiSelectMode}
      isSelected={selectedLogIds.includes(item.logId)}
      onSelect={onLogSelect}
      onLongPress={onLogLongPress}
    />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const handleEndReached = () => {
    if (hasMoreLogs && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  };

  const keyExtractor = (item: LogData) => item.logId;

  const getItemLayout = (data: ArrayLike<LogData> | null | undefined, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <FlatList
      data={logs}
      renderItem={renderLogItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      // 스크롤 이벤트
      onScroll={handleScroll}
      scrollEventThrottle={16}
      // 무한 스크롤 관련
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      // 성능 최적화
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={15}
      windowSize={10}
      getItemLayout={getItemLayout}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
}); 