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
  readonly API_KEY: string;
  readonly DASHBOARD_ID: string;
  readonly ORG_ID: number;
}

export interface GrafanaErrorMessages {
  readonly NETWORK_ERROR: string;
  readonly AUTH_ERROR: string;
  readonly LOAD_ERROR: string;
  readonly HTTP_ERROR: (status: number) => string;
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
  onNavigationStateChange?: (navState: any) => void;
} 