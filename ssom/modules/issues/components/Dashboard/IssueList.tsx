import React, { memo, useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useFab } from '@/contexts/FabContext';
import IssueItem from '@/modules/issues/components/Dashboard/IssueItem';

interface Issue {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  description: string;
}

interface IssueListProps {
  issues: Issue[];
  refreshControl?: any;
  headerComponent?: React.ReactElement;
}

function IssueList({ issues, refreshControl, headerComponent }: IssueListProps) {
  const { handleScroll } = useFab();
  
  const renderItem = useCallback(({ item }: { item: Issue }) => (
    <IssueItem item={item} />
  ), []);

  const keyExtractor = useCallback((item: Issue) => item.id, []);

  return (
    <FlatList
      data={issues}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      // 스크롤 이벤트
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={refreshControl}
      ListHeaderComponent={headerComponent}
      // 성능 최적화 설정
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={100}
      initialNumToRender={10}
      windowSize={10}
    />
  );
}

export default memo(IssueList);

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
}); 