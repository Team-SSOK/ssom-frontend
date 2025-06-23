# SSOM (System SOftware Operations Monitor)

실시간 시스템 모니터링 및 운영 관리를 위한 React Native 기반 모바일 애플리케이션입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [환경 설정](#환경-설정)
- [아키텍처](#아키텍처)
- [개발 가이드](#개발-가이드)
- [API 문서](#api-문서)
- [배포](#배포)
- [성능 최적화](#성능-최적화)
- [트러블슈팅](#트러블슈팅)
- [기여하기](#기여하기)

## 🎯 프로젝트 개요

SSOM은 시스템 운영팀을 위한 종합 모니터링 솔루션입니다. 실시간 로그 모니터링, 알림 시스템, 이슈 관리, Grafana 대시보드 통합을 통해 효율적인 시스템 운영을 지원합니다.

### 핵심 가치
- **실시간 모니터링**: SSE(Server-Sent Events)를 통한 실시간 데이터 스트리밍
- **통합 관리**: 로그, 알림, 이슈를 하나의 플랫폼에서 관리
- **효율적 운영**: 직관적인 UI/UX로 빠른 문제 해결 지원
- **확장성**: 모듈화된 아키텍처로 새로운 기능 추가 용이

### 지원 플랫폼
- **iOS**: 15.0 이상
- **Android**: API 레벨 21 (Android 5.0) 이상
- **Web**: 개발 및 데모 목적으로 제한적 지원

## ✨ 주요 기능

### 🚨 실시간 알림 시스템
- SSE 기반 실시간 알림 수신
- FCM 푸시 알림 지원
- 알림 상태 관리 (읽음/안읽음)
- 부서별 알림 필터링
- 배치 읽음 처리

### 📊 로그 모니터링
- 실시간 로그 스트리밍
- 다중 서비스 로그 통합 조회
- 로그 레벨별 필터링 (ERROR, WARN, INFO, DEBUG)
- AI 기반 로그 분석 및 인사이트 제공
- 무한 스크롤 페이지네이션
- 로그 검색 및 필터링

### 🎫 이슈 관리
- GitHub Issues 연동
- 로그 기반 자동 이슈 생성
- AI 기반 이슈 초안 생성
- 담당자 할당 및 상태 관리
- 이슈 템플릿 지원

### 📈 Grafana 대시보드
- WebView 기반 Grafana 통합
- 사용자별 맞춤 대시보드
- 실시간 메트릭 모니터링
- Anonymous 접근 지원
- 다중 대시보드 지원

### 🔐 인증 및 보안
- JWT 기반 인증
- 자동 토큰 갱신
- 생체 인증 지원 (지문, Face ID)
- 역할 기반 접근 제어
- 세션 관리 및 보안 정책

## 🛠 기술 스택

### Frontend
- **React Native**: 0.79.3
- **Expo**: ~53.0.9
- **TypeScript**: ~5.8.3
- **Expo Router**: ~5.1.0 (파일 기반 라우팅)

### 상태 관리
- **Zustand**: ^5.0.5 (경량 상태 관리 라이브러리)

### UI/UX
- **React Native Paper**: ^5.14.5 (Material Design 컴포넌트)
- **Expo Vector Icons**: ^14.1.0 (아이콘 라이브러리)
- **React Native Safe Area Context**: 5.4.0 (안전 영역 관리)
- **React Native Reanimated**: ~3.17.4 (애니메이션)
- **Lottie React Native**: ^7.2.2 (고급 애니메이션)

### 네트워킹
- **Axios**: ^1.9.0 (HTTP 클라이언트)
- **React Native SSE**: ^1.2.1 (Server-Sent Events)

### 알림 및 인증
- **Expo Notifications**: ~0.31.2 (로컬/푸시 알림)
- **Expo Local Authentication**: ~16.0.4 (생체 인증)
- **Expo Secure Store**: ~14.2.3 (보안 저장소)

### 기타 라이브러리
- **React Hook Form**: ^7.54.2 (폼 관리)
- **React Native Gifted Charts**: ^1.4.61 (차트 컴포넌트)
- **React Native Markdown Display**: ^7.0.2 (마크다운 렌더링)
- **React Native WebView**: 13.13.5 (웹뷰)

### 개발 도구
- **ESLint**: ^9.25.0 (코드 품질 관리)
- **Prettier**: ^3.5.3 (코드 포매팅)
- **Expo Dev Tools**: 개발 및 디버깅

## 📁 프로젝트 구조

```
ssom/
├── app/                          # 화면 및 라우팅 (Expo Router)
│   ├── (app)/                   # 인증된 사용자 화면
│   │   ├── (tabs)/             # 탭 기반 네비게이션
│   │   │   ├── alerts/         # 알림 화면
│   │   │   ├── grafana/        # Grafana 대시보드
│   │   │   ├── issues/         # 이슈 관리
│   │   │   ├── loggings/       # 로그 모니터링
│   │   │   ├── profile/        # 프로필 관리
│   │   │   └── index.tsx       # 메인 대시보드
│   │   └── _layout.tsx         # 앱 레이아웃
│   ├── pw-change.tsx           # 비밀번호 변경
│   ├── sign-in.tsx             # 로그인
│   └── _layout.tsx             # 루트 레이아웃
├── modules/                      # 기능별 모듈
│   ├── alerts/                 # 알림 시스템
│   ├── auth/                   # 인증 및 사용자 관리
│   ├── dashboard/              # 대시보드
│   ├── grafana/                # Grafana 통합
│   ├── issues/                 # 이슈 관리
│   ├── logging/                # 로그 시스템
│   └── notifications/          # 푸시 알림
├── api/                         # API 설정 및 인터셉터
├── components/                  # 공통 컴포넌트
├── hooks/                       # 커스텀 훅
├── contexts/                    # React Context
├── styles/                      # 스타일 및 테마
├── utils/                       # 유틸리티 함수
├── .env                         # 환경 변수
├── app.json                     # Expo 설정
├── eas.json                     # EAS 빌드 설정
└── package.json                 # 의존성 관리
```

자세한 구조는 다음 문서를 참조하세요:
- [App 구조 가이드](./app/README.md) - 화면 및 라우팅 시스템
- [Modules 구조 가이드](./modules/README.md) - 기능별 모듈 아키텍처

## 🚀 설치 및 실행

### 사전 요구사항
- **Node.js**: v18.0.0 이상
- **npm**: v8.0.0 이상 또는 **yarn**: v1.22.0 이상
- **Expo CLI**: `npm install -g @expo/cli`
- **EAS CLI**: `npm install -g eas-cli` (빌드용)
- **Android Studio**: Android 개발 시 (API 레벨 21 이상)
- **Xcode**: iOS 개발 시 (macOS만, Xcode 13 이상)

### 빠른 시작

```bash
# 1. 저장소 클론
git clone <repository-url>
cd ssom

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일 편집

# 4. 개발 서버 시작
npx expo start

# 5. 앱 실행
# iOS: 'i' 키 또는 QR 코드 스캔
# Android: 'a' 키 또는 QR 코드 스캔
# Web: 'w' 키 (제한적 지원)
```

### 플랫폼별 실행

```bash
# iOS 시뮬레이터에서 실행
npx expo start --ios

# Android 에뮬레이터에서 실행
npx expo start --android

# 웹 브라우저에서 실행 (개발 목적)
npx expo start --web

# 터널 모드로 실행 (실제 기기 테스트)
npx expo start --tunnel
```

### 개발 빌드 설치

```bash
# EAS CLI 로그인
eas login

# 개발 빌드 생성
eas build --profile development

# 빌드된 앱 설치 후 개발 서버 연결
npx expo start --dev-client
```

## ⚙️ 환경 설정

### 환경 변수 (.env)

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# API 서버 설정
API_BASE_URL=https://your-api-server.com
API_TIMEOUT=10000
API_VERSION=v1

# Grafana 설정
GRAFANA_BASE_URL=https://your-grafana-server.com
GRAFANA_DASHBOARD_ID=your-dashboard-id
GRAFANA_ORG_ID=1

# Firebase Cloud Messaging 설정
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:android:abcdef

# 개발 환경 설정
NODE_ENV=development
EXPO_USE_METRO_WORKSPACE_ROOT=1

# 디버깅 설정
DEBUG_LOGS=true
MOCK_API=false
```

### EAS 빌드 설정 (eas.json)

```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Firebase 설정

1. **Firebase 프로젝트 생성**
   - [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
   - iOS/Android 앱 추가
   - `google-services.json` (Android) 및 `GoogleService-Info.plist` (iOS) 다운로드

2. **FCM 설정**
   ```bash
   # Firebase 서비스 계정 키 생성
   # Firebase Console > Project Settings > Service accounts
   ```

## 🏗 아키텍처

### 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        SSOM Mobile App                         │
├─────────────────────────────────────────────────────────────────┤
│  📱 Presentation Layer (React Native + Expo)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Screens   │ │ Components  │ │   Layouts   │               │
│  │ (app/)      │ │ (shared)    │ │ (routing)   │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  🔧 Business Logic Layer (Modules)                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Stores    │ │    APIs     │ │    Hooks    │               │
│  │ (Zustand)   │ │ (Axios/SSE) │ │ (Custom)    │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  🌐 Communication Layer                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ REST APIs   │ │     SSE     │ │     FCM     │               │
│  │ (HTTP/HTTPS)│ │ (Real-time) │ │ (Push)      │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                          │
├─────────────────────────────────────────────────────────────────┤
│  🚀 API Server (REST + SSE)                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  Auth API   │ │  Logs API   │ │ Issues API  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ Alerts SSE  │ │  Logs SSE   │ │  FCM Push   │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  📊 External Services                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Grafana   │ │   GitHub    │ │  Firebase   │               │
│  │ Dashboards  │ │   Issues    │ │     FCM     │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### 데이터 플로우

1. **인증 플로우**
   ```
   User Input → AuthStore → AuthAPI → JWT Token → Secure Storage
   ```

2. **실시간 데이터 플로우**
   ```
   Backend SSE → API Layer → Store Update → UI Re-render
   ```

3. **푸시 알림 플로우**
   ```
   Server Event → FCM → Device Notification → App State Update
   ```

### 모듈 간 통신

- **직접 통신**: Store에서 다른 Store의 메서드 직접 호출
- **이벤트 기반**: SSE 이벤트를 통한 실시간 업데이트
- **Context 공유**: React Context를 통한 전역 상태 공유

## 📚 개발 가이드

### 코딩 스타일

```typescript
// 1. 컴포넌트 명명 규칙
export default function UserProfileScreen() {
  // PascalCase for components
}

// 2. Hook 명명 규칙
export function useUserProfile() {
  // camelCase starting with 'use'
}

// 3. 상수 명명 규칙
export const API_ENDPOINTS = {
  USERS: '/users',
  LOGS: '/logs'
};

// 4. 타입 정의
export interface UserProfile {
  id: string;
  name: string;
  department: string;
}

// 5. Store 패턴
export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  
  fetchUsers: async () => {
    set({ loading: true });
    // API 호출
    set({ users: result, loading: false });
  }
}));
```

### Git 워크플로우

```bash
# 1. Feature 브랜치 생성
git checkout -b feature/user-profile-enhancement

# 2. 작업 후 커밋 (Conventional Commits)
git commit -m "feat: add user profile edit functionality"
git commit -m "fix: resolve navigation issue in profile screen"
git commit -m "docs: update user module documentation"

# 3. Push 및 Pull Request
git push origin feature/user-profile-enhancement
```

### 커밋 메시지 컨벤션

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포매팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/도구 변경

### 테스트 가이드

```bash
# 타입 체크
npm run type-check

# 린팅
npm run lint

# 포매팅
npx prettier --write .

# E2E 테스트 (추후 추가 예정)
# npm run test:e2e
```

## 📖 API 문서

각 모듈별 API 문서:

- [인증 API](./modules/auth/auth-api-spec.md)
- [알림 API](./modules/alerts/alert-api-spec.md)
- [로그 API](./modules/logging/logging-api-spec.md)
- [이슈 API](./modules/issues/issue-api-spec.md)
- [FCM API](./modules/notifications/fcm-api-spec.md)

### API 호출 예시

```typescript
// 1. 기본 API 호출
import { apiClient } from '@/api/client';

const response = await apiClient.get('/users/profile');

// 2. SSE 연결
import { createSSEConnection } from '@/modules/logging/apis/logSSEApi';

const sseConnection = createSSEConnection('/logs/stream', {
  onMessage: (data) => console.log('New log:', data),
  onError: (error) => console.error('SSE Error:', error)
});

// 3. 인증이 필요한 API
import { useAuthStore } from '@/modules/auth/stores/authStore';

const { token } = useAuthStore();
const response = await apiClient.get('/protected-endpoint', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## 🚀 배포

### 개발 환경 배포

```bash
# 1. 개발 빌드 생성
eas build --profile development --platform all

# 2. 내부 테스터에게 배포
eas submit --profile development --platform ios
eas submit --profile development --platform android
```

### 프로덕션 배포

```bash
# 1. 버전 업데이트
npm version patch  # 또는 minor, major

# 2. 프로덕션 빌드
eas build --profile production --platform all

# 3. 스토어 제출
eas submit --profile production --platform ios
eas submit --profile production --platform android

# 4. OTA 업데이트 (긴급 수정 시)
eas update --branch production --message "Fix critical bug"
```

### CI/CD 파이프라인

```yaml
# .github/workflows/build.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Build for production
        if: github.ref == 'refs/heads/main'
        run: eas build --profile production --non-interactive
```

## ⚡ 성능 최적화

### 메모리 관리

```typescript
// 1. SSE 연결 정리
useEffect(() => {
  const connection = createSSEConnection(endpoint, handlers);
  
  return () => {
    connection.close(); // 컴포넌트 언마운트 시 연결 해제
  };
}, []);

// 2. 큰 리스트 가상화
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={logs}
  renderItem={({ item }) => <LogItem item={item} />}
  estimatedItemSize={100}
  removeClippedSubviews={true}
/>

// 3. 이미지 최적화
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  placeholder={placeholderUri}
  contentFit="cover"
  cachePolicy="memory-disk"
/>
```

### 번들 크기 최적화

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tree shaking 활성화
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// 불필요한 파일 제외
config.resolver.blacklistRE = /node_modules\/.*\/(docs|test|example)\/.*/;

module.exports = config;
```

### 상태 관리 최적화

```typescript
// Zustand 슬라이스 분리
export const useAlertStore = create<AlertState>()(
  subscribeWithSelector((set, get) => ({
    alerts: [],
    unreadCount: 0,
    
    // 계산된 값 최적화
    get filteredAlerts() {
      return get().alerts.filter(alert => !alert.isRead);
    }
  }))
);

// 선택적 구독
const unreadCount = useAlertStore(state => state.unreadCount);
const markAsRead = useAlertStore(state => state.markAsRead);
```

## 🔧 트러블슈팅

### 자주 발생하는 문제들

#### 1. SSE 연결 문제

**증상**: 실시간 데이터가 수신되지 않음

**해결방법**:
```typescript
// 연결 상태 확인
const checkSSEConnection = () => {
  if (sseConnection.readyState === EventSource.CLOSED) {
    // 재연결 시도
    reconnectSSE();
  }
};

// 자동 재연결 로직
const reconnectSSE = () => {
  setTimeout(() => {
    createSSEConnection(endpoint, handlers);
  }, 5000);
};
```

#### 2. 인증 토큰 만료

**증상**: API 호출 시 401 에러

**해결방법**:
```typescript
// API 인터셉터에서 자동 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // 원래 요청 재시도
        return apiClient(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

#### 3. FCM 푸시 알림 수신 안됨

**증상**: 푸시 알림이 도착하지 않음

**해결방법**:
```bash
# 1. FCM 토큰 확인
npx expo install expo-notifications
npx expo run:ios --device  # 실제 기기에서 테스트

# 2. 권한 확인
const { status } = await Notifications.requestPermissionsAsync();
if (status !== 'granted') {
  // 권한 요청 다시 시도
}

# 3. Firebase 프로젝트 설정 확인
# - google-services.json 파일 존재 여부
# - Bundle ID/Package Name 일치 여부
```

#### 4. Android 빌드 오류

**증상**: `AAPT: error: resource android:attr/lStar not found`

**해결방법**:
```bash
# compileSdkVersion 업데이트
# android/app/build.gradle
android {
    compileSdkVersion 34
    targetSdkVersion 34
}

# Gradle Wrapper 업데이트
cd android && ./gradlew wrapper --gradle-version 8.0.1
```

#### 5. iOS 빌드 오류

**증상**: `Pod install` 실패

**해결방법**:
```bash
# CocoaPods 캐시 정리
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod setup
pod install

# Xcode 캐시 정리
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### 디버깅 도구

```typescript
// 1. Redux DevTools (Zustand)
import { devtools } from 'zustand/middleware';

export const useStore = create<State>()(
  devtools((set, get) => ({
    // store implementation
  }), {
    name: 'ssom-store'
  })
);

// 2. Network 디버깅
import { setupInterceptors } from '@/api/interceptors';

if (__DEV__) {
  setupInterceptors(); // 요청/응답 로깅
}

// 3. Flipper 통합
import { logger } from 'flipper-plugin-react-native-performance';

logger.debug('Performance metric', { metric: value });
```

### 로그 수집 및 모니터링

```typescript
// 에러 리포팅
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});

// 커스텀 에러 처리
const handleError = (error: Error, context: string) => {
  if (__DEV__) {
    console.error(`[${context}]`, error);
  } else {
    Sentry.captureException(error, {
      tags: { context }
    });
  }
};
```

## 🤝 기여하기

### 기여 절차

1. **이슈 생성**
   - 버그 리포트 또는 기능 제안 이슈 생성
   - 템플릿에 따라 상세한 정보 제공

2. **개발 환경 설정**
   ```bash
   git clone <your-fork>
   cd ssom
   npm install
   npm run type-check
   ```

3. **브랜치 생성**
   ```bash
   git checkout -b feature/your-feature-name
   git checkout -b fix/bug-description
   git checkout -b docs/documentation-update
   ```

4. **개발 및 테스트**
   ```bash
   # 개발 중 지속적인 검증
   npm run lint
   npm run type-check
   
   # 실제 기기에서 테스트
   npx expo start --tunnel
   ```

5. **Pull Request 생성**
   - 명확한 제목과 설명 작성
   - 변경 사항의 스크린샷 포함 (UI 변경 시)
   - 관련 이슈 번호 연결

### 코드 리뷰 가이드라인

**리뷰어를 위한 체크리스트:**
- [ ] 코드가 프로젝트 스타일 가이드를 따르는가?
- [ ] 새로운 기능에 대한 문서화가 충분한가?
- [ ] 에러 처리가 적절히 구현되었는가?
- [ ] 성능에 영향을 주는 변경사항이 있는가?
- [ ] 타입 안정성이 보장되는가?

**기여자를 위한 가이드:**
- 작은 단위로 PR을 나누어 제출
- 커밋 메시지를 명확하게 작성
- 새로운 의존성 추가 시 사전 논의
- Breaking change 시 마이그레이션 가이드 제공

### 브랜치 전략

```
main (production)
├── develop (integration)
│   ├── feature/user-management
│   ├── feature/notification-enhancement
│   └── fix/login-issue
├── hotfix/critical-bug-fix
└── release/v1.2.0
```

### 릴리즈 절차

1. **Feature Freeze**: `develop`에서 새 기능 개발 중단
2. **Release Branch**: `release/vX.Y.Z` 브랜치 생성
3. **Bug Fix**: 릴리즈 브랜치에서 버그 수정
4. **Testing**: QA 및 내부 테스트 진행
5. **Production**: `main` 브랜치로 머지 및 태그 생성
6. **Deploy**: 프로덕션 환경에 배포

---

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)에 따라 라이선스가 부여됩니다.

## 📞 지원 및 문의

- **개발팀**: dev-team@company.com
- **이슈 리포트**: [GitHub Issues](https://github.com/your-org/ssom/issues)
- **문서**: [프로젝트 위키](https://github.com/your-org/ssom/wiki)
- **Slack**: #ssom-dev 채널

---

**마지막 업데이트**: 2024년 12월
