import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Text } from '@/components';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Checkbox from 'expo-checkbox';

interface LogData {
  logId: string;
  timestamp: string;
  level: string;
  logger: string;
  thread: string;
  message: string;
  app: string;
}

interface LogItemProps {
  item: LogData;
  isMultiSelectMode?: boolean;
  isSelected?: boolean;
  onSelect?: (logId: string) => void;
  onLongPress?: (logId: string) => void;
}

const LogItem = React.memo(function LogItem({ 
  item, 
  isMultiSelectMode = false,
  isSelected = false,
  onSelect,
  onLongPress
}: LogItemProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 선택 상태가 변경될 때만 간단한 애니메이션 실행
  useEffect(() => {
    if (isMultiSelectMode) {
      Animated.timing(scaleAnim, {
        toValue: isSelected ? 1.02 : 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected, isMultiSelectMode, scaleAnim]);

  // 레벨 색상 메모화
  const levelColor = useMemo(() => {
    switch (item.level) {
      case 'ERROR':
        return colors.critical;
      case 'WARN':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  }, [item.level, colors]);

  // 시간 포맷 메모화
  const formattedTime = useMemo(() => {
    return new Date(item.timestamp).toLocaleTimeString();
  }, [item.timestamp]);

  // 스타일 메모화
  const cardStyle = useMemo(() => [
    styles.logCard,
    { 
      backgroundColor: colors.card,
      borderColor: isSelected ? colors.primary : colors.border,
      borderWidth: isSelected ? 2 : 1,
    },
  ], [colors.card, colors.primary, colors.border, isSelected]);

  const levelBadgeStyle = useMemo(() => [
    styles.levelBadge, 
    { backgroundColor: levelColor }
  ], [levelColor]);

  const handlePress = useCallback(() => {
    if (isMultiSelectMode && onSelect) {
      onSelect(item.logId);
    } else {
      router.push({
        pathname: "/loggings/[id]" as any,
        params: {
          id: item.logId,
          logId: item.logId,
          timestamp: item.timestamp,
          level: item.level,
          logger: item.logger,
          thread: item.thread,
          message: item.message,
          app: item.app,
        }
      });
    }
  }, [isMultiSelectMode, onSelect, item]);

  const handleLongPress = useCallback(() => {
    if (onLongPress) {
      onLongPress(item.logId);
    }
  }, [onLongPress, item.logId]);

  const handleCheckboxChange = useCallback(() => {
    if (onSelect) {
      onSelect(item.logId);
    }
  }, [onSelect, item.logId]);

  const containerStyle = useMemo(() => ({
    transform: [{ scale: scaleAnim }]
  }), [scaleAnim]);

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        style={cardStyle}
        onPress={handlePress}
        onLongPress={handleLongPress}
      >
        <View style={styles.logContent}>
          {isMultiSelectMode && (
            <View style={styles.checkboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={isSelected}
                onValueChange={handleCheckboxChange}
                color={isSelected ? colors.primary : undefined}
              />
            </View>
          )}
          
          <View style={styles.logInfo}>
            <View style={styles.logHeader}>
              <View style={styles.logHeaderInfo}>
                <View style={levelBadgeStyle}>
                  <Text style={styles.levelText}>{item.level}</Text>
                </View>
                <Text style={[styles.serviceName, { color: colors.textSecondary }]}>
                  {item.app}
                </Text>
              </View>
              <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                {formattedTime}
              </Text>
            </View>
            
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.logMessage, { color: colors.text }]}>
              {item.message}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default LogItem;

const styles = StyleSheet.create({
  logCard: {
    borderRadius: 12,
    marginBottom: 12,
  },
  logContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  logInfo: {
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  serviceName: {
    fontSize: 12,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
  },
  logMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  logDetails: {
    fontSize: 12,
    lineHeight: 16,
  },
  logThread: {
    fontSize: 12,
    lineHeight: 16,
  },
}); 