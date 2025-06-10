# 알림 시스템 API 문서

## 1. 알림 SSE 구독

실시간 알림을 수신하기 위해 SSE(Server-Sent Events) 연결을 시작합니다. 클라이언트는 이 API를 통해 서버로부터 실시간 알림을 구독할 수 있습니다.

**Endpoint**
```
GET /api/alert/subscribe
```

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| Authorization | string | ✅ | Bearer 토큰 (Access Token) |
| Last-Event-ID | string | ❌ | 클라이언트의 마지막 수신 이벤트 ID (재연결 시 사용) |

**Produces**
```
text/event-stream
```

**Response**
```
event: SSE_ALERT_INIT
id: 20240604_abcdef123456
data: connected
```

**Status Codes**
- 200: SSE 연결 성공
- 400: employeeId 누락 등 잘못된 요청
- 401: 서버 오류 (emitter 생성 실패 등)

**예시 Curl 요청**
```bash
curl -N -H "Authorization: Bearer {ACCESS_TOKEN}" \
     -H "Last-Event-ID: 20240604_abcdef123456" \
     http://localhost:8080/api/alert/subscribe
```

## 2. 전체 알림 목록 조회

개별 사용자가 수신한 모든 알림을 조회합니다. 알림은 최신순으로 정렬되어 반환됩니다.

**Endpoint**
```bash
GET /api/alert
```

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| Authorization | string | ✅ | Bearer 토큰 (Access Token) |

**Produces**
```
application/json
```

**Response**
```json
{
  "isSuccess": true,
  "code": 1000,
  "message": "요청에 성공하였습니다.",
  "result": [
    {
      "alertId": 1,
      "alertStatusId": 1,
      "id": "686692198126160f",
      "title": "[ERROR] ssok-bank",
      "message": "Authentication error: Authorization header is missing or invalid",
      "kind": "OPENSEARCH",
      "isRead": false,
      "timestamp": "2025-05-30T07:24:06.396205638+00:00",
      "createdAt": "2025-05-30T07:24:06.396205638+00:00",
      "employeeId": "123456"
    },
    {
      "alertId": 2,
      "alertStatusId": 2,
      "id": "9fbb1234567890",
      "title": "[INFO] jenkins-ssok-bank",
      "message": "Build completed successfully",
      "kind": "JENKINS",
      "isRead": true,
      "timestamp": "2025-05-29T10:15:00.000000000+00:00",
      "createdAt": "2025-05-29T10:15:05.000000000+00:00",
      "employeeId": "123456"
    }
  ]
}
```

**Status Codes**
- 200: 요청 성공
- 401: 인증 실패 (Access Token 누락 또는 만료)
- 500: 서버 내부 오류

**예시 Curl 요청**
```bash
curl -H "Authorization: Bearer {ACCESS_TOKEN}" \
     http://localhost:8080/api/alert
```

## 3. 페이징 알림 목록 조회

개별 사용자가 수신한 알림을 페이징하여 조회합니다. 알림은 최신순으로 정렬되어 반환됩니다.
프론트에서는 무한 스크롤 또는 페이지네이션 UI에 활용할 수 있습니다.

**Endpoint**
```bash
GET /api/alert/paged
```

**Query Parameters**

| 이름 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| page | int | ❌ | 0 | 조회할 페이지 번호 (0부터 시작) |
| size | int | ❌ | 10 | 한 페이지에 표시할 알림 개수 |
| sort | string | ❌ | alert.timestamp,DESC | 정렬 기준 (ex. `alert.timestamp,DESC`) |

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| Authorization | string | ✅ | Bearer 토큰 (Access Token) |

**Produces**
```
application/json
```

**Response**
```json
{
  "isSuccess": true,
  "code": 1000,
  "message": "요청에 성공하였습니다.",
  "result": {
    "content": [
      {
        "alertId": 1,
        "alertStatusId": 3,
        "id": "686692198126160f",
        "title": "[ERROR] ssok-bank",
        "message": "Authentication error: Authorization header is missing or invalid",
        "kind": "OPENSEARCH",
        "isRead": false,
        "timestamp": "2025-05-30T07:24:06.396205638+00:00",
        "createdAt": "2025-05-30T07:24:06.396205638+00:00",
        "employeeId": "123456"
      },
      {
        "alertId": 2,
        "alertStatusId": 4,
        "id": "9fbb1234567890",
        "title": "[INFO] jenkins-ssok-bank",
        "message": "Build completed successfully",
        "kind": "JENKINS",
        "isRead": true,
        "timestamp": "2025-05-29T10:15:00.000000000+00:00",
        "createdAt": "2025-05-29T10:15:05.000000000+00:00",
        "employeeId": "123456"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalPages": 5,
    "totalElements": 50,
    "last": false,
    "first": true,
    "numberOfElements": 10,
    "empty": false
  }
}
```

