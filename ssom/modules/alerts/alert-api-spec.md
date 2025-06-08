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

## 3. 알림 개별 상태 변경

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

## 4. 알림 개별 삭제

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

## 5. FCM 토큰 등록

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

## 6. 그라파나 알림 전송

그라파나에서 발생한 알림 데이터를 받아 앱 알림 시스템으로 전송합니다. 여러 개의 알림을 한 번에 처리할 수 있습니다.

**Endpoint**
```
POST /api/alert/grafana
```

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| Content-Type | string | ✅ | application/json |

**Request Body**
```json
{
  "alerts": [
    {
      "app": "ssok-bluetooth-service",
      "level": "warning",
      "message": "KubePodCrashLooping - Pod ssok/ssok-bluetooth-service-558488498d-7v4pg (ssok-bluetooth-service) is in waiting state (reason: \"CrashLoopBackOff\") on cluster .",
      "timestamp": "2025-05-31T00:14:01.472Z",
      "id": "686692198126160f"
    },
    {
      "app": "ssok-bluetooth-service",
      "level": "warning",
      "message": "KubePodCrashLooping - Pod ssok/ssok-bluetooth-service-558488498d-7v4pg (ssok-bluetooth-service) is in waiting state (reason: \"CrashLoopBackOff\") on cluster .",
      "timestamp": "2025-05-31T00:14:01.472Z",
      "id": "686692198126160f"
    }
  ]
}
```

| 필드명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| alerts | List<AlertRequestDto> | ✅ | 전송할 알림들의 리스트 |

> AlertRequestDto 내부 필드는 상황에 따라 다를 수 있으며, 알림 ID, 제목, 메시지, 심각도, 발생 시각 등의 정보를 포함합니다.

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
- 201: 알림 생성 요청 성공
- 400: 잘못된 요청 (alerts 필드 누락 또는 비어있음)
- 500: 내부 서버 오류

**예시 Curl 요청**
```bash
curl -X POST http://localhost:8080/api/alert/grafana \
     -H "Content-Type: application/json" \
     -d '{
           "alerts": [
             {
               "alertId": "alert1",
               "title": "CPU Usage High",
               "message": "CPU 사용률이 90%를 초과했습니다.",
               "severity": "critical",
               "timestamp": "2025-06-04T10:20:30Z"
             },
             {
               "alertId": "alert2",
               "title": "Memory Usage Warning",
               "message": "메모리 사용률이 80%를 초과했습니다.",
               "severity": "warning",
               "timestamp": "2025-06-04T10:25:00Z"
             }
           ]
         }'
```

## 7. 오픈서치 대시보드 알림 전송

오픈서치 대시보드에서 발생한 알림 원본 데이터를 받아 앱 알림 시스템으로 전송합니다. 원본 JSON 문자열을 파싱하여 여러 알림을 처리합니다.

**Endpoint**
```
POST /api/alert/opensearch
```

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| Content-Type | string | ✅ | application/json |

**Request Body**
```json
{
  "id": "wh8TIJcBfhJZWUSwqRZX",
  "level": "ERROR",
  "app": "ssok-gateway-service",
  "timestamp": "2025-05-30T07:24:06.396205638+00:00",
  "message": "Authentication error: Authorization header is missing or invalid"
}
```

| 필드명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| request | string | ✅ | 오픈서치 대시보드에서 받은 원본 JSON 문자열 |

> 원본 JSON 문자열에는 여러 알림을 담은 alerts 배열 등이 포함됩니다.

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
- 201: 알림 생성 요청 성공
- 400: 잘못된 요청 (request 필드 누락 또는 빈 문자열)
- 422: JSON 파싱 실패 등 처리 불가
- 500: 내부 서버 오류

**예시 Curl 요청**
```bash
curl -X POST http://localhost:8080/api/alert/opensearch \
     -H "Content-Type: application/json" \
     -d '{
           "request": "{\"alerts\":[{\"alertId\":\"alert1\",\"title\":\"Disk Space Low\",\"message\":\"디스크 여유 공간이 10% 미만입니다.\",\"severity\":\"critical\",\"timestamp\":\"2025-06-04T11:00:00Z\"}]}"
         }'
```

## 8. 이슈 생성 알림 전송

이슈가 생성되었을 때, 지정된 사용자들에게 알림을 전송합니다. 이 알림은 특정 사용자 리스트를 대상으로 개별 알림을 생성하고 전송합니다.

**Endpoint**
```
POST /api/alert/issue
```

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| Content-Type | string | ✅ | application/json |

**Request Body**
```json
{
  "timestamp": "2025-06-04T12:00:00Z",
  "sharedEmployeeIds": ["user1", "user2", "user3"]
}
```

| 필드명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| timestamp | string (ISO8601) | ✅ | 알림 생성 시점 타임스탬프 |
| sharedEmployeeIds | string[] | ✅ | 알림을 받을 사용자 ID 리스트 |

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
- 201: 이슈 알림 생성 및 전송 성공
- 400: 잘못된 요청 (timestamp 또는 sharedEmployeeIds 누락)
- 404: 알림 대상자(사용자) 미존재
- 500: 알림 생성 실패 또는 내부 서버 오류

**예시 Curl 요청**
```bash
curl -X POST http://localhost:8080/api/alert/issue \
     -H "Content-Type: application/json" \
     -d '{
           "timestamp": "2025-06-04T12:00:00Z",
           "sharedEmployeeIds": ["user1", "user2", "user3"]
         }'
```

## 9. Jenkins 및 ArgoCD 알림 전송

Jenkins 또는 ArgoCD 작업 완료 시, 알림 데이터를 받아 앱으로 전송합니다.

app 필드에서 alertKind와 appName을 파싱하여 공통 포맷으로 알림을 생성합니다.

**Endpoint**
```
POST /api/alert/send
```

**Headers**

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| Content-Type | string | ✅ | application/json |

**Request Body**
```json
{
  "level": "INFO",
  "app": "jenkins_ssok-bank",
  "timestamp": "2025-06-04T12:00:00Z",
  "message": "빌드가 성공적으로 완료되었습니다."
}
```

| 필드명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| id | string | ✅ | 알림 고유 ID (실제로는 noNeedId 처리됨) |
| level | string | ✅ | 알림 레벨 (예: INFO, WARN, ERROR) |
| app | string | ✅ | 알림 대상 앱, 형식: {alertKind}_{appName} (예: jenkins_ssok-bank) |
| timestamp | string | ✅ | ISO 8601 포맷 타임스탬프 |
| message | string | ✅ | 알림 메시지 |

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
- 201: 알림 생성 및 전송 성공
- 400: 잘못된 요청 (필수 필드 누락, app 형식 오류 등)
- 415: 지원하지 않는 AlertKind (app 필드의 alertKind가 JENKINS 또는 ARGOCD가 아님)
- 500: 알림 생성 실패 또는 내부 서버 오류

**예시 Curl 요청**
```bash
curl -X POST http://localhost:8080/api/alert/send \
     -H "Content-Type: application/json" \
     -d '{
           "id": "someId",
           "level": "INFO",
           "app": "jenkins_ssok-bank",
           "timestamp": "2025-06-04T12:00:00Z",
           "message": "빌드가 성공적으로 완료되었습니다."
         }'
```