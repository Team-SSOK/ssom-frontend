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

## 2. GitHub Issue 생성

**Endpoint**: `POST /api/issues/github`

**설명**: LLM이 작성한 초안을 바탕으로 실제 GitHub Repository에 Issue를 생성합니다.

### 요청 헤더

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### 요청 본문

```json
{
  "title": "hotfix: Authorization 헤더 누락 시 인증 오류 발생",
  "description": "운영 환경에서 Authorization 헤더가 없거나 형식이 잘못된 요청에 대해...",
  "logIds": ["log_001", "log_002"],
  "assigneeUsernames": ["홍길동", "김철수"],
  "cause": "Authorization 헤더가 없거나...",
  "solution": "클라이언트 요청 시 Authorization 헤더가...",
  "reproductionSteps": [
    "1. Authorization 헤더 없이 API 요청",
    "2. 또는 Bearer 접두어 없이 토큰만 전송"
  ],
  "references": "JwtAuthenticationFilter.java, JwtAuthenticationEntryPoint.java",
  "locationFile": "JwtAuthenticationFilter.java",
  "locationFunction": "filter()"
}
```

### 요청 필드

| 필드명              | 타입          | 필수 | 제약사항  | 설명                    |
| ------------------- | ------------- | ---- | --------- | ----------------------- |
| title               | String        | Y    | 최대 255자 | Issue 제목              |
| description         | String        | Y    | -         | Issue 설명              |
| logIds              | List\<String\> | Y    | 1-10개    | 로그 ID 목록            |
| assigneeUsernames   | List\<String\> | N    | -         | 담당자 사용자명 목록      |
| cause               | String        | N    | -         | 원인 분석 (LLM 생성)     |
| solution            | String        | N    | -         | 해결 방안 (LLM 생성)     |
| reproductionSteps   | List\<String\> | N    | -         | 재현 단계 (LLM 생성)     |
| references          | String        | N    | -         | 참조 파일들 (LLM 생성)    |
| locationFile        | String        | N    | -         | 오류 위치 파일명          |
| locationFunction    | String        | N    | -         | 오류 위치 함수명          |

### 응답

```json
{
  "isSuccess": true,
  "code": 2001,
  "message": "생성되었습니다.",
  "result": {
    "issueId": 1,
    "githubIssueNumber": 123,
    "title": "hotfix: Authorization 헤더 누락 시 인증 오류 발생",
    "description": "운영 환경에서 Authorization 헤더가 없거나...",
    "status": "OPEN",
    "createdByEmployeeId": "APP0001",
    "assigneeGithubIds": ["github_user1", "github_user2"],
    "logIds": ["log_001", "log_002"],
    "isGithubSynced": true,
    "createdAt": "2025-05-30T10:00:00",
    "updatedAt": "2025-05-30T10:00:00"
  }
}
```

### 응답 상태 코드

- `201`: 생성 성공
- `400`: 잘못된 요청 (필수 필드 누락 등)
- `401`: 인증되지 않은 사용자
- `500`: GitHub API 호출 실패

## 3. 내가 담당자로 지정된 Issue 목록 조회

**Endpoint**: `GET /api/issues/my`

**설명**: 현재 로그인한 사용자가 담당자로 지정된 Issue 목록을 조회합니다.

### 요청 헤더

```
Authorization: Bearer {JWT_TOKEN}
```

### 응답

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": [
    {
      "issueId": 1,
      "githubIssueNumber": 123,
      "title": "hotfix: Authorization 헤더 누락 시 인증 오류 발생",
      "description": "운영 환경에서 Authorization 헤더가 없거나...",
      "status": "OPEN",
      "createdByEmployeeId": "APP0001",
      "assigneeGithubIds": ["github_user1"],
      "logIds": ["log_001", "log_002"],
      "isGithubSynced": true,
      "createdAt": "2025-05-30T10:00:00",
      "updatedAt": "2025-05-30T10:30:00"
    }
  ]
}
```

### 응답 상태 코드

- `200`: 조회 성공
- `401`: 인증되지 않은 사용자
- `500`: 서버 내부 오류

## 4. 전체 Issue 목록 조회

**Endpoint**: `GET /api/issues`

**설명**: 팀에서 공유하는 전체 Issue 목록을 조회합니다.

### 요청 헤더

```
Authorization: Bearer {JWT_TOKEN}
```

### 응답

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": [
    {
      "issueId": 1,
      "githubIssueNumber": 123,
      "title": "hotfix: Authorization 헤더 누락 시 인증 오류 발생",
      "description": "운영 환경에서 Authorization 헤더가 없거나...",
      "status": "OPEN",
      "createdByEmployeeId": "APP0001",
      "assigneeGithubIds": ["github_user1", "github_user2"],
      "logIds": ["log_001", "log_002"],
      "isGithubSynced": true,
      "createdAt": "2025-05-30T10:00:00",
      "updatedAt": "2025-05-30T10:30:00"
    },
    {
      "issueId": 2,
      "githubIssueNumber": null,
      "title": "Database connection timeout",
      "description": "데이터베이스 연결 시간 초과 오류가 발생하고 있습니다.",
      "status": "CLOSED",
      "createdByEmployeeId": "APP0002",
      "assigneeGithubIds": [],
      "logIds": ["log_003"],
      "isGithubSynced": false,
      "createdAt": "2025-05-29T14:00:00",
      "updatedAt": "2025-05-30T09:00:00"
    }
  ]
}
```

### 응답 상태 코드

- `200`: 조회 성공
- `401`: 인증되지 않은 사용자
- `500`: 서버 내부 오류

## 5. 특정 Issue 상세 정보 조회 (필요하면 쓰셈)

**Endpoint**: `GET /api/issues/{issueId}`

**설명**: 특정 Issue의 상세 정보를 조회합니다.

### 요청 헤더

```
Authorization: Bearer {JWT_TOKEN}
```

### 경로 매개변수

| 매개변수 | 타입 | 설명    |
| -------- | ---- | ------- |
| issueId  | Long | Issue ID |

### 응답

```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "issueId": 1,
    "githubIssueNumber": 123,
    "title": "hotfix: Authorization 헤더 누락 시 인증 오류 발생",
    "description": "운영 환경에서 Authorization 헤더가 없거나...",
    "status": "OPEN",
    "createdByEmployeeId": "APP0001",
    "assigneeGithubIds": ["github_user1", "github_user2"],
    "logIds": ["log_001", "log_002"],
    "isGithubSynced": true,
    "createdAt": "2025-05-30T10:00:00",
    "updatedAt": "2025-05-30T10:30:00"
  }
}
```

### 응답 상태 코드

- `200`: 조회 성공
- `401`: 인증되지 않은 사용자
- `404`: Issue를 찾을 수 없음
- `500`: 서버 내부 오류
