import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FontFamily } from '@/styles/fonts';

interface AlertHeaderProps {
  onMarkAllAsRead?: () => void;
  hasUnreadAlerts?: boolean;
  selectedTab?: 'all' | 'unread';
  onTabChange?: (tab: 'all' | 'unread') => void;
}

export default function AlertHeader({ 
  onMarkAllAsRead, 
  hasUnreadAlerts = false,
  selectedTab = 'all',
  onTabChange
}: AlertHeaderProps) {
  const { colors } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const handleMarkAllPress = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  return (
    <View style={[
      styles.header, 
      { backgroundColor: colors.background, borderBottomColor: colors.border }
    ]}>
      <View style={styles.headerContent}>
        <Pressable 
          style={styles.iconButton} 
          onPress={handleBackPress}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        
        <Text style={[styles.title, { color: colors.text }]}>
          알림
        </Text>
        
        <View style={styles.markAllButton}>
          {hasUnreadAlerts && (
            <Pressable 
              onPress={handleMarkAllPress}
            >
              <Text style={[styles.markAllText, { color: colors.primary }]}>
                모두 읽음
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      
      {/* Tab Section */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tab,
            selectedTab === 'all' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => onTabChange?.('all')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'all' ? colors.primary : colors.textSecondary }
          ]}>
            All
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.tab,
            selectedTab === 'unread' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => onTabChange?.('unread')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'unread' ? colors.primary : colors.textSecondary }
          ]}>
            Unread
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 0, 
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  iconButton: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  markAllButton: {
    width: 80,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 44,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
}); 