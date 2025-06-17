import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components';
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
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract level from title format: "[ERROR] ssok-bank"
  const extractLevel = (title: string) => {
    const match = title.match(/\[(\w+)\]/);
    return match ? match[1] : 'INFO';
  };

  // Extract app name from title
  const extractAppName = (title: string) => {
    const match = title.match(/\]\s*(.+)/);
    return match ? match[1].trim() : title;
  };

  const level = extractLevel(item.title);
  const appName = extractAppName(item.title);

  const getIconAndColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return { icon: 'alert-circle', color: colors.danger };
      case 'WARN':
        return { icon: 'warning', color: colors.warning };
      case 'INFO':
        return { icon: 'information-circle', color: colors.info };
      default:
        return { icon: 'notifications', color: colors.textSecondary };
    }
  };

  const { icon, color } = getIconAndColor(level);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      if (diffInMinutes < 1) return '방금 전';
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit' 
      });
    }
  };

  const handlePress = () => {
    setIsExpanded(!isExpanded);
    onPress?.();
  };

  const itemBackgroundColor = item.isRead ? colors.background : colors.card;

  return (
    <View style={[styles.card, { backgroundColor: itemBackgroundColor, borderColor: colors.border }]}>
      <Pressable
        style={styles.pressable}
        onPress={handlePress}
        android_ripple={{ color: colors.border }}
      >
        <View style={styles.contentContainer}>
          <Ionicons name={icon as any} size={22} color={color} style={styles.icon} />
          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <Text style={[styles.alertTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {appName}
              </Text>
              <Text style={[styles.timeText, { color: colors.text }]}>
                {formatTime(item.timestamp)}
              </Text>
            </View>
            <Text 
              style={[styles.alertMessage, { color: colors.text }]} 
              numberOfLines={isExpanded ? undefined : 2}
            >
              {item.message}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  pressable: {
    padding: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  alertMessage: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
}); 