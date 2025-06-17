import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface IssueDetailHeaderProps {
  issueId: number;
}

export default function IssueDetailHeader({ issueId }: IssueDetailHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable onPress={() => router.back()} style={styles.button}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={[styles.title, { color: colors.text }]}>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
}); 