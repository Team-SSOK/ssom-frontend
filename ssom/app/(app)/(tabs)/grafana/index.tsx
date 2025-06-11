import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import GrafanaWebView from '@/modules/grafana/components/GrafanaWebView';

export default function GrafanaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <GrafanaWebView style={styles.webView} theme="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webView: {
    flex: 1,
  },
}); 