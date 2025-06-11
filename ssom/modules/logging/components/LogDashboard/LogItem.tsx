import React, { useRef, useEffect } from 'react';
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

export default function LogItem({ 
  item, 
  isMultiSelectMode = false,
  isSelected = false,
  onSelect,
  onLongPress
}: LogItemProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const itemScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: isSelected ? 1.2 : 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelected, scaleAnim]);

  useEffect(() => {
    Animated.timing(itemScaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isSelected, itemScaleAnim]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return colors.critical;
      case 'WARN':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const handlePress = () => {
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
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(item.logId);
    }
  };

  // Press 시작 시 즉각적인 애니메이션
  const handlePressIn = () => {
    Animated.timing(itemScaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  // Press 끝날 때 원래 크기로 복귀
  const handlePressOut = () => {
    Animated.timing(itemScaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleCheckboxChange = () => {
    if (onSelect) {
      onSelect(item.logId);
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: itemScaleAnim }]
        }
      ]}
    >
      <Pressable
        style={[
          styles.logCard,
          { 
            backgroundColor: colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.logContent}>
          {isMultiSelectMode && (
            <View style={styles.checkboxContainer}>
              <Animated.View 
                style={[
                  styles.animatedCheckbox,
                  {
                    transform: [{ scale: scaleAnim }]
                  }
                ]}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={isSelected}
                  onValueChange={handleCheckboxChange}
                  color={isSelected ? colors.primary : undefined}
                />
              </Animated.View>
            </View>
          )}
          
          <View style={styles.logInfo}>
            <View style={styles.logHeader}>
              <View style={styles.logHeaderInfo}>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
                  <Text style={styles.levelText}>{item.level}</Text>
                </View>
                <Text style={[styles.serviceName, { color: colors.textSecondary }]}>
                  {item.app}
                </Text>
              </View>
              <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                {new Date(item.timestamp).toLocaleTimeString()}
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
}

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
  animatedCheckbox: {
    alignItems: 'center',
    justifyContent: 'center',
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