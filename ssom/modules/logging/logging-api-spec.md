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

---

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
