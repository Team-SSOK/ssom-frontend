import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

interface LogDetailHeaderProps {
  logData?: {
    logId: string;
    level: string;
    message: string;
    app: string;
  };
}

export default function LogDetailHeader({ logData }: LogDetailHeaderProps) {
  const { colors } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const handlePlusPress = () => {
    if (logData) {
      router.push({
        pathname: '/issues/create',
        params: {
          fromLog: 'true',
          logId: logData.logId,
          logMessage: logData.message,
          logLevel: logData.level,
          logApp: logData.app,
        },
      });
    } else {
      router.push('/issues/create');
    }
  };

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.headerContent}>
        <Pressable 
          style={styles.iconButton} 
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        
        <Text style={[styles.title, { color: colors.text }]}>
          로그 상세정보
        </Text>
        
        <Pressable 
          style={styles.iconButton} 
          onPress={handlePlusPress}
        >
          <AntDesign name="plus" size={24} color={colors.text} />
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
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
}); 