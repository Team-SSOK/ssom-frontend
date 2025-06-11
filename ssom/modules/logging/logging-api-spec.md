# 📘 Logging API 문서

## 1. SSE 구독

- **Method**: `GET`
- **Endpoint**: `/api/logging/subscribe`
- **설명**: 서버에서 전송하는 실시간 로그 이벤트를 구독합니다. (SSE: Server-Sent Events)

---

## 2. 서비스 목록 조회

- **Method**: `GET`
- **Endpoint**: `/api/logging/services`
- **설명**: 로깅 대상이 되는 서비스 목록을 조회합니다.

### ✅ 응답 예시

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "services": [
      { "serviceName": "ssok-gateway-service", "count": 1334 },
      { "serviceName": "ssok-user-service", "count": 6 },
      { "serviceName": "ssok-account-service", "count": 2 }
    ]
  }
}
```

---

## 3. 로그 목록 조회

- **Method**: `GET`
- **Endpoint**: `/api/logging`
- **설명**: 필터 조건에 따라 수집된 로그 데이터를 조회합니다.

### 🔍 요청 쿼리 파라미터

| 매개변수 | 타입 | 필수 여부 | 설명 |
|----------|------|-----------|------|
| app      | String | false | 로그가 발생한 서비스 이름 (예: ssok-account-service) |
| level    | String | false | 로그 레벨 필터 (예: WARN, ERROR) |

### 📄 응답 예시 - 중복 처리 및 최신순 정렬 후

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "logs": [
      {
        "logId": "Pz_4OZcBEKdnQBbepWWz",
        "timestamp": "2025-06-04T08:04:46.033104672+00:00",
        "level": "ERROR",
        "logger": "kr.ssok.gateway.security.filter.JwtAuthenticationFilter",
        "thread": "reactor-http-epoll-1",
        "message": "Authentication error: Authorization header is missing or invalid",
        "app": "ssok-gateway-service"
      },
      {
        "logId": "vT8qOZcBEKdnQBbeZ1T0",
        "timestamp": "2025-06-04T04:18:30.664282298+00:00",
        "level": "WARN",
        "logger": "kr.ssok.accountservice.service.impl.AccountServiceImpl",
        "thread": "http-nio-8080-exec-4",
        "message": "[GET] Account not found: userId=51",
        "app": "ssok-account-service"
      },
      {
        "logId": "sz8qOZcBEKdnQBbeUlTj",
        "timestamp": "2025-06-04T04:18:20.086907305+00:00",
        "level": "ERROR",
        "logger": "kr.ssok.gateway.security.filter.JwtAuthenticationFilter",
        "thread": "reactor-http-epoll-2",
        "message": "Authentication error: Authorization header is missing or invalid",
        "app": "ssok-gateway-service"
      }
    ]
  }
}
```

