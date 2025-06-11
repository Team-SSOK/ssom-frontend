// Grafana 설정 (Anonymous 접근 활성화됨)
export const GRAFANA_CONFIG = {
  BASE_URL: 'https://metric.ssok.kr',
  DASHBOARD_ID: '1accdfb0-3b5b-4687-8c99-5e59a548a6cc',
  ORG_ID: 1,
  ANONYMOUS_ENABLED: true,
} as const;

// 대시보드 URL 생성 함수 (Anonymous 접근용)
export const createDashboardUrl = (options: {
  dashboardId?: string;
  orgId?: number;
  from?: string;
  to?: string;
  timezone?: string;
  variables?: Record<string, string>;
  refresh?: string;
  kiosk?: boolean;
  theme?: 'light' | 'dark';
} = {}) => {
  const {
    dashboardId = GRAFANA_CONFIG.DASHBOARD_ID,
    orgId = GRAFANA_CONFIG.ORG_ID,
    from = 'now-24h',
    to = 'now',
    timezone = 'browser',
    variables = {
      'var-application': 'ssok-account-service',
      'var-instance': '172.16.0.232:8080',
      'var-jvm_memory_pool_heap': '$__all',
      'var-jvm_memory_pool_nonheap': '$__all',
      'var-jvm_buffer_pool': '$__all',
    },
    refresh = '30s',
    kiosk = true,
    theme,
  } = options;

  const baseUrl = `${GRAFANA_CONFIG.BASE_URL}/d/${dashboardId}/ssok-jvm`;
  const params = new URLSearchParams();

  // 기본 파라미터
  params.append('orgId', orgId.toString());
  params.append('from', from);
  params.append('to', to);
  params.append('timezone', timezone);
  params.append('refresh', refresh);

  // 변수들 추가
  Object.entries(variables).forEach(([key, value]) => {
    params.append(key, value);
  });

  // 키오스크 모드 (툴바 숨김)
  if (kiosk) {
    params.append('kiosk', '');
  }

  // 테마 설정
  if (theme) {
    params.append('theme', theme);
  }

  return `${baseUrl}?${params.toString()}`;
};



// HTTP 헤더 생성 (Anonymous 접근용 - API 키 제거)
export const createGrafanaHeaders = () => ({
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'User-Agent': 'SSOM-Mobile-App/1.0',
  'Cache-Control': 'no-cache',
  'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
});

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  LOAD_ERROR: '그라파나 대시보드를 불러오는데 실패했습니다.',
  HTTP_ERROR: (status: number) => `HTTP 오류: ${status}`,
  SERVER_ERROR: 'Grafana 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
} as const;

// 간단한 대시보드 URL (문제 발생 시 대체용)
export const createSimpleDashboardUrl = () => {
  const params = new URLSearchParams({
    orgId: GRAFANA_CONFIG.ORG_ID.toString(),
    from: 'now-24h',
    to: 'now',
    refresh: '30s',
  });
  
  return `${GRAFANA_CONFIG.BASE_URL}/d/${GRAFANA_CONFIG.DASHBOARD_ID}?${params.toString()}`;
}; 