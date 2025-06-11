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
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  iconButton: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  markAllButton: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 