import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

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

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return colors.critical;
      case 'WARN':
        return colors.warning;
      case 'INFO':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const handlePress = () => {
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={[
        styles.alertCard,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: item.isRead ? 0.4 : 1,
        },
      ]}
      onPress={handlePress}
    >
      <View style={styles.alertHeader}>
        <View style={styles.titleSection}>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(level) }]}>
            <Text style={styles.levelText}>{level}</Text>
          </View>
          <Text style={[styles.appName, { color: colors.textSecondary }]}>
            {appName}
          </Text>
        </View>
        <View style={styles.badges}>
          {!item.isRead && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadText}>New</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={[styles.alertMessage, { color: colors.text }]}>
        {item.message}
      </Text>
      
      <View style={styles.alertFooter}>
        <Text style={[styles.timestamp, { color: colors.textMuted }]}>
          {new Date(item.timestamp).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  alertCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  unreadBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  actionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
  },
}); 