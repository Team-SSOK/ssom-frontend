import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function IssueDetailScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock issue data - in real app, this would be fetched based on id
  const issue = {
    id: id,
    title: 'API Response Time Degradation',
    status: 'open',
    priority: 'high',
    createdAt: '2024-06-03T10:00:00Z',
    updatedAt: '2024-06-03T11:30:00Z',
    description: 'API response times have increased significantly in the last hour. This is affecting user experience and needs immediate attention.',
    assignee: 'John Doe',
    reporter: 'System Monitor',
    tags: ['performance', 'api', 'critical'],
    comments: [
      {
        id: '1',
        author: 'John Doe',
        content: 'Investigating the issue. Checking database performance.',
        timestamp: '2024-06-03T10:30:00Z',
      },
      {
        id: '2',
        author: 'System Monitor',
        content: 'Response time threshold exceeded 5 seconds average.',
        timestamp: '2024-06-03T10:15:00Z',
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#007AFF';
      case 'in-progress': return '#FF9500';
      case 'resolved': return '#34C759';
      default: return '#007AFF';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#FF3B30';
      case 'high': return '#FF9500';
      case 'medium': return '#FFCC00';
      case 'low': return '#34C759';
      default: return '#34C759';
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? '#fff' : '#000'} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          Issue #{issue.id}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
            {issue.title}
          </Text>
          
          <View style={styles.metadataRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(issue.status) },
              ]}
            >
              <Text style={styles.badgeText}>{issue.status}</Text>
            </View>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(issue.priority) },
              ]}
            >
              <Text style={styles.badgeText}>{issue.priority}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: isDark ? '#ccc' : '#666' }]}>
            {issue.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Details
          </Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? '#888' : '#999' }]}>
                Assignee:
              </Text>
              <Text style={[styles.detailValue, { color: isDark ? '#fff' : '#000' }]}>
                {issue.assignee}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? '#888' : '#999' }]}>
                Reporter:
              </Text>
              <Text style={[styles.detailValue, { color: isDark ? '#fff' : '#000' }]}>
                {issue.reporter}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? '#888' : '#999' }]}>
                Created:
              </Text>
              <Text style={[styles.detailValue, { color: isDark ? '#fff' : '#000' }]}>
                {new Date(issue.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: isDark ? '#888' : '#999' }]}>
                Updated:
              </Text>
              <Text style={[styles.detailValue, { color: isDark ? '#fff' : '#000' }]}>
                {new Date(issue.updatedAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Tags
          </Text>
          <View style={styles.tagsContainer}>
            {issue.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: isDark ? '#333' : '#f0f0f0' },
                ]}
              >
                <Text style={[styles.tagText, { color: isDark ? '#fff' : '#000' }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Comments ({issue.comments.length})
          </Text>
          {issue.comments.map((comment) => (
            <View
              key={comment.id}
              style={[
                styles.commentCard,
                { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' },
              ]}
            >
              <View style={styles.commentHeader}>
                <Text style={[styles.commentAuthor, { color: isDark ? '#fff' : '#000' }]}>
                  {comment.author}
                </Text>
                <Text style={[styles.commentTime, { color: isDark ? '#888' : '#999' }]}>
                  {new Date(comment.timestamp).toLocaleString()}
                </Text>
              </View>
              <Text style={[styles.commentContent, { color: isDark ? '#ccc' : '#666' }]}>
                {comment.content}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 