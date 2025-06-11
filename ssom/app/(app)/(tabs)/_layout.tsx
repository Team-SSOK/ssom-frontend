import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { FAB, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Octicons, MaterialIcons } from '@expo/vector-icons';
import { FabProvider, useFab } from '@/contexts/FabContext';

function TabLayoutInner() {
  const { isDark, colors } = useTheme();
  const { fabVisible } = useFab();
  const router = useRouter();
  const [fabOpen, setFabOpen] = useState(false);

  const fabActions = [
    {
      icon: ({ size, color }: { size: number; color: string }) => (
        <MaterialIcons name="space-dashboard" size={24} color="black" />
      ),
      onPress: () => router.push('/(app)/(tabs)'),
      style: styles.fabActions,
    },
    {
      icon: 'monitor-dashboard',
      onPress: () => router.push('/(app)/(tabs)/grafana'),
      style: styles.fabActions,
    },
    {
      icon: ({ size, color }: { size: number; color: string }) => (
        <Octicons name="issue-opened" size={size} color={color} />
      ),
      onPress: () => router.push('/(app)/(tabs)/issues/'),
      style: styles.fabActions,
    },
    {
      icon: ({ size, color }: { size: number; color: string }) => (
        <Octicons name="log" size={size} color={color} />
      ),
      onPress: () => router.push('/(app)/(tabs)/loggings'),
      style: styles.fabActions,
    },
    {
      icon: 'account',
      onPress: () => router.push('/(app)/(tabs)/profile'),
      style: styles.fabActions,
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="issues" options={{ headerShown: false }} />
        <Stack.Screen name="loggings" options={{ headerShown: false }} />
        <Stack.Screen name="alerts" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
      
      <Portal>
        <FAB.Group
          open={fabOpen}
          visible={fabVisible}
          icon={fabOpen ? 'close' : 'menu'}
          actions={fabActions}
          onStateChange={() => { setFabOpen(!fabOpen) }}
          style={styles.fab}
          fabStyle={[styles.fabButton, { backgroundColor: colors.primary }]}
          color='white'
          backdropColor='transparent'
        />
      </Portal>
    </>
  );
}

export default function TabLayout() {
  return (
    <FabProvider>
      <TabLayoutInner />
    </FabProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fabActions: {
    padding: 3,
    backgroundColor: 'white',
  },
  fabButton: {
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
});
