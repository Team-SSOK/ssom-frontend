import React, { useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components';
import { useAlertStore } from '@/modules/alerts/stores/alertStore';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/modules/auth/stores/authStore';

export default function DashboardHeader() {
  const { colors } = useTheme();
  const animationRef = useRef<LottieView>(null);
  
  // SSE 연결은 _layout.tsx에서 관리하므로, 여기서는 스토어만 사용
  const { alerts } = useAlertStore();
  const userName = useAuthStore(state => state.user?.username);
  
  // 읽지 않은 모든 알림 개수 카운트
  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const notificationCount = unreadAlerts.length;
  const hasNotifications = notificationCount > 0;

  const router = useRouter();

  const handleAlertPress = () => {
    animationRef.current?.play();
    router.push('/(app)/(tabs)/alerts');
  };

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.content}>
        <View style={styles.leftSpacer} />
                 <Text variant="h5" weight="semiBold" style={styles.title}>
           안녕하세요, {userName}님
         </Text>
        <Pressable 
          style={styles.rightSection}
          onPress={handleAlertPress}
        >
          <LottieView
            ref={animationRef}
            source={require('@/assets/lottie/alert.json')}
            style={styles.alertAnimation}
            loop={false}            
          />
          {hasNotifications && (
            <View style={[styles.notificationBadge, { backgroundColor: colors.warning }]}>
                             {notificationCount > 0 && notificationCount < 10 && (
                 <Text weight="bold" style={styles.badgeText}>{notificationCount}</Text>
               )}
               {notificationCount >= 10 && (
                 <Text weight="bold" style={styles.badgeText}>9+</Text>
               )}
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSpacer: {
    width: 40,
  },
     title: {
     flex: 1,
     textAlign: 'center',
   },
  rightSection: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  alertAnimation: {
    width: 32,
    height: 32,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
     badgeText: {
     color: 'white',
     fontSize: 10,
   },
}); 