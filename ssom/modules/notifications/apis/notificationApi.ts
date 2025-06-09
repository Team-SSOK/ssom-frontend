import apiInstance from '@/api/apiInstance';
import type { FCMRegistrationResponse } from '../types';

/**
 * FCM 관련 API 서비스
 * fcm-api-spec.md에 정의된 API 엔드포인트를 구현
 */
export const notificationApi = {
  /**
   * FCM 토큰을 서버에 등록
   * POST /fcm/register
   * Headers: Content-Type: application/json
   */
  async registerFCMToken(fcmToken: string): Promise<FCMRegistrationResponse> {
    const response = await apiInstance.post<FCMRegistrationResponse>(
      '/fcm/register', 
      { fcmToken }
    );
    return response.data;
  },
};