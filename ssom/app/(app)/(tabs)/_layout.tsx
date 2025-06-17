import React, { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { useTheme } from '@/hooks/useTheme';
import { FabProvider } from '@/contexts/FabContext';
import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import DrawerProfile from '../../../modules/auth/components/Profile/DrawerProfile';
import { useAuthStore } from '@/modules/auth/stores/authStore';

function CustomDrawerContent(props: any) {
  const { colors } = useTheme();

  return (
    <View style={[styles.drawerContainer, { backgroundColor: colors.card }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>SSOM</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            System Monitor
          </Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileWrapper}>
          <DrawerProfile />
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={[styles.menuTitle, { color: colors.textSecondary }]}>
            NAVIGATION
          </Text>
          <View style={styles.menuItems}>
            <DrawerItemList {...props} />
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

function CustomDrawerLayout() {
  const { colors } = useTheme();
  const { getProfile } = useAuthStore();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <Drawer
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: 'transparent',
          width: 320,
          shadowColor: '#000',
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
          marginLeft: -8,
        },
        drawerActiveBackgroundColor: `${colors.primary}15`,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerItemStyle: {
          marginHorizontal: 0,
          marginVertical: 2,
          borderRadius: 12,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: '대시보드',
          drawerIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="issues"
        options={{
          drawerLabel: '이슈 관리',
          drawerIcon: ({ size, color }) => (
            <Octicons name="issue-opened" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="loggings"
        options={{
          drawerLabel: '로그 조회',
          drawerIcon: ({ size, color }) => (
            <Octicons name="log" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="alerts"
        options={{
          drawerLabel: '알림',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="grafana"
        options={{
          drawerLabel: 'Grafana',
          drawerIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="chart-line" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen name="profile" options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}

export default function TabLayout() {
  return (
    <FabProvider>
      <CustomDrawerLayout />
    </FabProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  profileWrapper: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 16,
  },
  menuItems: {
    gap: 4,
  },
}); 