**Status Codes**
- 200: 요청 성공
- 401: 인증 실패 (Access Token 누락 또는 만료)
- 500: 서버 내부 오류

**예시 Curl 요청**
```bash
curl -H "Authorization: Bearer {ACCESS_TOKEN}" \
     "http://localhost:8080/api/alert/paged?page=0&size=10&sort=alert.timestamp,DESC"
```

## 4. 알림 개별 상태 변경

특정 알림의 읽음 여부 상태를 변경합니다. 주로 사용자가 알림을 확인하거나 다시 안 읽음 처리할 때 사용됩니다.

**Endpoint**
```
PATCH /api/alert/modify
```

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| Authorization | string | ✅ | Bearer 토큰 (Access Token) |

**Request Body**
```json
{
  "alertStatusId": 1234,
  "isRead": true
}
```

| 필드명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| alertStatusId | number | ✅ | 알림 상태 ID |
| read | boolean | ✅ | 읽음 여부 (true = 읽음) |

**Response**
```json
{
  "isSuccess": true,
  "code": 1000,
  "message": "요청에 성공하였습니다.",
  "result": null
}
```

**Status Codes**
- 200: 알림 상태 변경 성공
- 400: 잘못된 요청 (alertStatusId 누락 등)
- 404: 해당 알림 상태를 찾을 수 없음
- 500: 내부 서버 오류

**예시 Curl 요청**
```bash
curl -X PATCH http://localhost:8080/api/alert/modify \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {ACCESS_TOKEN}" \
     -d '{
           "alertStatusId": 1234,
           "read": true
         }'
```

## 5. 알림 개별 삭제

특정 알림을 삭제 처리합니다. 사용자가 알림 목록에서 더 이상 해당 알림을 보고 싶지 않을 때 사용됩니다.

**Endpoint**
```
PATCH /api/alert/delete
```

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| Authorization | string | ✅ | Bearer 토큰 (Access Token) |

**Request Body**
```json
{
  "alertStatusId": 1234
}
```

| 필드명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| alertStatusId | number | ✅ | 삭제할 알림 상태 ID |

**Response**
```json
{
  "isSuccess": true,
  "code": 1000,
  "message": "요청에 성공하였습니다.",
  "result": null
}
```

**Status Codes**
- 200: 알림 삭제 성공
- 400: 잘못된 요청 (alertStatusId 누락 등)
- 404: 해당 알림 상태를 찾을 수 없음
- 500: 내부 서버 오류

**예시 Curl 요청**
```bash
curl -X PATCH http://localhost:8080/api/alert/delete \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {ACCESS_TOKEN}" \
     -d '{
           "alertStatusId": 1234
         }'
```

## 6. FCM 토큰 등록

사용자의 디바이스 FCM 토큰을 등록하거나 기존 토큰을 갱신합니다. 알림을 받기 위해 클라이언트 앱에서 최초 로그인 시 또는 토큰 변경 시 호출됩니다.

**Endpoint**
```
POST /api/fcm/register
```

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| X-User-Id | string | ✅ | 사용자 식별을 위한 사용자 ID |
| Content-Type | string | ✅ | application/json |

**Request Body**
```json
{
  "fcmToken": "fcm_token_value"
}
```

| 필드명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| fcmToken | string | ✅ | 디바이스에서 발급된 FCM 토큰 |

**Response**
```json
{
  "isSuccess": true,
  "code": 1000,
  "message": "요청에 성공하였습니다.",
  "result": null
}
```

**Status Codes**
- 200: FCM 토큰 등록 또는 갱신 성공
- 400: 잘못된 요청 (fcmToken 누락 등)
- 500: 내부 서버 오류

**예시 Curl 요청**
```bash
curl -X POST http://localhost:8080/api/fcm/register \
     -H "Content-Type: application/json" \
     -H "X-User-Id: user_1234" \
     -d '{
           "fcmToken": "fcm_token_value"
         }'
```

## 7. 알림 일괄 상태 변경

**Endpoint**
```
PATCH /api/alert/modifyAll
```

**Headers**
- Authorization: Bearer {ACCESS_TOKEN}

**Request Body**
없음

**Response**
```json
{ "isSuccess":true,"code":1000,"message":"요청에 성공하였습니다.","result":[ /* 업데이트된 알림 리스트 */ ] }
```

**Status Codes**
- 200: 성공
- 401: 인증 실패
- 500: 서버 오류

**예시 Curl 요청**
```bash
curl -X PATCH http://localhost:8080/api/alert/modifyAll \
     -H "Authorization: Bearer {ACCESS_TOKEN}"
```