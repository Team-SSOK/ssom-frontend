import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { UserProfile } from '@/modules/auth/stores/authStore';

interface UserDetailsCardProps {
  userInfo: UserProfile;
}

export default function UserDetailsCard({ userInfo }: UserDetailsCardProps) {
  const { colors } = useTheme();

  if (!userInfo.phoneNumber && !userInfo.githubId) {
    return null;
  }

  return (
    <View style={[styles.detailsCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        상세 정보
      </Text>
      
      {userInfo.phoneNumber && (
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            연락처
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {userInfo.phoneNumber}
          </Text>
        </View>
      )}
      
      {userInfo.githubId && (
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            GitHub ID
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {userInfo.githubId}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  detailsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 