import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { Colors } from '@/constants/Colors';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' | 'cooldown';

interface ConnectionStatusProps {
  status: ConnectionState;
  message: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  message,
  onRetry,
  showRetryButton = false,
}) => {
  const colors = Colors.light;
  
  const getStatusConfig = (status: ConnectionState) => {
    switch (status) {
      case 'connected':
        return {
          icon: '🟢',
          color: colors.success,
          text: '연결됨',
        };
      case 'connecting':
        return {
          icon: '🟡',
          color: colors.warning,
          text: '연결 중...',
        };
      case 'reconnecting':
        return {
          icon: '🔄',
          color: colors.warning,
          text: '재연결 중...',
        };
      case 'error':
        return {
          icon: '🔴',
          color: colors.error,
          text: '연결 오류',
        };
      case 'cooldown':
        return {
          icon: '❄️',
          color: colors.secondary,
          text: '대기 중...',
        };
      case 'disconnected':
      default:
        return {
          icon: '⚫',
          color: colors.textSecondary,
          bgColor: colors.textSecondary + '15',
          text: '연결 안됨',
        };
    }
  };

  const config = getStatusConfig(status);

  if(status === 'connected') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusInfo}>
        <Text style={styles.icon}>{config.icon}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.statusText, { color: config.color }]}>
            {config.text}
          </Text>
          {message && message !== config.text && (
            <Text style={styles.messageText}>{message}</Text>
          )}
        </View>
      </View>
      
      {showRetryButton && status !== 'connecting' && onRetry && (
        <Pressable 
          style={[styles.retryButton, { borderColor: config.color }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: config.color }]}>
            재연결
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 12,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 