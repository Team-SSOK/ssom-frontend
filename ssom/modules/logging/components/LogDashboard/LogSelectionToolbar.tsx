import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface LogSelectionToolbarProps {
  selectedCount: number;
  onCreateIssues: () => void;
  onClearSelection: () => void;
}

export default function LogSelectionToolbar({
  selectedCount,
  onCreateIssues,
  onClearSelection,
}: LogSelectionToolbarProps) {
  const { colors } = useTheme();

  if (selectedCount === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={onCreateIssues}
        >
          <Ionicons name="add" size={18} color={colors.white} />
          <Text style={[styles.createButtonText, { color: colors.white }]}>
            이슈 생성
          </Text>
        </Pressable>
        <Pressable
          style={[styles.clearButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={onClearSelection}
        >
          <Ionicons name="close" size={18} color={colors.textSecondary} />
          <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>
            선택 해제
          </Text>
        </Pressable>

      </View>
      <Text style={[styles.selectionText, { color: colors.text }]}>
        {selectedCount}개 로그 선택됨
      </Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  createButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
}); 