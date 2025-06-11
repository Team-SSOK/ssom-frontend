import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LogDetailBasicInfoProps {
  level: string;
  timestamp: string;
  app: string;
  message: string;
}

export default function LogDetailBasicInfo({ level, timestamp, app, message }: LogDetailBasicInfoProps) {
  const { colors } = useTheme();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': 
        return colors.critical;
      case 'WARN': 
        return colors.warning;
      default: 
        return colors.primary;
    }
  };

  return (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <View style={styles.levelRow}>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: getLevelColor(level) },
          ]}
        >
          <Text style={styles.levelText}>{level}</Text>
        </View>
        <Text style={[styles.timestamp, { color: colors.textMuted }]}>
          {new Date(timestamp).toLocaleString()}
        </Text>
      </View>
      
      <Text style={[styles.appName, { color: colors.primary }]}>
        {app}
      </Text>
      
      <Text style={[styles.message, { color: colors.text }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500',
  },
}); 