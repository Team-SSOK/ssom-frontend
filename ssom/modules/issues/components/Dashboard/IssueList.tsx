import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
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
}

export default function IssueList({ issues }: IssueListProps) {

  return (
    <>
      <FlatList
        data={issues}
        renderItem={({ item }) => <IssueItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
}); 