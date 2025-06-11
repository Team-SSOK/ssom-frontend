import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';

interface IssueTabNavigationProps {
  activeTab: 'my' | 'all';
  onTabChange: (tab: 'my' | 'all') => void;
}

export default function IssueTabNavigation({ activeTab, onTabChange }: IssueTabNavigationProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'my' && { backgroundColor: colors.primary },
          ]}
          onPress={() => onTabChange('my')}
        >
          <Text
            variant="body2"
            weight="semiBold"
            style={[
              styles.tabText,
              { color: activeTab === 'my' ? 'white' : colors.textSecondary },
            ]}
          >
            나의 이슈
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.tab,
            activeTab === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => onTabChange('all')}
        >
          <Text
            variant="body2"
            weight="semiBold"
            style={[
              styles.tabText,
              { color: activeTab === 'all' ? 'white' : colors.textSecondary },
            ]}
          >
            전체 이슈
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    // 스타일은 variant와 weight로 처리
  },
}); 