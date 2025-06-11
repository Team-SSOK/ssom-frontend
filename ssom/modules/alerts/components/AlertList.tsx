import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { LoadingIndicator } from '@/components';
import { useFab } from '@/contexts/FabContext';
import AlertItem from './AlertItem';

interface AlertData {
  id: string;
  alertStatusId: number;
  title: string;
  message: string;
  timestamp: string;
  kind?: string;
  isRead?: boolean;
  actionRequired?: boolean;
}

interface AlertListProps {
  alerts: AlertData[];
  onAlertPress?: (alertStatusId: number) => void;
  onEndReached?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isLoadingMore?: boolean;
  disableInfiniteScroll?: boolean;
}

export default function AlertList({ 
  alerts, 
  onAlertPress,
  onEndReached,
  onRefresh,
  isRefreshing = false,
  isLoadingMore = false,
  disableInfiniteScroll = false
}: AlertListProps) {
  const { colors } = useTheme();
  const { handleScroll } = useFab();

  const renderAlertItem = ({ item, index }: { item: AlertData; index: number }) => (
    <View>
      <AlertItem 
        item={item} 
        onPress={() => onAlertPress?.(item.alertStatusId)}
      />
      {index < alerts.length - 1 && (
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
      )}
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore || disableInfiniteScroll) return null;
    
    return (
      <View style={styles.footer}>
        <LoadingIndicator size="small" />
      </View>
    );
  };

  return (
    <FlatList
      data={alerts}
      renderItem={renderAlertItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      // 스크롤 이벤트
      onScroll={handleScroll}
      scrollEventThrottle={16}
      // 무한스크롤 관련 props
      onEndReached={disableInfiniteScroll ? undefined : onEndReached}
      onEndReachedThreshold={disableInfiniteScroll ? undefined : 0.3} // 30% 지점에서 트리거
      // Pull to Refresh 관련 props
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      // Footer 컴포넌트
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 68, // 아이콘 너비 + 마진만큼 들여쓰기
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
}); 