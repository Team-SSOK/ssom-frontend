import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import AlertItem from './AlertItem';

interface AlertData {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  kind?: string;
  isRead?: boolean;
  actionRequired?: boolean;
}

interface AlertListProps {
  alerts: AlertData[];
}

export default function AlertList({ alerts }: AlertListProps) {
  const renderAlertItem = ({ item }: { item: AlertData }) => (
    <AlertItem item={item} />
  );

  return (
    <FlatList
      data={alerts}
      renderItem={renderAlertItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
}); 