# 📡 Notification Module

FCM API 스펙을 기반으로 한 expo-notifications를 활용한 푸시 알림 시스템입니다.

## ✨ 주요 기능

- 🔔 **FCM 토큰 자동 등록**: 서버에 FCM 토큰 자동 등록 및 관리
- 📱 **로컬 알림**: 즉시 표시 및 스케줄링된 알림
- 🔗 **딥링크 지원**: 알림 클릭 시 특정 화면으로 자동 이동  
- 🎨 **알림 채널**: Android 알림 채널 자동 설정
- 🔴 **배지 카운트**: iOS/Android 앱 아이콘 배지 관리
- ⚙️ **권한 관리**: 알림 권한 요청 및 상태 추적

## 📁 파일 구조

```
modules/notifications/
├── types/
│   └── index.ts          # 타입 정의
├── apis/
│   └── notificationApi.ts # FCM API 서비스
├── services/
│   └── notificationService.ts # 핵심 알림 서비스
├── hooks/
│   └── useNotifications.ts # React Hook
├── utils/
│   └── notificationHelpers.ts # 유틸리티 함수
└── README.md
```

## 🚀 설치 및 설정

### 1. Dependencies 확인

필요한 패키지들이 이미 설치되어 있는지 확인:

```bash
npm list expo-notifications expo-device expo-constants
```

### 2. app.json 설정

```json
{
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/images/notification-icon.png",
        "color": "#ffffff",
        "defaultChannel": "default",
        "enableBackgroundRemoteNotifications": true
      }
    ]
  ]
}
```

### 3. Google Services 설정

Android용 `google-services.json` 파일을 프로젝트 루트에 배치하세요.

## 💻 사용법

### 기본 사용법

```tsx
import { useNotifications } from '@/modules/notifications';

function MyComponent() {
  const {
    status,
    tokenData,
    isLoading,
    error,
    scheduleLocalNotification,
    setBadgeCount,
  } = useNotifications({
    autoInitialize: true,
    enableDeepLinking: true,
    onNotificationReceived: (notification) => {
      console.log('알림 수신:', notification.request.content.title);
    },
    onNotificationResponse: (response) => {
      console.log('알림 클릭:', response.notification.request.content.title);
    },
  });

  // 로컬 알림 전송
  const sendNotification = async () => {
    await scheduleLocalNotification(
      '테스트 알림',
      '알림 내용입니다.',
      { type: 'general', url: '/(app)/(tabs)' }
    );
  };

  return (
    <View>
      <Text>상태: {status.isInitialized ? '초기화됨' : '미초기화'}</Text>
      <Button title="알림 전송" onPress={sendNotification} />
    </View>
  );
}
```

### 서비스 직접 사용

```tsx
import { NotificationService } from '@/modules/notifications';

const service = NotificationService.getInstance();

// 초기화
await service.initialize();

// 로컬 알림 스케줄링
await service.scheduleLocalNotification({
  title: '긴급 알림',
  body: 'CPU 사용률이 높습니다.',
  data: { type: 'alert', url: '/(app)/(tabs)/alerts' }
});
```

### 유틸리티 함수 활용

```tsx
import {
  createAlertNotification,
  createDelayedTrigger,
  calculateBadgeCount
} from '@/modules/notifications';

// 긴급 알림 생성
const alertNotif = createAlertNotification(
  'CPU 과부하',
  'CPU 사용률이 90%를 초과했습니다.',
  'alert-123'
);

// 5초 후 알림
const trigger = createDelayedTrigger(5);

// 배지 카운트 계산
const badgeCount = calculateBadgeCount(3, 2); // 미읽은 알림 5개
```

## 🔧 API 레퍼런스

### useNotifications Hook

#### Options
- `autoInitialize?: boolean` - 자동 초기화 여부 (기본값: true)
- `enableDeepLinking?: boolean` - 딥링크 활성화 여부 (기본값: true)
- `onNotificationReceived?: (notification) => void` - 알림 수신 콜백
- `onNotificationResponse?: (response) => void` - 알림 클릭 콜백
- `onDeepLink?: (url) => void` - 딥링크 처리 콜백

