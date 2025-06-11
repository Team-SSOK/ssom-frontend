import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface IssueFormHeaderProps {
  title: string;
  onReset: () => void;
}

export default function IssueFormHeader({ title, onReset }: IssueFormHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable
        style={styles.headerButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Pressable
        style={styles.headerButton}
        onPress={onReset}
      >
        <Ionicons name="refresh" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 