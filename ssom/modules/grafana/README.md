# Grafana Dashboard Integration

SSOM 앱에서 Grafana 대시보드를 WebView로 임베딩하는 모듈입니다.
Anonymous 접근이 활성화된 Grafana 서버와 연동됩니다.

## 파일 구조

```
modules/grafana/
├── config.ts                   # Grafana 설정 및 유틸리티
├── types.ts                    # TypeScript 타입 정의
├── components/
│   └── GrafanaWebView.tsx      # 재사용 가능한 WebView 컴포넌트
└── README.md                   # 문서

app/(app)/(tabs)/grafana/
├── index.tsx                   # 메인 GrafanaScreen 컴포넌트
└── _layout.tsx                 # 네비게이션 레이아웃
```

## 주요 기능

- **Anonymous 접근**: API 키 없이 Grafana 대시보드에 접근
- **WebView 기반**: React Native WebView를 사용하여 네이티브 임베딩
- **이중 URL 시스템**: 문제 발생 시 간단한 URL로 자동 대체
- **에러 처리**: 네트워크 오류, HTTP 오류 등 포괄적인 에러 처리
- **사용자 친화적 UI**: 로딩 상태, 에러 복구, 간단 모드 제공
- **성능 최적화**: 캐싱, 스크롤 최적화

## 사용법

### 기본 사용
```typescript
import GrafanaWebView from '@/modules/grafana/components/GrafanaWebView';

<GrafanaWebView theme="light" />
```

### 커스텀 설정
```typescript
<GrafanaWebView
  timeRange={{ from: 'now-1h', to: 'now' }}
  variables={{
    'var-application': 'custom-service',
    'var-instance': '192.168.1.100:8080'
  }}
  theme="dark"
  onLoadStart={() => setLoading(true)}
  onLoadEnd={() => setLoading(false)}
  onError={(error) => console.error('Error:', error)}
/>
```

## 설정

### Grafana 서버 설정
```ini
[auth.anonymous]
enabled = true
org_name = Main Org.
org_role = Viewer
hide_version = false
```

### 앱 설정
```typescript
export const GRAFANA_CONFIG = {
  BASE_URL: 'https://metric.ssok.kr',
  DASHBOARD_ID: '1accdfb0-3b5b-4687-8c99-5e59a548a6cc',
  ORG_ID: 1,
  ANONYMOUS_ENABLED: true,
} as const;
```

## 에러 처리

### 자동 대체 시스템
- **기본**: 완전한 대시보드 URL (모든 변수 포함)
- **간단 모드**: 문제 발생 시 최소한의 파라미터로 자동 전환

### 에러 유형
- **네트워크 오류**: 연결 실패 시 재시도 버튼 제공
- **HTTP 오류**: 상태 코드별 구체적인 에러 메시지
- **서버 오류**: 5xx 에러 시 특별한 안내 메시지

## 보안

- **도메인 화이트리스트**: `https://metric.ssok.kr` 도메인만 허용
- **Anonymous 제한**: Viewer 권한으로 제한 (읽기 전용)
- **HTTPS**: 모든 통신은 HTTPS를 통해 수행

## 성능 최적화

- **캐싱**: WebView 캐싱 활성화
- **스크롤 최적화**: 스크롤 인디케이터 숨김
- **하드웨어 가속**: JavaScript 및 DOM 스토리지 활성화
- **미디어 최적화**: 인라인 미디어 재생 지원

## 문제 해결

### 대시보드가 로드되지 않는 경우
1. 네트워크 연결 상태 확인
2. Grafana 서버 상태 확인
3. Anonymous 접근 설정 확인
4. 간단 모드 시도

### Anonymous 접근 관련 문제
- Grafana 서버에서 `[auth.anonymous] enabled = true` 확인
- 조직(Org) 설정에서 Anonymous 사용자 권한 확인
- 대시보드 접근 권한 확인

---

**참고**: 
- Grafana 서버의 Anonymous 접근이 활성화되어 있어야 합니다
- 모든 API 키 관련 코드는 제거되었습니다
- 문제 발생 시 간단 모드로 자동 대체됩니다 