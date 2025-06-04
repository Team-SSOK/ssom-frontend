import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
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
  onViewAll?: () => void;
}

export default function IssueList({ issues, onViewAll }: IssueListProps) {
  const { colors } = useTheme();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log('View All');
    }
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          최근 이슈
        </Text>
        <Pressable onPress={handleViewAll}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            View All
          </Text>
        </Pressable>
      </View>

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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
}); 