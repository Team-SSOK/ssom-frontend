export interface GrafanaDashboardOptions {
  dashboardId?: string;
  orgId?: number;
  from?: string;
  to?: string;
  timezone?: string;
  variables?: Record<string, string>;
  refresh?: string;
  kiosk?: boolean;
  theme?: 'light' | 'dark';
}

export interface GrafanaConfig {
  readonly BASE_URL: string;
  readonly DASHBOARD_ID: string;
  readonly ORG_ID: number;
  readonly ANONYMOUS_ENABLED: boolean;
}

export interface TimeRange {
  from: string;
  to: string;
}

export interface DashboardVariable {
  name: string;
  value: string;
}

export interface GrafanaWebViewCallbacks {
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
}

export interface GrafanaWebViewProps extends GrafanaWebViewCallbacks {
  dashboardId?: string;
  orgId?: number;
  timeRange?: TimeRange;
  variables?: Record<string, string>;
  theme?: 'light' | 'dark';
  style?: any;
}

// WebView 상태 관리
export interface WebViewState {
  loading: boolean;
  error: string | null;
  useSimpleUrl: boolean;
}

// Grafana 서버 응답 타입
export interface GrafanaHealthResponse {
  commit: string;
  database: string;
  version: string;
}

// 에러 타입 정의
export type GrafanaErrorType = 
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR' 
  | 'LOAD_ERROR'
  | 'HTTP_ERROR'
  | 'SERVER_ERROR'
  | 'APPLICATION_FILES_ERROR';

export interface GrafanaError {
  type: GrafanaErrorType;
  message: string;
  statusCode?: number;
  description?: string;
} 