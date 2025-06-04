import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';

// Mock data for demonstration
const mockIssues = [
  {
    id: '1',
    title: 'API Response Time Degradation',
    status: 'open',
    priority: 'high',
    createdAt: '2024-06-03T10:00:00Z',
    description: 'API response times have increased significantly in the last hour',
  },
  {
    id: '2',
    title: 'Database Connection Pool Exhausted',
    status: 'in-progress',
    priority: 'critical',
    createdAt: '2024-06-03T09:30:00Z',
    description: 'All database connections are being used',
  },
  {
    id: '3',
    title: 'Memory Usage Alert',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2024-06-03T08:15:00Z',
    description: 'Memory usage exceeded 80% threshold',
  },
];

export default function IssuesListScreen() {
  const { isDark, colors } = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return colors.critical;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.tint2;
      default:
        return colors.success;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return colors.primary;
      case 'in-progress':
        return colors.warning;
      case 'resolved':
        return colors.success;
      default:
        return colors.textMuted;
    }
  };

  const renderIssueItem = ({ item }: { item: typeof mockIssues[0] }) => (
    <TouchableOpacity
      style={[
        styles.issueCard,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => {
        console.log('Issue pressed:', item.id);
      }}
    >
      <View style={styles.issueHeader}>
        <Text style={[styles.issueTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        >
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Issues
        </Text>
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
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