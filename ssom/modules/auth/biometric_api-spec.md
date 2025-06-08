# 생체인증 API 문서

## 1. 생체인증 상태 확인

특정 사원의 생체인증 등록 상태를 확인합니다.

**Endpoint**

```
GET /biometric/status/{employeeId}
```

**Path Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| employeeId | string | 필수 | 사원 ID |

**Response**

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "isRegistered": true,
    "availableTypes": ["FINGERPRINT", "FACE"],
    "deviceCount": 2,
    "lastUsedAt": "2024-01-15T10:30:00"
  }
}
```

**Status Codes**

- `200`: 성공
- `404`: 사용자를 찾을 수 없음

## 2. 생체인증 등록 🔒

새로운 생체인증을 등록합니다.

**Endpoint**

```
POST /biometric/register
```

**Headers**

```
Authorization: Bearer your-access-token
```

**Request Body**

```json
{
  "biometricType": "FINGERPRINT",
  "deviceId": "device-unique-id-12345",
  "biometricHash": "hashed-biometric-data",
  "deviceInfo": "Samsung Galaxy S23, Android 13"
}
```

**Request Fields**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| biometricType | string | 필수 | 생체인증 타입 (FINGERPRINT, FACE, VOICE) |
| deviceId | string | 필수 | 디바이스 고유 ID |
| biometricHash | string | 필수 | 해시된 생체 데이터 |
| deviceInfo | string | 선택 | 디바이스 정보 |

**Response**

```json
{
  "isSuccess": true,
  "code": 2001,
  "message": "생성되었습니다.",
  "result": {
    "success": true,
    "message": "생체인증 등록이 완료되었습니다.",
    "biometricId": 123,
    "errorCode": null,
    "remainingAttempts": null
  }
}
```

**Status Codes**

- `201`: 성공
- `400`: 잘못된 요청 (이미 등록된 생체인증 등)
- `401`: 인증되지 않은 요청

## 3. 생체인증 로그인

생체인증을 사용하여 로그인합니다.

**Endpoint**

```
POST /biometric/login
```

**Request Body**

```json
{
  "employeeId": "EMP001",
  "biometricType": "FINGERPRINT",
  "deviceId": "device-unique-id-12345",
  "biometricHash": "hashed-biometric-data",
  "timestamp": 1705319400000,
  "challengeResponse": "optional-challenge-response",
  "deviceFingerprint": "optional-device-fingerprint"
}
```

**Request Fields**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| employeeId | string | 필수 | 사원 ID |
| biometricType | string | 필수 | 생체인증 타입 |
| deviceId | string | 필수 | 디바이스 고유 ID |
| biometricHash | string | 필수 | 해시된 생체 데이터 |
| timestamp | number | 필수 | 타임스탬프 |
| challengeResponse | string | 선택 | 챌린지 응답 |
| deviceFingerprint | string | 선택 | 디바이스 핑거프린트 |

**Response**

```json
{
  "isSuccess": true,
  "code": 2003,
  "message": "로그인에 성공하였습니다.",
  "result": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "username": "홍길동",
    "department": "개발팀",
    "expiresIn": 3600,
    "biometricEnabled": true,
    "lastLoginAt": "2024-01-15T10:30:00"
  }
}
```

**Status Codes**

- `200`: 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `423`: 최대 시도 횟수 초과

## 4. 생체인증 해제

등록된 생체인증을 해제합니다.

**Endpoint**

```
DELETE /biometric/deactivate
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| employeeId | string | 필수 | 사원 ID |
| deviceId | string | 필수 | 디바이스 고유 ID |
| biometricType | string | 필수 | 생체인증 타입 |

**Example Request**

```
DELETE /biometric/deactivate?employeeId=EMP001&deviceId=device-unique-id-12345&biometricType=FINGERPRINT
```

**Response**

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "success": true,
    "message": "생체인증이 해제되었습니다.",
    "biometricId": null,
    "errorCode": null,
    "remainingAttempts": null
  }
}
```

**Status Codes**

- `200`: 성공
- `400`: 잘못된 요청
- `404`: 생체인증 정보를 찾을 수 없음

## 생체인증 플로우차트

```mermaid
flowchart TD
    A[앱 시작] --> B[스플래시 스크린]
    B --> C{생체인증 지원 여부}
    
    C -->|지원 안함| D[일반 로그인 화면으로 이동]
    C -->|지원함| E[생체인증 상태 확인\nGET /biometric/status/employeeId]
    
    E --> F{저장된 사용자 정보 있음?}
    F -->|없음| G[일반 로그인 화면으로 이동]
    F -->|있음| H{등록된 생체인증 있음?}
    
    H -->|없음| I[일반 로그인 화면으로 이동]
    H -->|있음| J[생체인증 로그인 화면 표시\n지문/얼굴 인식 UI]
    
    %% 생체인증 로그인 플로우
    J --> K[생체인증 로그인 시도\nPOST /biometric/login]
    K --> L{인증 성공?}
    L -->|성공| M[메인 화면 이동]
    L -->|실패| N{시도 횟수 초과?}
    
    N -->|초과| O[30분 대기 안내\n또는 일반 로그인 제안]
    N -->|미초과| P[재시도 또는\n일반 로그인 선택]
    
    P -->|재시도| J
    P -->|일반 로그인| Q[일반 로그인 화면]
    O -->|일반 로그인| Q
    
    %% 일반 로그인 플로우  
    D --> Q
    G --> Q
    I --> Q
    
    Q --> R[사원번호/비밀번호 입력\nPOST /users/login]
    R --> S{로그인 성공?}
    S -->|실패| T[에러 메시지 표시]
    T --> Q
    
    S -->|성공| U{생체인증 지원 디바이스?}
    U -->|지원 안함| M
    U -->|지원함| V[생체인증 등록 안내 팝업\n더 편리한 로그인을 위해\n생체인증을 등록하시겠습니까?]
    
    V -->|나중에 하기| M
    V -->|등록하기| W[생체인증 타입 선택\n지문/얼굴/음성]
    
    W --> X[생체 데이터 캡처\n디바이스별 생체인증 UI]
    X --> Y[생체인증 등록\nPOST /biometric/register]
    
    Y --> Z{등록 성공?}
    Z -->|성공| AA[등록 완료 안내\n다음 로그인부터 생체인증을\n사용할 수 있습니다]
    Z -->|실패| BB[등록 실패 안내\n다시 시도 또는 건너뛰기]
    
    AA --> M
    BB -->|다시 시도| W
    BB -->|건너뛰기| M
    
    %% 스타일링
    classDef startNode fill:#e1f5fe
    classDef processNode fill:#f3e5f5
    classDef decisionNode fill:#fff3e0
    classDef endNode fill:#e8f5e8
    classDef errorNode fill:#ffebee
    
    class A,B startNode
    class E,J,K,R,W,X,Y processNode
    class C,F,H,L,N,S,U,V,Z decisionNode
    class M endNode
    class T,O,BB errorNode
```

## Expo 개발 시 고려사항

### 1. 생체인증 라이브러리
- **expo-local-authentication**: Expo에서 제공하는 생체인증 라이브러리
- **expo-secure-store**: 민감한 데이터 저장용

### 2. 생체인증 타입 지원
- **iOS**: Touch ID, Face ID
- **Android**: Fingerprint, Face Unlock, Iris

### 3. 보안 고려사항
- 생체 데이터는 절대 원본 저장 금지
- 해시된 데이터만 서버 전송
- 디바이스 고유 ID 활용
- 타임스탬프 기반 재전송 공격 방지