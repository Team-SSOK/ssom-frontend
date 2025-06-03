import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { FAB, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [fabOpen, setFabOpen] = useState(false);

  const onFabStateChange = ({ open }: { open: boolean }) => setFabOpen(open);

  const fabActions = [
    {
      icon: 'home',
      label: 'Dashboard',
      onPress: () => router.push('/(app)/(tabs)'),
    },
    {
      icon: 'alert',
      label: 'Alerts',
      onPress: () => router.push('/(app)/(tabs)/alerts'),
    },
    {
      icon: 'file-document-outline',
      label: 'Logs',
      onPress: () => router.push('/(app)/(tabs)/logs'),
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="issues/index" />
        <Stack.Screen name="logs/index" />
        <Stack.Screen name="alerts/index" />
      </Stack>
      
      <Portal>
        <FAB.Group
          open={fabOpen}
          visible={true}
          icon={fabOpen ? 'close' : 'menu'}
          actions={fabActions}
          onStateChange={onFabStateChange}
          style={styles.fab}
          fabStyle={[styles.fabButton, { backgroundColor: '#007AFF' }]}
          backdropColor='transparent'
        />
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    zIndex: 1000,
  },
  fabButton: {
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
