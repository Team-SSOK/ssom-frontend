# 1. FCM 토큰 등록

사용자의 디바이스 FCM 토큰을 등록하거나 기존 토큰을 갱신합니다. 알림을 받기 위해 클라이언트 앱에서 최초 로그인 시 또는 토큰 변경 시 호출됩니다.

## Endpoint

```
POST /api/fcm/register
```

## Headers

| 이름        | 타입   | 필수 | 설명                         |
|-------------|--------|------|------------------------------|
| Content-Type| string | ✅   | `application/json`           |

## Request Body

```json
{
  "fcmToken": "fcm_token_value"
}
```

| 필드명   | 타입   | 필수 | 설명                    |
|----------|--------|------|-------------------------|
| fcmToken | string | ✅   | 디바이스에서 발급된 FCM 토큰 |

## Response

```json
{
  "isSuccess": true,
  "code": 1000,
  "message": "요청에 성공하였습니다.",
  "result": null
}
```

## Status Codes

- `200`: FCM 토큰 등록 또는 갱신 성공
- `400`: 잘못된 요청 (fcmToken 누락 등)
- `500`: 내부 서버 오류