import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AlertHeader from '@/modules/alerts/components/AlertHeader';
import AlertList from '@/modules/alerts/components/AlertList';

// Mock data based on backend API format from the image
const mockAlerts = [
  {
    id: '1',
    title: '[ERROR] ssok-gateway-service',
    message: 'Authentication error: Authorization header is missing or invalid',
    timestamp: '2024-06-03T10:45:23.123Z',
    kind: 'AUTHENTICATION_ERROR',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '2',
    title: '[WARNING] ssok-user-service',
    message: 'User account locked: Maximum login attempts exceeded',
    timestamp: '2024-06-03T10:30:15.456Z',
    kind: 'ACCOUNT_SECURITY',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '3',
    title: '[ERROR] ssok-database-service',
    message: 'Database connection pool exhausted: All 50 connections in use',
    timestamp: '2024-06-03T10:15:07.789Z',
    kind: 'DATABASE_ERROR',
    isRead: true,
    actionRequired: false,
  },
  {
    id: '4',
    title: '[WARNING] ssok-api-service',
    message: 'High system memory usage: Currently at 87% utilization',
    timestamp: '2024-06-03T10:00:01.234Z',
    kind: 'RESOURCE_WARNING',
    isRead: false,
    actionRequired: false,
  },
  {
    id: '5',
    title: '[ERROR] ssok-payment-service',
    message: 'Payment processing failed: External payment gateway timeout',
    timestamp: '2024-06-03T09:45:33.567Z',
    kind: 'PAYMENT_ERROR',
    isRead: true,
    actionRequired: true,
  },
  {
    id: '6',
    title: '[INFO] ssok-bank',
    message: 'Daily backup completed successfully',
    timestamp: '2024-06-03T09:30:00.000Z',
    kind: 'BACKUP_SUCCESS',
    isRead: true,
    actionRequired: false,
  },
];

export default function AlertsScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <AlertHeader />
      <AlertList alerts={mockAlerts} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 