#### Return Values
- `status` - 서비스 상태 정보
- `tokenData` - 토큰 데이터 (Native Device Token)
- `isLoading` - 로딩 상태
- `error` - 에러 정보
- `initialize()` - 수동 초기화
- `refresh()` - 서비스 새로고침
- `cleanup()` - 서비스 정리
- `scheduleLocalNotification()` - 로컬 알림 스케줄링
- `setBadgeCount()` - 배지 카운트 설정
- `requestPermissions()` - 권한 요청

### NotificationService

#### 주요 메서드
- `initialize()` - 서비스 초기화
- `getStatus()` - 현재 상태 조회
- `getTokenData()` - 토큰 데이터 조회
- `scheduleLocalNotification()` - 로컬 알림 스케줄링
- `setBadgeCount()` - 배지 카운트 설정
- `cleanup()` - 서비스 정리

## 🔐 FCM API 연동

### 토큰 등록

서비스 초기화 시 자동으로 FCM 토큰이 서버에 등록됩니다:

```
POST /api/fcm/register
Headers: X-User-Id, Content-Type: application/json
Body: { "fcmToken": "device_fcm_token" }
```

### 토큰 해제

앱 정리 시 자동으로 FCM 토큰이 서버에서 해제됩니다:

```
DELETE /api/fcm/unregister
Headers: X-User-Id, Content-Type: application/json
Body: { "fcmToken": "device_fcm_token" }
```

## 🎨 알림 타입

### Alert (긴급 알림)
- 채널: `alerts`
- 중요도: `MAX`
- 아이콘: 🚨
- 용도: 시스템 경고, 장애 알림

### System (시스템 알림)
- 채널: `system`
- 중요도: `HIGH`
- 아이콘: ⚙️
- 용도: 앱 업데이트, 시스템 상태

### General (일반 알림)
- 채널: `default`
- 중요도: `DEFAULT`
- 용도: 일반적인 정보성 알림

## 🔗 딥링크

알림 클릭 시 앱 내 특정 화면으로 이동:

```tsx
{
  data: {
    url: '/(app)/(tabs)/alerts?alertId=123'
  }
}
```

지원되는 경로:
- `/(app)/(tabs)` - 메인 화면
- `/(app)/(tabs)/alerts` - 알림 목록
- `/(app)/(tabs)/alerts?alertId=123` - 특정 알림
- `/(app)/(tabs)/profile` - 프로필

## 🛠️ 개발 팁

### 테스트 컴포넌트 사용

```tsx
import NotificationExamples from '@/modules/notifications/examples/NotificationExamples';

// 개발 중인 화면에서 테스트
<NotificationExamples />
```

### 디버깅

```tsx
const { status, error } = useNotifications();

console.log('알림 서비스 상태:', status);
if (error) {
  console.error('알림 오류:', error.message);
}
```

### 권한 확인

```tsx
const { requestPermissions } = useNotifications();

const checkPermissions = async () => {
  const granted = await requestPermissions();
  if (!granted) {
    // 권한 거부 시 처리
    Alert.alert('알림 권한이 필요합니다.');
  }
};
```

## 📱 플랫폼별 고려사항

### iOS
- 배지 카운트 자동 지원
- 알림 설정이 시스템 설정과 연동

### Android
- 알림 채널 자동 생성
- `google-services.json` 필수
- 백그라운드 제한 고려

## ⚠️ 주의사항

1. **물리적 디바이스**: 푸시 알림은 실제 디바이스에서만 동작
2. **권한 요청**: 최초 실행 시 사용자 동의 필요
3. **토큰 갱신**: FCM 토큰은 주기적으로 갱신될 수 있음
4. **메모리 관리**: 리스너 정리를 위해 cleanup 함수 호출

## 🔄 라이프사이클

```
앱 시작 → 권한 요청 → 토큰 획득 → 서버 등록 → 알림 수신 준비
     ↓
앱 종료 → 토큰 해제 → 리스너 정리 → 상태 초기화
```

---

더 자세한 정보는 [Expo Notifications 공식 문서](https://docs.expo.dev/versions/latest/sdk/notifications/)를 참고하세요. 