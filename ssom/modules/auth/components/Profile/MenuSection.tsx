import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface MenuItem {
  icon: string;
  title: string;
  onPress: () => void;
  showArrow: boolean;
}

interface MenuSectionProps {
  onAlert: (title: string, message?: string, buttons?: Array<{
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }>) => void;
}

export default function MenuSection({ onAlert }: MenuSectionProps) {
  const { colors } = useTheme();

  const handleChangePassword = () => {
    router.push('/pw-change');
  };

  const menuItems: MenuItem[] = [
    {
      icon: 'key-outline',
      title: '비밀번호 변경',
      onPress: handleChangePassword,
      showArrow: true,
    },
    {
      icon: 'notifications-outline',
      title: '알림 설정',
      onPress: () => {
        onAlert('알림', '준비 중인 기능입니다.');
      },
      showArrow: true,
    },
    {
      icon: 'help-circle-outline',
      title: '도움말',
      onPress: () => {
        onAlert('도움말', 'SSOM v1.0.0\n\n문의사항은 platform-team@ssok.kr로 연락해주세요.');
      },
      showArrow: true,
    },
  ];

  return (
    <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        설정
      </Text>
      
      {menuItems.map((item, index) => (
        <Pressable
          key={index}
          style={[
            styles.menuItem,
            { borderBottomColor: colors.border },
            index === menuItems.length - 1 && styles.lastMenuItem,
          ]}
          onPress={item.onPress}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={colors.textSecondary}
            />
            <Text style={[styles.menuItemText, { color: colors.text }]}>
              {item.title}
            </Text>
          </View>
          {item.showArrow && (
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textSecondary}
            />
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
}); 