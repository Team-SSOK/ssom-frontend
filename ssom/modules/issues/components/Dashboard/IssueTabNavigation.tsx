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
    <View style={styles.container}>
      <Pressable
        style={[styles.tab, activeTab === 'my' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
        onPress={() => onTabChange('my')}
      >
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'my' ? colors.primary : colors.textSecondary },
          ]}
          weight={activeTab === 'my' ? 'bold' : 'medium'}
        >
          나의 이슈
        </Text>
      </Pressable>
      
      <Pressable
        style={[styles.tab, activeTab === 'all' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
        onPress={() => onTabChange('all')}
      >
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'all' ? colors.primary : colors.textSecondary },
          ]}
          weight={activeTab === 'all' ? 'bold' : 'medium'}
        >
          전체 이슈
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    // borderBottomColor is set dynamically
  },
  tabText: {
    fontSize: 15,
  },
}); 