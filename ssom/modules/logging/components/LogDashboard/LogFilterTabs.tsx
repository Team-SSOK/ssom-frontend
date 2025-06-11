import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LogFilterTabsProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
}

const filterOptions = [
  { key: 'ALL', label: '전체' },
  { key: 'ERROR', label: 'ERROR' },
  { key: 'WARN', label: 'WARN' },
];

export default function LogFilterTabs({ 
  selectedLevel, 
  onLevelChange
}: LogFilterTabsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {filterOptions.map((option) => (
        <Pressable
          key={option.key}
          style={[
            styles.tab,
            {
              backgroundColor: selectedLevel === option.key 
                ? colors.primary 
                : colors.backgroundSecondary
            }
          ]}
          onPress={() => onLevelChange(option.key)}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: selectedLevel === option.key 
                  ? colors.white 
                  : colors.text
              }
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 