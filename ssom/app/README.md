# App Directory - 화면 및 라우팅 구조

이 디렉토리는 SSOM 애플리케이션의 모든 화면과 라우팅 로직을 담고 있습니다. Expo Router의 파일 기반 라우팅 시스템을 사용하여 직관적이고 확장 가능한 네비게이션 구조를 제공합니다.

## 📋 목차

- [구조 개요](#구조-개요)
- [라우팅 시스템](#라우팅-시스템)
- [인증 플로우](#인증-플로우)
- [화면별 상세 설명](#화면별-상세-설명)
- [레이아웃 시스템](#레이아웃-시스템)
- [네비게이션 가이드](#네비게이션-가이드)
- [상태 관리](#상태-관리)
- [성능 최적화](#성능-최적화)
- [개발 가이드라인](#개발-가이드라인)

## 📁 구조 개요

```
app/
├── _layout.tsx                    # 루트 레이아웃 (인증 상태 관리)
├── sign-in.tsx                   # 로그인 화면
├── pw-change.tsx                 # 비밀번호 변경 화면
└── (app)/                        # 인증된 사용자 영역
    ├── _layout.tsx              # 앱 레이아웃 (SSE 연결 관리)
    └── (tabs)/                  # 탭 기반 네비게이션
        ├── _layout.tsx          # 탭 레이아웃 (Drawer 포함)
        ├── index.tsx            # 메인 대시보드
        ├── alerts/              # 알림 관련 화면
        │   ├── _layout.tsx
        │   └── index.tsx
        ├── grafana/             # Grafana 대시보드 화면
        │   ├── _layout.tsx
        │   └── index.tsx
        ├── issues/              # 이슈 관리 화면
        │   ├── _layout.tsx
        │   ├── index.tsx        # 이슈 목록
        │   ├── [id].tsx         # 이슈 상세
        │   └── create.tsx       # 이슈 생성
        ├── loggings/            # 로그 모니터링 화면
        │   ├── _layout.tsx
        │   ├── index.tsx        # 로그 목록
        │   └── [id].tsx         # 로그 상세
        └── profile/             # 프로필 관리 화면
            ├── _layout.tsx
            └── index.tsx
```

### 파일명 컨벤션

- **`_layout.tsx`**: 해당 디렉토리의 공통 레이아웃 정의
- **`index.tsx`**: 디렉토리의 기본 화면 (루트 경로)
- **`[param].tsx`**: 동적 라우트 파라미터 (예: `/issues/123`)
- **`(group)/`**: URL에 포함되지 않는 라우트 그룹

## 🛣 라우팅 시스템

### Expo Router 파일 기반 라우팅

SSOM은 Expo Router v5의 파일 기반 라우팅을 사용합니다:

- **폴더명이 URL 경로**가 됩니다
- **`_layout.tsx`**는 해당 경로의 레이아웃을 정의합니다
- **`()`로 둘러싸인 폴더**는 URL에 포함되지 않는 라우트 그룹입니다
- **`[param].tsx`**는 동적 라우트 파라미터입니다
- **`+not-found.tsx`**는 404 에러 페이지입니다

### 라우트 매핑

| 파일 경로 | URL | 설명 | 접근 권한 |
|-----------|-----|------|-----------|
| `sign-in.tsx` | `/sign-in` | 로그인 화면 | 비인증 전용 |
| `pw-change.tsx` | `/pw-change` | 비밀번호 변경 | 인증 + 비밀번호 미변경 |
| `(app)/(tabs)/index.tsx` | `/` | 메인 대시보드 | 인증 + 비밀번호 변경 완료 |
| `(app)/(tabs)/alerts/index.tsx` | `/alerts` | 알림 목록 | 인증된 사용자 |
| `(app)/(tabs)/issues/[id].tsx` | `/issues/123` | 이슈 상세 (id=123) | 인증된 사용자 |
| `(app)/(tabs)/loggings/[id].tsx` | `/loggings/abc` | 로그 상세 (id=abc) | 인증된 사용자 |
| `(app)/(tabs)/issues/create.tsx` | `/issues/create` | 이슈 생성 | 인증된 사용자 |

### 네비게이션 API 예시

```typescript
import { router } from 'expo-router';

// 기본 네비게이션
router.push('/alerts');
router.push('/issues/123');
router.push('/issues/create');

// 파라미터와 함께 네비게이션
router.push({
  pathname: '/loggings/[id]',
  params: { id: 'unique-log-id' }
});

// 백 네비게이션
router.back();
router.canGoBack();

// 스택 교체
router.replace('/sign-in');

// 스택 리셋
router.dismissAll();
```

## 🔐 인증 플로우

### 인증 상태에 따른 라우팅

```typescript
// app/_layout.tsx
function RootNavigator() {
  const { user, isAuthenticated, isPasswordChanged } = useAuthStore();
  
  return (
    <Stack>
      {/* 1. 완전 인증된 사용자 (앱 메인 영역) */}
      <Stack.Protected guard={isAuthenticated && !!user && isPasswordChanged !== false}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* 2. 인증되었지만 비밀번호 미변경 */}
      <Stack.Protected guard={isAuthenticated && !!user}>
        <Stack.Screen name="pw-change" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* 3. 비인증 상태 */}
      <Stack.Protected guard={!isAuthenticated || !user}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
```

### 인증 상태 변화 시나리오

1. **앱 시작 시**
   ```
   Token Check → isAuthenticated ? 
   ├─ true → Password Changed ? 
   │  ├─ true → Main App
   │  └─ false → Password Change
   └─ false → Sign In
   ```

2. **로그인 성공 시**
   ```
   Login Success → Password Changed Check →
   ├─ true → Redirect to Main App
   └─ false → Redirect to Password Change
   ```

3. **토큰 만료 시**
   ```
   API 401 Error → Token Refresh Attempt →
   ├─ Success → Continue
   └─ Fail → Redirect to Sign In
   ```

### 인증 상태 보호 로직

```typescript
// hooks/useAuthGuard.ts
export function useAuthGuard() {
  const { user, isAuthenticated, isPasswordChanged } = useAuthStore();
  
  const requireAuth = useCallback(() => {
    if (!isAuthenticated || !user) {
      router.replace('/sign-in');
      return false;
    }
    return true;
  }, [isAuthenticated, user]);
  
  const requirePasswordChange = useCallback(() => {
    if (isPasswordChanged === false) {
      router.replace('/pw-change');
      return false;
    }
    return true;
  }, [isPasswordChanged]);
  
  return { requireAuth, requirePasswordChange };
}
```

## 🖥 화면별 상세 설명

### 1. 로그인 화면 (`sign-in.tsx`)

**책임:**
- 사용자 인증 처리
- 로그인 폼 제공
- 개발자 도구 (개발 모드에서만)
- FCM 권한 상태 초기화

**주요 기능:**
- 직원 ID/비밀번호 입력 및 검증
- 자동 로그인 유지 옵션
- 실시간 유효성 검사
- 에러 메시지 표시
- 로딩 상태 관리

**컴포넌트 구조:**
```typescript
export default function SignIn() {
  const { login, isLoading, error } = useAuthStore();
  const { resetPermissionRequest } = useFCMStore();
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>();
  
  const handleLogin = async (data: LoginForm) => {
    resetPermissionRequest(); // FCM 권한 상태 리셋
    await login(data.employeeId, data.password, data.rememberMe);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <AppLogo />
      <LoginForm 
        control={control}
        onSubmit={handleSubmit(handleLogin)}
        isLoading={isLoading}
        errors={errors}
      />
      <LoginNotice />
      <AppVersionInfo />
      {__DEV__ && <DeveloperTools />}
    </SafeAreaView>
  );
}
```

**상태 관리:**
- `useAuthStore`: 로그인 로직 및 인증 상태
- `useFCMStore`: FCM 권한 상태 관리
- React Hook Form: 폼 상태 및 검증

### 2. 비밀번호 변경 화면 (`pw-change.tsx`)

**책임:**
- 초기 비밀번호 변경 강제 처리
- FCM 푸시 알림 권한 요청
- 비밀번호 보안 요구사항 검증

**주요 기능:**
- 현재 비밀번호 확인
- 새 비밀번호 입력 및 확인
- 실시간 비밀번호 강도 검사
- 보안 요구사항 안내
- 변경 완료 후 FCM 권한 요청

**보안 요구사항:**
```typescript
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: true,
  hasLowercase: true,
  hasNumber: true,
  hasSpecialChar: true,
  notSameAsCurrent: true
};

const validatePassword = (password: string, currentPassword: string) => {
  const requirements = [
    { key: 'length', valid: password.length >= 8, message: '8자 이상' },
    { key: 'uppercase', valid: /[A-Z]/.test(password), message: '대문자 포함' },
    { key: 'lowercase', valid: /[a-z]/.test(password), message: '소문자 포함' },
    { key: 'number', valid: /\d/.test(password), message: '숫자 포함' },
    { key: 'special', valid: /[!@#$%^&*]/.test(password), message: '특수문자 포함' },
    { key: 'different', valid: password !== currentPassword, message: '현재 비밀번호와 달라야 함' }
  ];
  
  return requirements;
};
```

### 3. 메인 대시보드 (`(tabs)/index.tsx`)

**책임:**
- 시스템 현황 요약 표시
- 주요 메트릭 및 통계 제공
- 각 기능 모듈로의 빠른 액세스

**주요 기능:**
- 실시간 통계 카드 (알림, 로그, 이슈 수)
- 최근 활동 목록 (최신 알림, 로그, 이슈)
- 빠른 액션 버튼
- 시스템 상태 인디케이터

**데이터 소스:**
```typescript
const DashboardScreen = () => {
  const { stats: alertStats } = useAlertStore();
  const { stats: logStats } = useLogStore();
  const { stats: issueStats } = useIssueStore();
  
  const dashboardStats = {
    alerts: {
      total: alertStats.total,
      unread: alertStats.unread,
      trend: alertStats.todayVsYesterday
    },
    logs: {
      total: logStats.total,
      errors: logStats.errorCount,
      trend: logStats.hourlyTrend
    },
    issues: {
      open: issueStats.open,
      inProgress: issueStats.inProgress,
      resolved: issueStats.resolved
    }
  };
  
  return (
    <ScrollView>
      <StatsCards stats={dashboardStats} />
      <RecentActivities />
      <QuickActions />
    </ScrollView>
  );
};
```

### 4. 알림 시스템 (`alerts/`)

**구조:**
- `_layout.tsx`: 알림 관련 레이아웃 및 SSE 연결 관리
- `index.tsx`: 알림 목록 및 관리 UI

**주요 기능:**
- 실시간 알림 스트림 (SSE)
- 읽음/안읽음 상태 관리
- 알림 필터링 (전체/안읽음/부서별)
- 일괄 읽음 처리
- 무한 스크롤 페이지네이션

**SSE 연결 관리:**
```typescript
// alerts/_layout.tsx에서 전역 SSE 연결 관리
export default function AlertsLayout() {
  const { connectSSE, disconnectSSE } = useAlertStore();
  
  useEffect(() => {
    connectSSE(); // 전역 알림 SSE 연결
    
    return () => {
      disconnectSSE(); // 컴포넌트 언마운트 시 연결 해제
    };
  }, []);
  
  return <Slot />;
}

// alerts/index.tsx에서 UI 렌더링
export default function AlertsScreen() {
  const { 
    alerts, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useAlertStore();
  
  const handleAlertPress = async (alert: Alert) => {
    if (!alert.isRead) {
      await markAsRead(alert.statusId);
    }
    // 알림 상세 처리 (필요시)
  };
  
  return (
    <View style={styles.container}>
      <AlertHeader 
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
      />
      <AlertList 
        alerts={alerts}
        onAlertPress={handleAlertPress}
        isLoading={isLoading}
      />
    </View>
  );
}
```

### 5. 로그 모니터링 (`loggings/`)

**구조:**
- `_layout.tsx`: 로그 관련 레이아웃
- `index.tsx`: 로그 목록 및 필터링
- `[id].tsx`: 로그 상세 및 AI 분석

**주요 기능:**
- 실시간 로그 스트림 (SSE) - 화면별 연결
- 다중 서비스 로그 통합 조회
- 로그 레벨별 필터링 (ERROR, WARN, INFO, DEBUG)
- 서비스별 필터링
- 시간대별 필터링
- 로그 검색 기능
- AI 기반 로그 분석

**SSE 연결 차이점 (알림 vs 로그):**
```typescript
// 알림: 전역 연결 (앱 전체에서 수신)
// alerts/_layout.tsx
useEffect(() => {
  connectSSE(); // 한 번 연결하여 앱 전체에서 사용
}, []);

// 로그: 화면별 연결 (해당 화면에서만 수신)
// loggings/index.tsx
useEffect(() => {
  const connection = createLogSSEConnection({
    services: selectedServices,
    levels: selectedLevels,
    onMessage: handleNewLog
  });
  
  return () => {
    connection.close(); // 화면 이탈시 연결 해제
  };
}, [selectedServices, selectedLevels]);
```

**로그 상세 화면 기능:**
```typescript
// loggings/[id].tsx
export default function LogDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getLogById, analyzeLogWithAI } = useLogStore();
  
  const [log, setLog] = useState(null);
  const [aiAnalysis, setAIAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeLogWithAI(log);
      setAIAnalysis(analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleCreateIssue = () => {
    router.push({
      pathname: '/issues/create',
      params: {
        logId: id,
        logMessage: log.message,
        aiAnalysis: JSON.stringify(aiAnalysis)
      }
    });
  };
  
  return (
    <ScrollView>
      <LogHeader log={log} />
      <LogContent log={log} />
      <AIAnalysisSection 
        analysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
        onAnalyze={handleAIAnalysis}
      />
      <ActionButtons 
        onCreateIssue={handleCreateIssue}
        onShare={() => shareLog(log)}
      />
    </ScrollView>
  );
}
```

### 6. 이슈 관리 (`issues/`)

**구조:**
- `_layout.tsx`: 이슈 관련 레이아웃
- `index.tsx`: 이슈 목록
- `[id].tsx`: 이슈 상세
- `create.tsx`: 이슈 생성

**주요 기능:**
- GitHub Issues API 연동
- 로그 기반 자동 이슈 생성
- AI 기반 이슈 초안 생성
- 이슈 상태 관리 (Open, In Progress, Closed)
- 담당자 할당
- 라벨 및 마일스톤 관리

**이슈 생성 플로우:**
```typescript
// issues/create.tsx
export default function CreateIssueScreen() {
  const { logId, logMessage, aiAnalysis } = useLocalSearchParams();
  const { createIssue, generateIssueTemplate } = useIssueStore();
  
  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
    labels: [],
    assignees: [],
    priority: 'medium'
  });
  
  // 로그 기반 이슈 생성 시 AI 템플릿 자동 생성
  useEffect(() => {
    if (logMessage && aiAnalysis) {
      generateTemplateFromLog();
    }
  }, [logMessage, aiAnalysis]);
  
  const generateTemplateFromLog = async () => {
    const template = await generateIssueTemplate({
      logMessage,
      aiAnalysis: JSON.parse(aiAnalysis || '{}')
    });
    
    setIssueForm(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      labels: template.suggestedLabels
    }));
  };
  
  return (
    <ScrollView>
      <IssueForm 
        form={issueForm}
        onChange={setIssueForm}
        isLogBased={!!logId}
      />
      <AIGeneratedTemplate 
        visible={!!logMessage}
        onApply={applyTemplate}
      />
    </ScrollView>
  );
}
```

### 7. Grafana 대시보드 (`grafana/`)

**구조:**
- `_layout.tsx`: Grafana 관련 레이아웃
- `index.tsx`: Grafana WebView 화면

**주요 기능:**
- WebView 기반 Grafana 임베딩
- Anonymous 접근 지원
- 다중 대시보드 지원
- 네트워크 오류 처리
- 로딩 상태 관리

### 8. 프로필 관리 (`profile/`)

**구조:**
- `_layout.tsx`: 프로필 관련 레이아웃
- `index.tsx`: 프로필 정보 및 설정

**주요 기능:**
- 사용자 정보 표시
- 생체 인증 설정
- 알림 설정
- 로그아웃
- 앱 정보

## 📐 레이아웃 시스템

### 레이아웃 계층 구조

```
Root Layout (app/_layout.tsx)
├── 인증 상태 관리
├── 테마 프로바이더
├── 토스트 메시지 컨테이너
└── Navigation Container
    │
    ├── Sign In Screen (비인증)
    ├── Password Change Screen (인증 + 비밀번호 미변경)
    └── App Layout (app/(app)/_layout.tsx)
        ├── 전역 SSE 연결 (알림)
        ├── FCM 핸들러
        └── Tab Layout (app/(app)/(tabs)/_layout.tsx)
            ├── Bottom Tab Navigation
            ├── Drawer Navigation
            └── Individual Screen Layouts
                ├── alerts/_layout.tsx
                ├── loggings/_layout.tsx
                ├── issues/_layout.tsx
                ├── grafana/_layout.tsx
                └── profile/_layout.tsx
```

### 각 레이아웃의 책임

**1. Root Layout (`app/_layout.tsx`)**
```typescript
export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthGuardedNavigator />
        <Toast />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
```

**2. App Layout (`app/(app)/_layout.tsx`)**
```typescript
export default function AppLayout() {
  const { connectGlobalSSE, disconnectGlobalSSE } = useAlertStore();
  const { setupFCMHandlers } = useFCMStore();
  
  useEffect(() => {
    connectGlobalSSE(); // 전역 알림 SSE 연결
    setupFCMHandlers(); // FCM 핸들러 설정
    
    return () => {
      disconnectGlobalSSE();
    };
  }, []);
  
  return <Slot />;
}
```

**3. Tab Layout (`app/(app)/(tabs)/_layout.tsx`)**
```typescript
export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'back',
        overlayColor: colors.backdrop
      }}
    >
      <Drawer.Screen 
        name="index" 
        options={{ 
          title: '대시보드',
          drawerIcon: ({ color }) => <Icon name="dashboard" color={color} />
        }} 
      />
      {/* 기타 탭 화면들 */}
    </Drawer>
  );
}
```

## 🧭 네비게이션 가이드

### 기본 네비게이션 패턴

```typescript
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

// 1. 기본 push 네비게이션
const navigateToAlerts = () => {
  router.push('/alerts');
};

// 2. 파라미터와 함께 네비게이션
const navigateToIssueDetail = (issueId: string) => {
  router.push(`/issues/${issueId}`);
  // 또는
  router.push({
    pathname: '/issues/[id]',
    params: { id: issueId }
  });
};

// 3. 복잡한 파라미터 전달
const navigateToCreateIssue = (logData: LogData) => {
  router.push({
    pathname: '/issues/create',
    params: {
      logId: logData.id,
      logMessage: logData.message,
      aiAnalysis: JSON.stringify(logData.analysis)
    }
  });
};

// 4. 모달 스타일 네비게이션
const openLogDetail = (logId: string) => {
  router.push({
    pathname: '/loggings/[id]',
    params: { id: logId }
  });
};

// 5. 백 네비게이션
const navigation = useNavigation();
const goBack = () => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    router.replace('/'); // 메인으로 이동
  }
};
```

### 네비게이션 상태 관리

```typescript
// hooks/useNavigationState.ts
export function useNavigationState() {
  const segments = useSegments();
  const pathname = usePathname();
  
  const isInAuthArea = segments[0] === '(app)';
  const currentTab = segments[2]; // (app)/(tabs)/[currentTab]
  const currentScreen = segments[3];
  
  return {
    isInAuthArea,
    currentTab,
    currentScreen,
    pathname,
    segments
  };
}

// 사용 예시
const NavigationAwareComponent = () => {
  const { currentTab, currentScreen } = useNavigationState();
  
  // 현재 위치에 따른 조건부 렌더링
  const shouldShowFloatingButton = currentTab === 'loggings' && !currentScreen;
  
  return (
    <View>
      {/* 컨텐츠 */}
      {shouldShowFloatingButton && <FloatingActionButton />}
    </View>
  );
};
```

### Deep Link 처리

```typescript
// app.json 설정
{
  "expo": {
    "scheme": "ssom",
    "web": {
      "bundler": "metro"
    }
  }
}

// Deep link 예시
// ssom://alerts - 알림 화면으로 이동
// ssom://issues/123 - 특정 이슈로 이동
// ssom://loggings/abc - 특정 로그로 이동

// Deep link 핸들링
const handleDeepLink = (url: string) => {
  const { hostname, pathname } = new URL(url);
  
  if (hostname === 'alerts') {
    router.push('/alerts');
  } else if (hostname === 'issues' && pathname) {
    router.push(`/issues${pathname}`);
  } else if (hostname === 'loggings' && pathname) {
    router.push(`/loggings${pathname}`);
  }
};
```

## 🔄 상태 관리

### 화면별 상태 관리 패턴

```typescript
// 1. 로컬 상태 (useState)
const LogDetailScreen = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('details');
  
  // 화면 내부에서만 사용되는 UI 상태
};

// 2. 전역 상태 (Zustand Store)
const AlertsScreen = () => {
  const { 
    alerts, 
    unreadCount, 
    markAsRead 
  } = useAlertStore(); // 앱 전체에서 공유되는 상태
};

// 3. 서버 상태 (SSE + Store)
const LoggingsScreen = () => {
  const { logs, connectSSE } = useLogStore();
  
  useEffect(() => {
    const connection = connectSSE();
    return () => connection.close();
  }, []);
};

// 4. 폼 상태 (React Hook Form)
const CreateIssueScreen = () => {
  const { control, handleSubmit, formState } = useForm();
  
  // 폼 검증 및 제출 상태 관리
};
```

### 상태 동기화 패턴

```typescript
// 화면 간 상태 동기화
const useScreenSyncEffect = () => {
  const { refresh: refreshAlerts } = useAlertStore();
  const { refresh: refreshLogs } = useLogStore();
  const { refresh: refreshIssues } = useIssueStore();
  
  // 앱이 포그라운드로 돌아올 때 데이터 새로고침
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        refreshAlerts();
        refreshLogs();
        refreshIssues();
      }
    });
    
    return () => subscription?.remove();
  }, []);
};
```

## ⚡ 성능 최적화

### 컴포넌트 최적화

```typescript
// 1. React.memo를 활용한 불필요한 리렌더링 방지
const AlertItem = React.memo(({ alert, onPress }: AlertItemProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(alert)}>
      <Text>{alert.message}</Text>
    </TouchableOpacity>
  );
});

// 2. useMemo를 활용한 계산 결과 캐싱
const LogsScreen = () => {
  const { logs } = useLogStore();
  
  const filteredLogs = useMemo(() => {
    return logs.filter(log => log.level === 'ERROR');
  }, [logs]);
  
  const logsByDate = useMemo(() => {
    return groupBy(filteredLogs, log => format(log.timestamp, 'yyyy-MM-dd'));
  }, [filteredLogs]);
  
  return <LogList logs={logsByDate} />;
};

// 3. useCallback을 활용한 함수 메모이제이션
const AlertsScreen = () => {
  const { markAsRead } = useAlertStore();
  
  const handleAlertPress = useCallback((alert: Alert) => {
    if (!alert.isRead) {
      markAsRead(alert.statusId);
    }
  }, [markAsRead]);
  
  return <AlertList onAlertPress={handleAlertPress} />;
};
```

### 리스트 성능 최적화

```typescript
// FlashList를 활용한 대용량 리스트 최적화
import { FlashList } from '@shopify/flash-list';

const LogList = ({ logs }: { logs: Log[] }) => {
  const renderLogItem = useCallback(({ item }: { item: Log }) => (
    <LogItem key={item.id} log={item} />
  ), []);
  
  const getItemType = useCallback((item: Log) => {
    return item.level; // 로그 레벨별로 아이템 타입 구분
  }, []);
  
  return (
    <FlashList
      data={logs}
      renderItem={renderLogItem}
      getItemType={getItemType}
      estimatedItemSize={80}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};
```

### 이미지 및 에셋 최적화

```typescript
// Expo Image를 활용한 이미지 최적화
import { Image } from 'expo-image';

const ProfileImage = ({ uri }: { uri: string }) => {
  return (
    <Image
      source={{ uri }}
      placeholder={require('@/assets/images/placeholder.png')}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      style={styles.profileImage}
    />
  );
};
```

## 📋 개발 가이드라인

### 화면 생성 체크리스트

새로운 화면을 만들 때 다음 사항들을 확인하세요:

- [ ] **파일 위치**: 적절한 디렉토리에 배치 (`(tabs)` 내부 또는 외부)
- [ ] **레이아웃 설정**: 필요시 `_layout.tsx` 파일 생성
- [ ] **인증 가드**: 인증이 필요한 화면인지 확인
- [ ] **타입 정의**: 파라미터 및 Props 타입 정의
- [ ] **상태 관리**: 로컬 상태 vs 전역 상태 결정
- [ ] **에러 처리**: 로딩 상태, 에러 상태 처리
- [ ] **접근성**: Screen reader 지원 및 접근성 라벨
- [ ] **성능**: 필요시 메모이제이션 적용

### 네비게이션 베스트 프랙티스

```typescript
// ✅ 좋은 예: 타입 안전한 네비게이션
interface NavigationParams {
  issueId: string;
  mode?: 'view' | 'edit';
}

const navigateToIssue = ({ issueId, mode = 'view' }: NavigationParams) => {
  router.push({
    pathname: '/issues/[id]',
    params: { id: issueId, mode }
  });
};

// ❌ 나쁜 예: 타입 없는 네비게이션
const navigateToIssue = (issueId, mode) => {
  router.push(`/issues/${issueId}?mode=${mode}`);
};
```

### 에러 처리 패턴

```typescript
// 화면 레벨 에러 바운더리
const ScreenErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorScreen error={error} onRetry={resetError} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

// 비동기 작업 에러 처리
const LogDetailScreen = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadLogDetail = async (logId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const log = await logApi.getById(logId);
      setLog(log);
    } catch (err) {
      setError(err.message);
      // 에러 리포팅
      if (!__DEV__) {
        crashlytics().recordError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (error) {
    return <ErrorState error={error} onRetry={() => loadLogDetail(logId)} />;
  }
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  return <LogDetailContent log={log} />;
};
```

### 접근성 가이드라인

```typescript
// 접근성을 고려한 컴포넌트 작성
const AccessibleButton = ({ onPress, children, disabled }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      accessibilityHint="이 버튼을 누르면 작업이 실행됩니다"
      accessibilityState={{ disabled }}
    >
      {children}
    </TouchableOpacity>
  );
};

// 스크린 리더를 위한 화면 제목 설정
const useScreenTitle = (title: string) => {
  useEffect(() => {
    // 화면 진입 시 제목 안내
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(`${title} 화면`);
    }
  }, [title]);
};
```

### 테스팅 가이드라인

```typescript
// 화면 테스트 예시
describe('AlertsScreen', () => {
  beforeEach(() => {
    // Mock stores
    jest.mocked(useAlertStore).mockReturnValue({
      alerts: mockAlerts,
      unreadCount: 5,
      markAsRead: jest.fn(),
      isLoading: false
    });
  });
  
  it('should render alerts list', () => {
    render(<AlertsScreen />);
    
    expect(screen.getByText('알림 5개')).toBeOnTheScreen();
    expect(screen.getByText(mockAlerts[0].message)).toBeOnTheScreen();
  });
  
  it('should mark alert as read when pressed', async () => {
    const markAsRead = jest.fn();
    jest.mocked(useAlertStore).mockReturnValue({
      ...mockStoreState,
      markAsRead
    });
    
    render(<AlertsScreen />);
    
    fireEvent.press(screen.getByText(mockAlerts[0].message));
    
    expect(markAsRead).toHaveBeenCalledWith(mockAlerts[0].statusId);
  });
});
```

---

## 📚 추가 리소스

- [Expo Router 공식 문서](https://docs.expo.dev/router/introduction/)
- [React Navigation 가이드](https://reactnavigation.org/)
- [React Native 성능 최적화](https://reactnative.dev/docs/performance)
- [Zustand 상태 관리](https://github.com/pmndrs/zustand)

---

**마지막 업데이트**: 2024년 12월