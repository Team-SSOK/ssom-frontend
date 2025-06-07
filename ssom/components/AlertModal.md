# AlertModal 컴포넌트

SSOM 앱을 위한 커스텀 모달 컴포넌트입니다. React Native Paper의 Portal과 Dialog를 활용하여 Alert.alert을 대체하며, Material Design 3 가이드라인에 따라 구현되었습니다.

## 주요 특징

- 🎨 **SSOM 앱 디자인 시스템과 일관성**
- 📱 **Material Design 3 준수**
- 🔧 **Alert.alert 완전 호환**
- 🌙 **다크/라이트 테마 지원**
- ⚡ **TypeScript 완전 지원**
- 🎯 **사용하기 쉬운 Hook API**

## 기본 사용법

### 1. Hook 사용 (권장)

```tsx
import React from 'react';
import { View } from 'react-native';
import { useAlertModal } from '@/components';

export default function MyComponent() {
  const { alert, confirm, success, error, warning, AlertModal } = useAlertModal();

  const handleAction = () => {
    alert('알림', '메시지입니다.');
  };

  return (
    <View>
      {/* 여기에 컴포넌트 내용 */}
      
      {/* AlertModal 컴포넌트를 렌더링 (필수) */}
      <AlertModal />
    </View>
  );
}
```

### 2. 직접 컴포넌트 사용

```tsx
import React, { useState } from 'react';
import { AlertModal } from '@/components';

export default function MyComponent() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* 여기에 컴포넌트 내용 */}
      
      <AlertModal
        visible={visible}
        title="제목"
        message="메시지"
        actions={[
          { text: '취소', style: 'cancel', onPress: () => setVisible(false) },
          { text: '확인', style: 'default', onPress: () => setVisible(false) },
        ]}
        onDismiss={() => setVisible(false)}
      />
    </>
  );
}
```

## API 레퍼런스

### useAlertModal Hook

#### 반환값

| 이름 | 타입 | 설명 |
|------|------|------|
| `AlertModal` | `React.ComponentType` | 렌더링할 모달 컴포넌트 |
| `alert` | `function` | Alert.alert과 호환되는 함수 |
| `confirm` | `function` | 확인/취소 다이얼로그 |
| `success` | `function` | 성공 메시지 표시 |
| `error` | `function` | 오류 메시지 표시 |
| `warning` | `function` | 경고 메시지 표시 |
| `showAlert` | `function` | 커스텀 알림 표시 |
| `hideAlert` | `function` | 알림 숨기기 |
| `isVisible` | `boolean` | 모달 표시 상태 |

#### 메서드 상세

##### alert(title, message?, buttons?, options?)

Alert.alert과 완전 호환되는 메서드입니다.

```tsx
alert('제목', '메시지', [
  { text: '취소', style: 'cancel' },
  { text: '확인', style: 'default', onPress: () => console.log('확인됨') }
], { cancelable: false });
```

##### confirm(title, message?, onConfirm?, onCancel?)

간단한 확인/취소 다이얼로그를 표시합니다.

```tsx
confirm(
  '삭제 확인',
  '정말로 삭제하시겠습니까?',
  () => console.log('삭제됨'),
  () => console.log('취소됨')
);
```

##### success(title, message?, onPress?)

성공 아이콘과 함께 메시지를 표시합니다.

```tsx
success('완료', '작업이 성공적으로 완료되었습니다.');
```

##### error(title, message?, onPress?)

오류 아이콘과 함께 메시지를 표시합니다.

```tsx
error('오류', '작업 중 오류가 발생했습니다.');
```

##### warning(title, message?, onPress?)

경고 아이콘과 함께 메시지를 표시합니다.

```tsx
warning('주의', '이 작업은 되돌릴 수 없습니다.');
```

