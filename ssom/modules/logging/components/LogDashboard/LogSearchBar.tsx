import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface LogSearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
}

export default function LogSearchBar({ searchText, onSearchChange }: LogSearchBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="search" size={16} color={colors.textMuted} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }]}
        placeholder="로그 검색..."
        placeholderTextColor={colors.textMuted}
        value={searchText}
        onChangeText={onSearchChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.select({
      ios: 12,
    }),
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
}); 