import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';

interface IssueDetailDescriptionProps {
  description: string;
}

export default function IssueDetailDescription({ description }: IssueDetailDescriptionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Description
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description || 'No description provided.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
}); 