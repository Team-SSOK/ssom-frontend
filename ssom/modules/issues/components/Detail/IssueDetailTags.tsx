import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface IssueDetailTagsProps {
  logIds: string[];
}

export default function IssueDetailTags({ logIds }: IssueDetailTagsProps) {
  const { colors } = useTheme();

  const handleLogClick = (logId: string) => {
    router.push(`/(app)/(tabs)/loggings/${logId}?fromIssue=true`);
  };

  if (!logIds || logIds.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        연관 로그
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tagsContainer}>
          {logIds.map((logId) => (
            <Pressable
              key={logId}
              style={({ pressed }) => [
                styles.tag,
                { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                pressed && { backgroundColor: colors.border }
              ]}
              onPress={() => handleLogClick(logId)}
            >
              <Ionicons name="bug-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.tagText, { color: colors.text, marginLeft: 6 }]}>
                Log #{logId}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 