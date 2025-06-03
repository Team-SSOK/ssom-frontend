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
  const { isDark } = useTheme();

  const renderIssueItem = ({ item }: { item: typeof mockIssues[0] }) => (
    <TouchableOpacity
      style={[
        styles.issueCard,
        { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' },
      ]}
      onPress={() => {
        console.log('Issue pressed:', item.id);
      }}
    >
      <View style={styles.issueHeader}>
        <Text style={[styles.issueTitle, { color: isDark ? '#fff' : '#000' }]}>
          {item.title}
        </Text>
        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor:
                item.priority === 'critical'
                  ? '#FF3B30'
                  : item.priority === 'high'
                  ? '#FF9500'
                  : item.priority === 'medium'
                  ? '#FFCC00'
                  : '#34C759',
            },
          ]}
        >
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      <Text style={[styles.issueDescription, { color: isDark ? '#ccc' : '#666' }]}>
        {item.description}
      </Text>
      <View style={styles.issueFooter}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'open'
                  ? '#007AFF'
                  : item.status === 'in-progress'
                  ? '#FF9500'
                  : '#34C759',
            },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={[styles.createdAt, { color: isDark ? '#888' : '#999' }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
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
    borderBottomColor: '#eee',
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
    borderColor: '#eee',
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