### 📄 응답 예시 - 중복 처리 후

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "logs": [
      {
        "logId": "zz-TOJcBEKdnQBbe1kyE",
        "timestamp": "2025-06-04T01:33:56.702423353+00:00",
        "level": "ERROR",
        "logger": "kr.ssok.gateway.security.filter.JwtAuthenticationFilter",
        "thread": "reactor-http-epoll-4",
        "message": "Authentication error: Authorization header is missing or invalid",
        "app": "ssok-gateway-service"
      },
      {
        "logId": "vD8qOZcBEKdnQBbeZ1T0",
        "timestamp": "2025-06-04T04:18:28.196068611+00:00",
        "level": "WARN",
        "logger": "kr.ssok.accountservice.service.impl.AccountServiceImpl",
        "thread": "http-nio-8080-exec-3",
        "message": "[GET] Account not found: userId=51",
        "app": "ssok-account-service"
      },
      {
        "logId": "-T87OZcBEKdnQBbeNVWm",
        "timestamp": "2025-06-04T04:36:50.977245758+00:00",
        "level": "ERROR",
        "logger": "kr.ssok.gateway.security.filter.JwtAuthenticationFilter",
        "thread": "reactor-http-epoll-3",
        "message": "Authentication error: Authorization header is missing or invalid",
        "app": "ssok-gateway-service"
      }
    ]
  }
}
```

---

## <span style="color: blue">3-2. 로그 목록 조회 (무한 스크롤)</span>

- **Method**: `GET`
- **Endpoint**: `/api/logging`
- **설명**: 필터 조건에 따라 수집된 로그 데이터를 조회합니다.

### <span style="color: blue">📋 사용 설명</span>

- **목적**
    - OpenSearch 측으로부터 로그 목록을 가져옴. 현재는 가장 최신 로그부터 최대 <span style="color: blue">**100개**</span>를 가져오도록 설정해둠.
- **사용 시기**
    - 사용자가 로그 목록 화면에 들어왔을 때
    - 사용자가 필터링 조건을 변경했을 때
    - <span style="color: blue">**사용자가 스크롤 끝까지 도달했을 때**</span>

### 🔍 요청 쿼리 파라미터

| 매개변수 | 타입 | 필수 여부 | 설명 |
|----------|------|-----------|------|
| app      | String | false | 로그가 발생한 서비스 이름 (예: ssok-account-service) |
| level    | String | false | 로그 레벨 필터 (예: WARN, ERROR) |
| <span style="color: blue">**searchAfterTimestamp**</span> | String | false | <span style="color: blue">이전에 마지막으로 조회한 로그의 timestamp</span> |
| <span style="color: blue">**searchAfterId**</span> | String | false | <span style="color: blue">이전에 마지막으로 조회한 로그의 로그 ID</span> |

### 🔐 요청 헤더
```
Authorization: Bearer {accessToken}
```

### ✅ 성공 응답 예시

```json
{
    "isSuccess": true,
    "code": 2000,
    "message": "요청에 성공하였습니다.",
    "result": {
        "logs": [
            {
                "logId": "lj8nP5cBEKdnQBbeGJZP",
                "timestamp": "2025-06-05T08:13:28.652118686+00:00",
                "level": "ERROR",
                "logger": "kr.ssok.gateway.security.filter.JwtAuthenticationFilter",
                "thread": "reactor-http-epoll-1",
                "message": "Authentication error: Authorization header is missing or invalid",
                "app": "ssok-gateway-service"
            },
            {
                "logId": "LT8fP5cBEKdnQBbe45bK",
                "timestamp": "2025-06-05T08:04:42.078518420+00:00",
                "level": "WARN",
                "logger": "org.springframework.cloud.kubernetes.commons.config.ConfigUtils",
                "thread": "pool-6-thread-1",
                "message": "sourceName : ssok-notification-service-kubernetes was requested, but not found in namespace : ssok",
                "app": "ssok-notification-service"
            },
            {
                "logId": "Pz8fP5cBEKdnQBbe5ZYs",
                "timestamp": "2025-06-05T08:04:41.774698618+00:00",
                "level": "WARN",
                "logger": "org.springframework.cloud.kubernetes.commons.config.ConfigUtils",
                "thread": "pool-4-thread-1",
                "message": "sourceName : ssok-account-service-kubernetes was requested, but not found in namespace : ssok",
                "app": "ssok-account-service"
            }
        ],
        <span style="color: blue">**"lastTimestamp": "1749110545893",
        "lastLogId": "9D8dP5cBEKdnQBbeUJXN"**</span>
    }
}
```

### ❌ 실패 응답 예시

```json
{
    "isSuccess": false,
    "code": 8002,
    "message": "OpenSearch에서 로그 목록 조회에 실패했습니다."
}
```

---

## 4. 로그 상세 조회 - 기존 LLM 분석 조회 요청

### API 형식
```jsx
api/logging/{logId}
```

#### 요청

#### 응답

기존 분석이 존재하는 경우
```json
{
    "isSuccess": true,
    "code": 2000,
    "message": "요청에 성공하였습니다.",
    "result": {
        "summary": "userId에 해당하는 계좌가 존재하지 않아 AccountNotFound 예외 발생",
        "location": {
            "file": "AccountInternalServiceImpl.java",
            "function": "findAllAccountIds()"
        },
        "solution": "사용자 ID로 조회 시 계좌가 없으면 적절한 예외 처리와 함께 계좌 등록 여부를 확인하는 로직 추가 필요",
        "solution_detail": "1. AccountInternalServiceImpl.java 파일에서 findAllAccountIds(Long userId) 메서드 확인\n2. accountRepository.findByUserIdAndIsDeletedFalse(userId) 호출 결과가 빈 리스트일 경우 AccountException(AccountResponseStatus.ACCOUNT_NOT_FOUND) 예외를 발생시키는 현재 로직 유지\n3. 사용자에게 계좌가 없다는 명확한 메시지를 전달하도록 AccountResponseStatus.ACCOUNT_NOT_FOUND 상태 메시지 검토 및 필요 시 개선\n4. 사용자 계좌가 없을 경우를 대비해 프론트엔드 또는 호출 서비스에서 계좌 등록 유도 UI/로직 추가 권장\n5. 배포 전 단위 테스트 및 통합 테스트에서 사용자 계좌가 없을 때 예외가 정상 발생하는지 검증\n6. 운영 환경에서 동일 오류 발생 시 사용자 데이터 및 DB 상태 점검하여 계좌 데이터 누락 여부 확인\n7. 필요 시 사용자 계좌 데이터 생성 프로세스 점검 및 보완\n\n- 테스트 커맨드 예시:\n  ./gradlew test --tests \"kr.ssok.accountservice.service.impl.AccountInternalServiceImplTest.findAllAccountIds_Empty\"\n\n- 주의사항:\n  - 예외 메시지 및 상태 코드를 명확히 하여 호출 서비스가 적절히 대응할 수 있도록 할 것\n  - 사용자 ID가 올바른지, 계좌 데이터가 정상적으로 저장되고 있는지 DB 상태를 점검할 것"
    }
}
```

기존 분석이 존재하지 않는 경우
```json
{
    "isSuccess": false,
    "code": 8003,
    "message": "기존에 생성된 LLM 요약이 없습니다."
}
```

## 5. 로그 상세 조회 - LLM 로그 분석

### API 형식
```jsx
/api/logging
```

#### 요청
```json
{
    "logId": "vD8qOZcBEKdnQBbeZ1T0",
    "timestamp": "2025-06-04T04:18:28.196068611+00:00",
    "level": "WARN",
    "logger": "kr.ssok.accountservice.service.impl.AccountServiceImpl",
    "thread": "http-nio-8080-exec-3",
    "message": "[GET] Account not found: userId=51",
    "app": "ssok-account-service"
}
```

#### 응답
```json
{
    "isSuccess": true,
    "code": 2000,
    "message": "요청에 성공하였습니다.",
    "result": {
        "summary": "userId에 해당하는 계좌가 존재하지 않아 AccountNotFound 예외 발생",
        "location": {
            "file": "AccountInternalServiceImpl.java",
            "function": "findAllAccountIds()"
        },
        "solution": "사용자 ID로 조회 시 계좌가 없으면 적절한 예외 처리와 함께 계좌 등록 여부를 확인하는 로직 추가 필요",
        "solution_detail": "1. AccountInternalServiceImpl.java 파일에서 findAllAccountIds(Long userId) 메서드 확인\n2. accountRepository.findByUserIdAndIsDeletedFalse(userId) 호출 결과가 빈 리스트일 경우 AccountException(AccountResponseStatus.ACCOUNT_NOT_FOUND) 예외를 발생시키는 현재 로직 유지\n3. 사용자에게 계좌가 없다는 명확한 메시지를 전달하도록 AccountResponseStatus.ACCOUNT_NOT_FOUND 상태 메시지 검토 및 필요 시 개선\n4. 사용자 계좌가 없을 경우를 대비해 프론트엔드 또는 호출 서비스에서 계좌 등록 유도 UI/로직 추가 권장\n5. 배포 전 단위 테스트 및 통합 테스트에서 사용자 계좌가 없을 때 예외가 정상 발생하는지 검증\n6. 운영 환경에서 동일 오류 발생 시 사용자 데이터 및 DB 상태 점검하여 계좌 데이터 누락 여부 확인\n7. 필요 시 사용자 계좌 데이터 생성 프로세스 점검 및 보완\n\n- 테스트 커맨드 예시:\n  ./gradlew test --tests \"kr.ssok.accountservice.service.impl.AccountInternalServiceImplTest.findAllAccountIds_Empty\"\n\n- 주의사항:\n  - 예외 메시지 및 상태 코드를 명확히 하여 호출 서비스가 적절히 대응할 수 있도록 할 것\n  - 사용자 ID가 올바른지, 계좌 데이터가 정상적으로 저장되고 있는지 DB 상태를 점검할 것"
    }
}
```

## 6. 로그 상세 조회 (`/api/logging/{logId}`)

- **Method**: `GET`
- **Endpoint**: `/api/logging/{logId}`
- **설명**: 특정 로그 ID로 로그의 상세 정보를 조회합니다.
- **사용 시기**: 이슈 상세 화면에서 특정 로그 항목을 탭했을 때 사용

### 🔐 요청 헤더
```
Authorization: Bearer {accessToken}
```

### ✅ 성공 응답 예시

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "logId": "Pj8fP5cBEKdnQBbe5ZYm",
    "timestamp": "2025-06-05T08:04:41.747062879+00:00",
    "level": "WARN",
    "logger": "org.springframework.cloud.kubernetes.commons.config.ConfigUtils",
    "thread": "pool-4-thread-1",
    "message": "sourceName : ssok-user-service-kubernetes was requested, but not found in namespace : ssok",
    "app": "ssok-user-service"
  }
}
```

### ❌ 실패 응답 예시

```json
{
  "isSuccess": false,
  "code": 8006,
  "message": "로그 ID로 로그를 조회하는 데 실패했습니다."
}
```