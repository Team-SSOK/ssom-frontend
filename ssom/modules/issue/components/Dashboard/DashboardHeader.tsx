import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import LottieView from 'lottie-react-native';

export default function DashboardHeader() {
  const { colors } = useTheme();
  const animationRef = useRef<LottieView>(null);
  // Mock state for notification count - replace with real data
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleAlertPress = () => {
    animationRef.current?.play();
    console.log("알림 아이콘이 터치되었습니다");
  };

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.content}>
        <View style={styles.leftSpacer} />
        <Text style={[styles.title, { color: colors.text }]}>
          이슈 관리
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
                <Text style={styles.badgeText}>{notificationCount}</Text>
              )}
              {notificationCount >= 10 && (
                <Text style={styles.badgeText}>9+</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
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
    shadowColor: 'black',
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
    fontWeight: 'bold',
  },
}); 