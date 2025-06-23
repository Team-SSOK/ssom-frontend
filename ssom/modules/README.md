# Modules Directory - 기능별 모듈 구조

이 디렉토리는 SSOM 애플리케이션의 핵심 비즈니스 로직을 기능별로 모듈화하여 관리합니다. 각 모듈은 독립적이면서도 상호 연동되어 시스템 전체의 기능을 제공하며, 확장 가능하고 유지보수가 용이한 아키텍처를 구현합니다.

## 📋 목차

- [모듈 아키텍처](#모듈-아키텍처)
- [모듈별 개요](#모듈별-개요)
- [공통 패턴](#공통-패턴)
- [모듈 간 통신](#모듈-간-통신)
- [개발 가이드라인](#개발-가이드라인)
- [확장 가이드](#확장-가이드)
- [성능 최적화](#성능-최적화)
- [테스팅 전략](#테스팅-전략)
- [모니터링 및 로깅](#모니터링-및-로깅)

## 📁 모듈 아키텍처

```
modules/
├── alerts/                     # 실시간 알림 시스템
│   ├── apis/                  # API 호출 로직
│   │   ├── alertApi.ts       # REST API 클라이언트
│   │   └── alertSSEApi.ts    # SSE 스트리밍 클라이언트
│   ├── components/           # UI 컴포넌트
│   │   ├── AlertHeader.tsx
│   │   ├── AlertItem.tsx
│   │   └── AlertList.tsx
│   ├── hooks/                # 커스텀 훅
│   │   ├── useAlertSSEConnection.ts
│   │   └── useAlertStream.ts
│   ├── stores/               # 상태 관리
│   │   └── alertStore.ts
│   ├── types/                # TypeScript 타입 정의
│   │   └── index.ts
│   ├── alert-api-spec.md     # API 문서
│   └── alert-backend.md      # 백엔드 구현 문서
│
├── auth/                       # 인증 및 사용자 관리
│   ├── apis/
│   │   ├── authApi.ts
│   │   └── biometricApi.ts
│   ├── components/
│   │   ├── BiometricAuth/
│   │   ├── Profile/
│   │   ├── PwChange/
│   │   └── SignIn/
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── bioStore.ts
│   ├── auth-api-spec.md
│   └── biometric_api-spec.md
│
├── dashboard/                  # 대시보드 및 통계
│   ├── components/
│   │   └── Dashboard/
│   └── utils/
│
├── grafana/                    # Grafana 대시보드 통합
│   ├── components/
│   │   └── GrafanaWebView.tsx
│   ├── config/
│   ├── types/
│   ├── utils/
│   └── README.md
│
├── issues/                     # 이슈 관리 시스템
│   ├── apis/
│   │   └── issueApi.ts
│   ├── components/
│   │   ├── Creation/         # 이슈 생성 관련
│   │   ├── Dashboard/        # 이슈 목록 관련
│   │   └── Detail/           # 이슈 상세 관련
│   ├── hooks/
│   │   └── useIssueForm.ts
│   ├── stores/
│   │   └── issueStore.ts
│   ├── utils/
│   │   ├── parseLogParams.ts
│   │   ├── statusStyles.ts
│   │   └── validators.ts
│   └── issue-api-spec.md
│
├── logging/                    # 로그 모니터링 시스템
│   ├── apis/
│   │   ├── logApi.ts
│   │   └── logSSEApi.ts
│   ├── components/
│   │   ├── Common/           # 공통 컴포넌트
│   │   ├── LogDashboard/     # 로그 목록 관련
│   │   └── LogDetail/        # 로그 상세 관련
│   ├── hooks/
│   │   ├── useCombinedLogs.ts
│   │   ├── useLogFilters.ts
│   │   ├── useLogSSEConnection.ts
│   │   ├── useLogStream.ts
│   │   └── useMultiSelectLogs.ts
│   ├── stores/
│   │   └── logStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── buildLogIssueParams.ts
│   ├── logging-api-spec.md
│   └── logging-backend.md
│
└── notifications/              # 푸시 알림 시스템
    ├── apis/
    │   └── notificationApi.ts
    ├── hooks/
    │   └── useNotifications.ts
    ├── services/
    │   └── notificationService.ts
    ├── stores/
    │   └── fcmStore.ts
    ├── types/
    │   └── index.ts
    ├── utils/
    │   └── notificationHelpers.ts
    ├── fcm-api-spec.md
    └── README.md
```

## 🔍 모듈별 개요

### 1. 🚨 Alerts (알림 시스템)

**목적:** 실시간 시스템 알림 관리 및 사용자 알림 제공

**핵심 기능:**
- SSE 기반 실시간 알림 수신
- 알림 상태 관리 (읽음/안읽음)
- 부서별 알림 필터링
- FCM 푸시 알림 연동

**주요 컴포넌트:**
- `AlertHeader`: 알림 헤더 및 탭 네비게이션
- `AlertList`: 알림 목록 및 무한스크롤
- `AlertItem`: 개별 알림 아이템

**데이터 플로우:**
```
Backend SSE → AlertSSEApi → AlertStore → AlertList → UI Update
```

### 2. 🔐 Auth (인증 시스템)

**목적:** 사용자 인증, 권한 관리, 프로필 관리

**핵심 기능:**
- JWT 기반 인증
- 자동 토큰 갱신
- 생체 인증 지원
- 사용자 프로필 관리
- 비밀번호 변경

**주요 컴포넌트:**
- `SignIn/`: 로그인 관련 컴포넌트
- `Profile/`: 프로필 관리 컴포넌트
- `PwChange/`: 비밀번호 변경 컴포넌트

**데이터 플로우:**
```
User Input → AuthApi → AuthStore → Navigation/UI Update
```

### 3. 📊 Dashboard (대시보드)

**목적:** 시스템 전체 현황 요약 및 주요 메트릭 표시

**핵심 기능:**
- 통계 카드 표시
- 최근 활동 목록
- 빠른 액션 버튼

**주요 컴포넌트:**
- `AdminDashboard`: 메인 대시보드
- `StatsCard`: 통계 카드
- `RecentSection`: 최근 활동 섹션

### 4. 📈 Grafana (모니터링 대시보드)

**목적:** Grafana 대시보드 통합 및 실시간 메트릭 모니터링

**핵심 기능:**
- WebView 기반 Grafana 임베딩
- 사용자별 대시보드 설정
- 네트워크 오류 처리

**주요 컴포넌트:**
- `GrafanaWebView`: Grafana WebView 컴포넌트

**설정:**
- `config.ts`: Grafana 서버 설정
- 환경변수 기반 동적 URL 생성

### 5. 🎫 Issues (이슈 관리)

**목적:** GitHub Issues 연동 및 로그 기반 이슈 생성

**핵심 기능:**
- GitHub Issues API 연동
- 로그 기반 자동 이슈 생성
- AI 기반 이슈 초안 생성
- 담당자 할당 및 상태 관리

**주요 컴포넌트:**
- `Creation/`: 이슈 생성 관련
- `Dashboard/`: 이슈 목록 관련
- `Detail/`: 이슈 상세 관련

**데이터 플로우:**
```
Log Selection → IssueForm → AI Analysis → GitHub API → IssueStore
```

### 6. 📋 Logging (로그 모니터링)

**목적:** 실시간 로그 스트리밍 및 로그 분석

**핵심 기능:**
- SSE 기반 실시간 로그 스트리밍
- 다중 필터링 (서비스, 레벨, 검색)
- 무한 스크롤 페이지네이션
- 다중 선택 및 이슈 생성
- AI 기반 로그 분석

**주요 컴포넌트:**
- `LogDashboard/`: 로그 목록 및 필터링
- `LogDetail/`: 로그 상세 및 분석
- `Common/`: 공통 컴포넌트

**데이터 플로우:**
```
Backend SSE → LogSSEApi → LogStore → LogList → Multi-Select → Issue Creation
```

### 7. 🔔 Notifications (푸시 알림)

**목적:** FCM 푸시 알림 관리 및 로컬 알림 처리

**핵심 기능:**
- FCM 토큰 관리
- 푸시 알림 수신 처리
- 로컬 알림 스케줄링
- 딥링크 처리

**주요 서비스:**
- `NotificationService`: 알림 서비스 싱글톤
- `FCMStore`: FCM 상태 관리

## 🔄 공통 패턴

### 1. API 클라이언트 패턴

모든 모듈의 API 클라이언트는 일관된 패턴을 따릅니다:

```typescript
// 예시: alertApi.ts
class AlertApi {
  async getAlerts(): Promise<AlertEntry[]> {
    const response = await apiInstance.get<ApiResponse<AlertEntry[]>>('/alert');
    return response.data.result;
  }
  
  async markAsRead(alertStatusId: number): Promise<void> {
    await apiInstance.patch('/alert/modify', { alertStatusId, isRead: true });
  }
}

export const alertApi = new AlertApi();
```

### 2. Store 패턴 (Zustand)

모든 상태 관리는 Zustand를 사용하여 일관된 패턴을 따릅니다:

```typescript
interface StoreState {
  // 데이터
  data: DataType[];
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchData: () => Promise<void>;
  clearError: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  data: [],
  isLoading: false,
  error: null,
  
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getData();
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));
```

### 3. 컴포넌트 패턴

모든 컴포넌트는 일관된 구조를 따릅니다:

```typescript
// 인터페이스 정의
interface ComponentProps {
  title: string;
  onPress?: () => void;
}

// 컴포넌트 구현
export default function Component({ title, onPress }: ComponentProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### 4. SSE 연결 패턴

실시간 데이터 스트리밍은 공통 `BaseSSEService`를 상속받아 구현됩니다:

```typescript
class AlertSSEService extends BaseSSEService<AlertEntry> {
  protected getEndpoint(): string {
    return '/alert/subscribe';
  }
  
  protected handleMessage(data: string): AlertEntry | null {
    try {
      return JSON.parse(data) as AlertEntry;
    } catch (error) {
      return null;
    }
  }
  
  protected getServiceName(): string {
    return 'Alert';
  }
}
```

## 🔗 모듈 간 통신

### 1. 직접 통신

```typescript
// 로그에서 이슈 생성
import { buildLogIssueParams } from '@/modules/logging/utils/buildLogIssueParams';
import { router } from 'expo-router';

const createIssueFromLogs = (selectedLogs: LogEntry[]) => {
  const params = buildLogIssueParams(selectedLogs, true);
  router.push({
    pathname: '/issues/create',
    params
  });
};
```

### 2. Store 구독

```typescript
// 다른 모듈의 Store 상태 구독
const { alerts } = useAlertStore();
const { logs } = useLogStore();

const combinedData = useMemo(() => {
  return {
    unreadAlerts: alerts.filter(a => !a.isRead).length,
    errorLogs: logs.filter(l => l.level === 'ERROR').length,
  };
}, [alerts, logs]);
```

### 3. Context 공유

```typescript
// 전역 UI 상태 공유
const { isVisible, showFab, hideFab } = useFab();

useEffect(() => {
  if (scrollY > 100) {
    hideFab();
  } else {
    showFab();
  }
}, [scrollY]);
```

## 📚 개발 가이드라인

### 1. 새 모듈 추가

새 모듈을 추가할 때는 다음 구조를 따르세요:

```
new-module/
├── apis/                 # API 호출 로직
├── components/           # UI 컴포넌트
├── hooks/                # 커스텀 훅
├── stores/               # 상태 관리
├── types/                # TypeScript 타입
├── utils/                # 유틸리티 함수
├── constants/            # 상수 정의
├── api-spec.md           # API 문서
└── README.md             # 모듈 문서
```

### 2. 명명 규칙

- **파일명**: kebab-case 또는 PascalCase
- **컴포넌트**: PascalCase
- **함수/변수**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **타입/인터페이스**: PascalCase

### 3. Import 규칙

```typescript
// 1. React 관련
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// 2. 외부 라이브러리
import { router } from 'expo-router';
import { create } from 'zustand';

// 3. 내부 공통 모듈
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components';

// 4. 현재 모듈 내부
import { alertApi } from './apis/alertApi';
import { AlertEntry } from './types';
```

### 4. 에러 처리

```typescript
// API 에러는 interceptor에서 처리됨을 가정
const fetchData = async () => {
  set({ isLoading: true, error: null });
  try {
    const data = await api.getData();
    set({ data, isLoading: false });
  } catch (error) {
    // interceptor에서 처리되지 않은 로직 에러만 처리
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    set({ error: errorMessage, isLoading: false });
  }
};
```

### 5. 타입 정의

```typescript
// 기본 인터페이스
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 확장 인터페이스
export interface AlertEntry extends BaseEntity {
  title: string;
  message: string;
  isRead: boolean;
  // ... 기타 필드
}

// API 요청/응답 타입
export interface AlertUpdateRequest {
  alertStatusId: number;
  isRead: boolean;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
}
```

## 🚀 확장 가이드

### 1. 새로운 기능 추가

1. **분석**: 기능이 기존 모듈에 속하는지 새 모듈이 필요한지 결정
2. **설계**: API 스펙, 데이터 모델, 컴포넌트 구조 설계
3. **구현**: 공통 패턴을 따라 단계별 구현
4. **테스트**: 기능 테스트 및 통합 테스트
5. **문서화**: API 스펙 및 사용법 문서 작성

### 2. 기존 모듈 확장

1. **영향 분석**: 기존 코드에 미치는 영향 분석
2. **호환성**: 기존 API 호환성 유지
3. **점진적 적용**: 기존 기능을 유지하면서 점진적 확장
4. **마이그레이션**: 필요시 데이터 마이그레이션 계획

### 3. 성능 최적화

1. **메모이제이션**: React.memo, useMemo, useCallback 활용
2. **지연 로딩**: 큰 컴포넌트의 지연 로딩
3. **가상화**: 긴 목록의 가상화 적용
4. **상태 최적화**: 필요한 곳에만 상태 구독

### 4. 모듈 간 의존성 관리

```typescript
// ❌ 순환 의존성 회피
// alerts/components/AlertItem.tsx
import { issueApi } from '../../issues/apis/issueApi'; // 피하기

// ✅ 상위 레벨에서 조합
// app/(tabs)/alerts/index.tsx
import { useAlertStore } from '@/modules/alerts/stores/alertStore';
import { useIssueStore } from '@/modules/issues/stores/issueStore';
```

## 🔧 유틸리티 함수

각 모듈은 재사용 가능한 유틸리티 함수를 제공합니다:

- **alerts/**: 알림 포맷팅, 시간 변환
- **auth/**: 토큰 처리, 권한 검증  
- **issues/**: 상태 스타일링, 유효성 검증
- **logging/**: 로그 파라미터 빌드, 필터링
- **notifications/**: 알림 헬퍼, 딥링크 처리

---

각 모듈의 상세한 구현 및 사용법은 해당 모듈의 개별 문서를 참조하세요. 