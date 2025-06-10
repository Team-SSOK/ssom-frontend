## 1. 로그인

사원번호와 비밀번호로 로그인합니다.

**Endpoint**
```
POST /users/login
```

**Request Body**
```json
{
  "employeeId": "EMP001",
  "password": "Password123!"
}
```

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
- `429`: 로그인 시도 횟수 초과

---

## 2. 토큰 갱신

Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.

**Endpoint**
```
POST /users/refresh
```

**Request Body**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response**
```json
{
  "isSuccess": true,
  "code": 2005,
  "message": "토큰 갱신에 성공하였습니다.",
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
- `401`: 유효하지 않은 Refresh Token

---

## 3. 로그아웃 🔒

현재 로그인된 사용자를 로그아웃합니다.

**Endpoint**
```
POST /users/logout
```

**Headers**
```
Authorization: Bearer your-access-token
```

**Response**
```json
{
  "isSuccess": true,
  "code": 2004,
  "message": "로그아웃에 성공하였습니다.",
  "result": null
}
```

**Status Codes**
- `200`: 성공
- `401`: 인증되지 않은 요청

---

## 4. 내 정보 조회 🔒

현재 로그인된 사용자의 정보를 조회합니다.

**Endpoint**
```
GET /users/profile
```

**Headers**
```
Authorization: Bearer your-access-token
```

**Response**
```json
{
  "isSuccess": true,
  "code": 2000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "employeeId": "EMP001",
    "username": "홍길동",
    "phoneNumber": "010-1234-5678",
    "department": "개발팀",
    "departmentCode": 1,
    "githubId": "hong-gildong"
  }
}
```

**Status Codes**
- `200`: 성공
- `401`: 인증되지 않은 요청

---

## 5. 비밀번호 변경 🔒

현재 사용자의 비밀번호를 변경합니다.

**Endpoint**
```
PATCH /users/password
```

**Headers**
```
Authorization: Bearer your-access-token
```

**Request Body**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response**
```json
{
  "isSuccess": true,
  "code": 2006,
  "message": "비밀번호 변경에 성공하였습니다.",
  "result": null
}
```

**Status Codes**
- `200`: 성공
- `400`: 잘못된 요청 (현재 비밀번호 불일치, 새 비밀번호 형식 오류 등)
- `401`: 인증되지 않은 요청

## 6. 사용자 목록 조회 🔒

등록된 사용자 목록을 조회합니다.

**Endpoint**
```
GET /users/list
```

**Headers**
```
Authorization: Bearer your-access-token
```

**Response**
```json
{
  "isSuccess": true,
  "code": 1000,
  "message": "요청에 성공하였습니다.",
  "result": [
    {
      "id": "CHN0001",
      "username": "트랄렐로트랄랄라",
      "department": "CHANNEL",
      "githubId": "hong-gildong"
    },
    {
      "id": "CHN0002",
      "username": "도라에몽",
      "department": "CHANNEL",
      "githubId": "kim-chulsoo"
    },
    {
      "id": "CORE0001",
      "username": "퉁퉁퉁퉁퉁퉁퉁퉁퉁사후르",
      "department": "CORE_BANK",
      "githubId": "lee-younghee"
    }
  ]
}
```

**Status Codes**
- `200`: 성공
- `401`: 인증되지 않은 요청
