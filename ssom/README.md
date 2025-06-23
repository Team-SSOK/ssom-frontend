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

**마지막 업데이트**: 2024년 12월
