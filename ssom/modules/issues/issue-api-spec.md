# Issue API Specification

## 1. LLM Issue 초안 작성

**Endpoint**: `POST /api/issues/draft`

**설명**: 선택한 로그들을 LLM으로 분석하여 GitHub Issue 초안을 자동 생성합니다.

### 요청 헤더

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### 요청 본문

```json
{
  "logIds": ["log_001", "log_002"],
  "additionalContext": "운영 환경에서 발생한 오류입니다."
}
```

### 요청 필드

| 필드명             | 타입          | 필수 | 제약사항  | 설명                          |
| ------------------ | ------------- | ---- | --------- | ----------------------------- |
| logIds             | List\<String\> | Y    | 1-10개    | 분석할 로그 ID 목록            |
| additionalContext  | String        | N    | -         | 추가 컨텍스트 정보             |

### 응답

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "log": [
      {
        "level": "ERROR",
        "logger": "kr.ssok.ssom.backend.security.JwtAuthenticationFilter",
        "thread": "http-nio-8080-exec-1",
        "message": "Authentication error: Authorization header is missing or invalid",
        "app": "ssom-backend"
      }
    ],
    "message": {
      "title": "hotfix: Authorization 헤더 누락 시 인증 오류 발생",
      "description": "운영 환경에서 Authorization 헤더가 없거나 형식이 잘못된 요청에 대해 인증 실패 처리가 제대로 이루어지지 않는 문제가 발생하고 있습니다.",
      "location": {
        "file": "JwtAuthenticationFilter.java",
        "function": "filter()"
      },
      "cause": "Authorization 헤더가 없거나 'Bearer ' 접두어가 없으면 인증 실패 처리로 바로 응답을 종료함",
      "reproduction_steps": [
        "1. Authorization 헤더 없이 API 요청",
        "2. 또는 Bearer 접두어 없이 토큰만 전송",
        "3. 인증 오류 응답 확인"
      ],
      "log": "Authentication error: Authorization header is missing or invalid",
      "solution": "클라이언트 요청 시 Authorization 헤더가 반드시 포함되도록 요청 검증 강화",
      "references": "JwtAuthenticationFilter.java, JwtAuthenticationEntryPoint.java"
    }
  }
}
```

### 응답 상태 코드

- `200`: 성공
- `400`: 잘못된 요청 (로그 ID 없음 등)
- `401`: 인증되지 않은 사용자
- `500`: LLM API 호출 실패
