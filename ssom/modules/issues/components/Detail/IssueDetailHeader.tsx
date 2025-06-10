import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface IssueDetailHeaderProps {
  issueId: number;
}

export default function IssueDetailHeader({ issueId }: IssueDetailHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={colors.text} 
        />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Issue #{issueId}
      </Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
}); 