import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
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
}

export default function AlertList({ alerts, onAlertPress }: AlertListProps) {
  const renderAlertItem = ({ item }: { item: AlertData }) => (
    <AlertItem 
      item={item} 
      onPress={() => onAlertPress?.(item.alertStatusId)}
    />
  );

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
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
}); 