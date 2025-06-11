import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface AlertData {
  id: string;
  title: string; // Format: "[LEVEL] app-name"
  message: string;
  timestamp: string;
  kind?: string;
  isRead?: boolean;
  actionRequired?: boolean;
}

interface AlertItemProps {
  item: AlertData;
  onPress?: () => void;
}

export default function AlertItem({ item, onPress }: AlertItemProps) {
  const { colors } = useTheme();

  // Extract level from title format: "[ERROR] ssok-bank"
  const extractLevel = (title: string) => {
    const match = title.match(/\[(\w+)\]/);
    return match ? match[1] : 'INFO';
  };

  // Extract app name from title
  const extractAppName = (title: string) => {
    const match = title.match(/\]\s*(.+)/);
    return match ? match[1] : '';
  };

  const level = extractLevel(item.title);
  const appName = extractAppName(item.title);

  const getIconAndColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return { icon: 'alert-circle', color: '#FF3B30', bgColor: '#FFE5E5' };
      case 'WARN':
        return { icon: 'warning', color: '#FF9500', bgColor: '#FFF4E5' };
      case 'INFO':
        return { icon: 'information-circle', color: '#007AFF', bgColor: '#E5F4FF' };
      default:
        return { icon: 'notifications', color: '#8E8E93', bgColor: '#F2F2F7' };
    }
  };

  const { icon, color, bgColor } = getIconAndColor(level);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handlePress = () => {
    onPress?.();
  };

  return (
    <Pressable
      style={[
        styles.alertItem,
        { backgroundColor: colors.background }
      ]}
      onPress={handlePress}
    >
      <View style={styles.alertContent}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.alertTitle, { color: colors.text }]} numberOfLines={1}>
              {appName || level}
            </Text>
            <View style={styles.rightSection}>
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                {formatTime(item.timestamp)}
              </Text>
              {!item.isRead && (
                <View style={[styles.unreadDot, { backgroundColor: '#007AFF' }]} />
              )}
            </View>
          </View>
          
          <Text 
            style={[styles.alertMessage, { color: colors.textSecondary }]} 
            numberOfLines={2}
          >
            {item.message}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  alertItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '400',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 2,
  },
}); 