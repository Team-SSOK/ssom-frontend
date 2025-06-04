import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

// Mock data for demonstration
const mockIssues = [
  {
    id: '1',
    title: 'API Response Time Degradation',
    status: 'Critical',
    createdAt: '2024-06-03T10:00:00Z',
    description: 'API response times have increased significantly in the last hour',
  },
  {
    id: '2',
    title: 'Database Connection Pool Exhausted',
    status: 'Warning',
    createdAt: '2024-06-03T09:30:00Z',
    description: 'All database connections are being used',
  },
  {
    id: '3',
    title: 'Memory Usage Alert',
    status: 'Critical',
    createdAt: '2024-06-03T08:15:00Z',
    description: 'Memory usage exceeded 80% threshold',
  },
  {
    id: '4',
    title: 'SSL Certificate Expiring Soon',
    status: 'Resolved',
    createdAt: '2024-06-03T07:00:00Z',
    description: 'SSL certificate expires in 7 days',
  },
];

export default function MainDashboard() {
  const { isDark, colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical':
        return colors.critical;
      case 'Warning':
        return colors.warning;
      case 'Resolved':
        return colors.success;
      default:
        return colors.textMuted;
    }
  };

  const renderIssueItem = ({ item }: { item: typeof mockIssues[0] }) => (
    <Pressable
      style={[
        styles.issueCard,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => router.push(`/(app)/issues/${item.id}`)}
    >
      <View style={styles.issueHeader}>
        <Text style={[styles.issueTitle, { color: colors.text }]}>
          {item.title}
        </Text>
      </View>
      <Text style={[styles.issueDescription, { color: colors.textSecondary }]}>
        {item.description}
      </Text>
      <View style={styles.issueFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={[styles.createdAt, { color: colors.textMuted }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          SSOM
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          System Service Operations Monitoring
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.critical }]}>{mockIssues.filter(issue => issue.status === 'Critical').length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Critical</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>{mockIssues.filter(issue => issue.status === 'Warning').length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>High</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{mockIssues.filter(issue => issue.status === 'Resolved').length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolved</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          최근 이슈
        </Text>
        <Pressable onPress={() => console.log('View All')}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            View All
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={mockIssues}
        renderItem={renderIssueItem}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  issueCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  issueDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  createdAt: {
    fontSize: 12,
  },
});