### AlertModal Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `visible` | `boolean` | - | 모달 표시 여부 |
| `title` | `string` | - | 모달 제목 |
| `message` | `string` | - | 모달 메시지 |
| `icon` | `string` | - | Material Design 아이콘 이름 |
| `actions` | `AlertAction[]` | `[]` | 액션 버튼 배열 |
| `onDismiss` | `function` | - | 모달 해제 시 호출 |
| `dismissable` | `boolean` | `true` | 모달 외부 클릭으로 해제 가능 여부 |

### AlertAction 인터페이스

```tsx
interface AlertAction {
  text: string;                          // 버튼 텍스트
  onPress?: () => void;                  // 버튼 클릭 시 호출
  style?: 'default' | 'cancel' | 'destructive';  // 버튼 스타일
}
```

#### 버튼 스타일

- **`default`**: 기본 스타일 (파란색)
- **`cancel`**: 취소 스타일 (회색 테두리)
- **`destructive`**: 위험 작업 스타일 (빨간색)

## 사용 예시

### 기본 알림

```tsx
const { alert } = useAlertModal();

alert('알림', '메시지입니다.');
```

### 확인/취소 다이얼로그

```tsx
const { confirm } = useAlertModal();

confirm(
  '삭제 확인',
  '이 항목을 삭제하시겠습니까?',
  () => {
    // 삭제 로직
    console.log('삭제됨');
  },
  () => {
    console.log('취소됨');
  }
);
```

### 복수 버튼

```tsx
const { alert } = useAlertModal();

alert('옵션 선택', '어떤 작업을 수행하시겠습니까?', [
  { text: '취소', style: 'cancel' },
  { text: '저장', style: 'default', onPress: () => saveData() },
  { text: '삭제', style: 'destructive', onPress: () => deleteData() },
]);
```

### 상태별 알림

```tsx
const { success, error, warning } = useAlertModal();

// 성공
success('완료', '데이터가 저장되었습니다.');

// 오류
error('오류', '네트워크 연결을 확인해주세요.');

// 경고
warning('주의', '이 작업은 되돌릴 수 없습니다.');
```

### 비해제 모달

```tsx
const { alert } = useAlertModal();

alert(
  '중요한 알림',
  '반드시 응답이 필요합니다.',
  [{ text: '확인', style: 'default' }],
  { cancelable: false }  // 외부 클릭으로 해제 불가
);
```

## Alert.alert에서 마이그레이션

기존 `Alert.alert` 코드를 쉽게 마이그레이션할 수 있습니다:

```tsx
// Before
import { Alert } from 'react-native';

Alert.alert('제목', '메시지', [
  { text: '취소', style: 'cancel' },
  { text: '확인', onPress: () => console.log('확인') }
]);

// After
import { useAlertModal } from '@/components';

const { alert, AlertModal } = useAlertModal();

alert('제목', '메시지', [
  { text: '취소', style: 'cancel' },
  { text: '확인', onPress: () => console.log('확인') }
]);

// JSX에 AlertModal 컴포넌트 추가
return (
  <View>
    {/* 기존 컴포넌트 */}
    <AlertModal />
  </View>
);
```

## 테마 커스터마이징

AlertModal은 SSOM 앱의 테마 시스템을 자동으로 따릅니다:

- 다크/라이트 모드 자동 지원
- 앱의 색상 팔레트 사용
- Material Design 3 타이포그래피 적용

## 주의사항

1. **AlertModal 컴포넌트 렌더링 필수**: `useAlertModal` Hook을 사용할 때는 반드시 `<AlertModal />` 컴포넌트를 JSX에 포함해야 합니다.

2. **React Native Paper 필수**: 이 컴포넌트는 `react-native-paper`가 설치되어 있어야 합니다.

3. **PaperProvider 필요**: 앱의 최상위에 `PaperProvider`로 감싸져 있어야 합니다.

## 관련 컴포넌트

- [Button](./Button.tsx) - SSOM 앱의 기본 버튼 컴포넌트
- [Toast](../hooks/useToast.ts) - 간단한 알림을 위한 토스트 시스템 