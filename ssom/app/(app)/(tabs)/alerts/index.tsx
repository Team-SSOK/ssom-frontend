import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

// Mock alert data
const mockAlerts = [
  {
    id: '1',
    title: 'High CPU Usage Detected',
    message: 'Server CPU usage has exceeded 85% for the past 5 minutes',
    severity: 'critical',
    timestamp: '2024-06-03T10:45:00Z',
    source: 'monitoring-system',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '2',
    title: 'Database Connection Pool Warning',
    message: 'Database connection pool is 90% full',
    severity: 'warning',
    timestamp: '2024-06-03T10:30:00Z',
    source: 'database-monitor',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '3',
    title: 'Backup Completed Successfully',
    message: 'Daily backup process completed without errors',
    severity: 'info',
    timestamp: '2024-06-03T09:00:00Z',
    source: 'backup-service',
    isRead: true,
    actionRequired: false,
  },
  {
    id: '4',
    title: 'SSL Certificate Expiring Soon',
    message: 'SSL certificate for api.example.com expires in 7 days',
    severity: 'warning',
    timestamp: '2024-06-03T08:00:00Z',
    source: 'ssl-monitor',
    isRead: true,
    actionRequired: true,
  },
  {
    id: '5',
    title: 'Memory Usage Normal',
    message: 'Memory usage has returned to normal levels',
    severity: 'success',
    timestamp: '2024-06-03T07:30:00Z',
    source: 'memory-monitor',
    isRead: true,
    actionRequired: false,
  },
];

export default function AlertsScreen() {
  const { isDark } = useTheme();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#FF3B30';
      case 'warning': return '#FF9500';
      case 'info': return '#007AFF';
      case 'success': return '#34C759';
      default: return '#007AFF';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return 'alert-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      case 'success': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  const renderAlertItem = ({ item }: { item: typeof mockAlerts[0] }) => (
    <TouchableOpacity
      style={[
        styles.alertCard,
        { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' },
        !item.isRead && styles.unreadCard,
      ]}
    >
      <View style={styles.alertHeader}>
        <View style={styles.leftSection}>
          <Ionicons
            name={getSeverityIcon(item.severity) as any}
            size={24}
            color={getSeverityColor(item.severity)}
            style={styles.severityIcon}
          />
          <View style={styles.alertInfo}>
            <Text style={[styles.alertTitle, { color: isDark ? '#fff' : '#000' }]}>
              {item.title}
            </Text>
            <Text style={[styles.alertSource, { color: isDark ? '#888' : '#999' }]}>
              {item.source}
            </Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={[styles.timestamp, { color: isDark ? '#888' : '#999' }]}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      </View>

      <Text style={[styles.alertMessage, { color: isDark ? '#ccc' : '#666' }]}>
        {item.message}
      </Text>

      <View style={styles.alertFooter}>
        <View
          style={[
            styles.severityBadge,
            { backgroundColor: getSeverityColor(item.severity) },
          ]}
        >
          <Text style={styles.severityText}>{item.severity}</Text>
        </View>
        
        {item.actionRequired && (
          <View style={styles.actionBadge}>
            <Ionicons name="flash" size={12} color="#FF9500" />
            <Text style={[styles.actionText, { color: '#FF9500' }]}>
              Action Required
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const unreadCount = mockAlerts.filter(alert => !alert.isRead).length;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          Alerts
        </Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={16} color={isDark ? '#fff' : '#000'} />
          <Text style={[styles.filterText, { color: isDark ? '#fff' : '#000' }]}>
            Filter
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={16} color={isDark ? '#fff' : '#000'} />
          <Text style={[styles.sortText, { color: isDark ? '#fff' : '#000' }]}>
            Sort
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockAlerts}
        renderItem={renderAlertItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  alertCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  severityIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertSource: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 