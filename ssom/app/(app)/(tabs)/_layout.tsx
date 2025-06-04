import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { FAB, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const [fabOpen, setFabOpen] = useState(false);

  const fabActions = [
    {
      icon: 'alpha-i',
      onPress: () => router.push('/(app)/(tabs)'),
      style:  styles.fabActions ,
    },
    {
      icon: 'alert',
      onPress: () => router.push('/(app)/(tabs)/alerts'),
      style: styles.fabActions,
    },
    {
      icon: 'math-log',
      onPress: () => router.push('/(app)/(tabs)/logs'),
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
