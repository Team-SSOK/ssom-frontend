import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { createDashboardUrl, createGrafanaHeaders, createSimpleDashboardUrl, GRAFANA_CONFIG, ERROR_MESSAGES } from '../config';

interface GrafanaWebViewProps {
  dashboardId?: string;
  orgId?: number;
  timeRange?: {
    from: string;
    to: string;
  };
  variables?: Record<string, string>;
  theme?: 'light' | 'dark';
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
  style?: any;
}

export default function GrafanaWebView({
  dashboardId,
  orgId,
  timeRange = { from: 'now-24h', to: 'now' },
  variables,
  theme,
  onLoadStart,
  onLoadEnd,
  onError,
  style,
}: GrafanaWebViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSimpleUrl, setUseSimpleUrl] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // URL 생성 (문제 발생 시 간단한 URL로 대체)
  const dashboardUrl = useSimpleUrl 
    ? createSimpleDashboardUrl()
    : createDashboardUrl({
        dashboardId,
        orgId,
        from: timeRange.from,
        to: timeRange.to,
        variables,
        theme,
      });

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
    onLoadStart?.();
  };

  const handleLoadEnd = () => {
    setLoading(false);
    onLoadEnd?.();
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setLoading(false);
    
    let errorMessage: string = ERROR_MESSAGES.LOAD_ERROR;
    
    setError(errorMessage);
    onError?.(errorMessage);
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setLoading(false);
    
    let errorMessage = ERROR_MESSAGES.HTTP_ERROR(nativeEvent.statusCode);
    
    // 5xx 서버 에러인 경우
    if (nativeEvent.statusCode >= 500) {
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    }
    
    setError(errorMessage);
    onError?.(errorMessage);
  };

  const handleReload = () => {
    if (webViewRef.current) {
      setError(null);
      webViewRef.current.reload();
    }
  };

  const handleTrySimpleUrl = () => {
    setUseSimpleUrl(true);
    setError(null);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
        {!useSimpleUrl && (
          <TouchableOpacity style={styles.simpleButton} onPress={handleTrySimpleUrl}>
            <Text style={styles.simpleButtonText}>간단 모드</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.helpText}>
        문제가 지속되면 네트워크 연결을 확인하거나 관리자에게 문의하세요.
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>그라파나 대시보드 로딩 중...</Text>
      <Text style={styles.loadingSubText}>
        {useSimpleUrl ? '간단 모드로 로딩 중' : '완전한 대시보드 로딩 중'}
      </Text>
    </View>
  );

  if (error) {
    return renderError();
  }

  return (
    <View style={[styles.container, style]}>
      {loading && renderLoading()}
      <WebView
        ref={webViewRef}
        source={{
          uri: dashboardUrl,
          headers: createGrafanaHeaders(),
        }}
        style={styles.webView}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onHttpError={handleHttpError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        allowsBackForwardNavigationGestures={false}
        originWhitelist={['https://*']}
        onShouldStartLoadWithRequest={(request) => {
          // Grafana 도메인만 허용
          return request.url.startsWith(GRAFANA_CONFIG.BASE_URL);
        }}
        // 성능 최적화
        cacheEnabled={true}
        // 스크롤 설정
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        // 로딩 진행률 체크
        onLoadProgress={({ nativeEvent }) => {
          if (nativeEvent.progress === 1.0) {
            setLoading(false);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  loadingSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  simpleButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  simpleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
}); 