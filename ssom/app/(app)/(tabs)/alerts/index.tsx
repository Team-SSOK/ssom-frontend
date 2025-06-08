import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useEffect } from 'react';
import { useAlertStream } from '@/modules/alerts/hooks/useAlertStream';
import { AlertEntry, Alert } from '@/modules/alerts/types';
import AlertHeader from '@/modules/alerts/components/AlertHeader';
import AlertList from '@/modules/alerts/components/AlertList';

export default function AlertsScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  
  const { 
    alerts, 
    loadAlerts, 
    markAsRead, 
    isLoading, 
    error 
  } = useAlertStream();

  // 화면 진입 시 알림 목록 로드
  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      toast.error('알림 오류', error);
    }
  }, [error, toast]);

  // API 데이터를 UI 컴포넌트에서 사용할 수 있는 형태로 변환
  const transformedAlerts: Alert[] = alerts.map(alert => ({
    id: alert.id,
    title: alert.title,
    message: alert.message,
    timestamp: alert.timestamp,
    kind: alert.kind,
    isRead: alert.isRead,
    actionRequired: !alert.isRead, // 읽지 않은 알림은 액션이 필요한 것으로 간주
  }));

  // 알림 클릭 시 읽음 처리
  const handleAlertPress = async (alertId: string) => {

    
    const alert = alerts.find(a => a.id === alertId);
    console.log('🔍 Alert 클릭:', {
      alertId,
      alert: alert ? {
        id: alert.id,
        alertId: alert.alertId,
        alertStatusId: alert.alertStatusId,
        isRead: alert.isRead,
        title: alert.title
      } : 'Not found'
    });
    if (alert && !alert.isRead) {
      try {
        await markAsRead(alert.alertStatusId);
      } catch (error) {
        if (__DEV__) console.error('읽음 처리 실패:', error);
        toast.error('읽음 처리 실패', '알림을 읽음으로 처리하는데 실패했습니다.');
      }
    }
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading && alerts.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <AlertHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            알림을 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <AlertHeader />
      <AlertList 
        alerts={transformedAlerts} 
        onAlertPress={handleAlertPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
}); 