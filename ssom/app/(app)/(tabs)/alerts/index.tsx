import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

// Mock data for demonstration
const mockAlerts = [
  {
    id: '1',
    title: 'CPU 사용률 높음 경고',
    severity: '긴급',
    timestamp: '2024-06-03T10:00:00Z',
    isRead: false,
    actionRequired: true,
    description: 'CPU 사용률이 5분 이상 90%를 초과했습니다',
  },
  {
    id: '2',
    title: '디스크 공간 부족 경고',
    severity: '경고',
    timestamp: '2024-06-03T09:30:00Z',
    isRead: true,
    actionRequired: false,
    description: 'server-01의 디스크 공간이 부족합니다',
  },
  {
    id: '3',
    title: '서비스 상태 확인 실패',
    severity: '높음',
    timestamp: '2024-06-03T09:00:00Z',
    isRead: false,
    actionRequired: true,
    description: '인증 서비스 상태 확인이 실패했습니다',
  },
];

export default function AlertsScreen() {
  const { isDark, colors } = useTheme();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case '긴급':
        return colors.critical;
      case 'high':
      case '높음':
        return colors.warning;
      case 'warning':
      case '경고':
        return colors.warning;
      default:
        return colors.tint2;
    }
  };

  const renderAlertItem = ({ item }: { item: typeof mockAlerts[0] }) => (
    <TouchableOpacity
      style={[
        styles.alertCard,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: item.isRead ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.alertHeader}>
        <Text style={[styles.alertTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <View style={styles.badges}>
          {!item.isRead && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadText}>새로움</Text>
            </View>
          )}
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(item.severity) },
            ]}
          >
            <Text style={styles.severityText}>{item.severity}</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.alertDescription, { color: colors.textSecondary }]}>
        {item.description}
      </Text>
      <View style={styles.alertFooter}>
        {item.actionRequired && (
          <View style={[styles.actionBadge, { backgroundColor: colors.critical }]}>
            <Text style={styles.actionText}>조치 필요</Text>
          </View>
        )}
        <Text style={[styles.timestamp, { color: colors.textMuted }]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          알림
        </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  alertCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  unreadBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
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
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
  },
}); 