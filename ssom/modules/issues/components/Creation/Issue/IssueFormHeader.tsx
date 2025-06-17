import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface IssueFormHeaderProps {
  title: string;
  onReset?: () => void;
}

export default function IssueFormHeader({ title, onReset }: IssueFormHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable onPress={() => router.back()} style={styles.button}>
        <Ionicons name="close" size={24} color={colors.text} />
      </Pressable>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {onReset ? (
        <Pressable onPress={onReset} style={styles.button}>
          <Text style={{ color: colors.primary }}>초기화</Text>
        </Pressable>
      ) : (
        <View style={styles.button} />
      )}
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
    width: 60,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 