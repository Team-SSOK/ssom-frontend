import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import IssueDetailHeader from './IssueDetailHeader';

interface IssueDetailLoadingStateProps {
  message?: string;
}

export default function IssueDetailLoadingState({ 
  message = '이슈 정보를 불러오는 중...' 
}: IssueDetailLoadingStateProps) {
  const { colors } = useTheme();

  return (
    <>
      <IssueDetailHeader issueId={0} />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          {message}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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