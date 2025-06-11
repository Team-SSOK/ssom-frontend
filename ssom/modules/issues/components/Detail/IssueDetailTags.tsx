import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';

interface IssueDetailTagsProps {
  logIds: string[];
}

export default function IssueDetailTags({ logIds }: IssueDetailTagsProps) {
  const { colors } = useTheme();

  const handleLogClick = (logId: string) => {
    router.push(`/(app)/(tabs)/loggings/${logId}?fromIssue=true`);
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        연관 로그
      </Text>
      <View style={styles.tagsContainer}>
        {logIds.map((logId, index) => (
          <Pressable
            key={index}
            style={[
              styles.tag,
              { backgroundColor: colors.border },
            ]}
            onPress={() => handleLogClick(logId)}
          >
            <Text style={[styles.tagText, { color: colors.text }]}>
              Log #{logId}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
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
}); 