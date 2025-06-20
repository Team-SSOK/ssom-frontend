import apiInstance from '@/api/apiInstance';
import { ApiResponse } from '@/api/types';
import { 
  AlertEntry, 
  AlertStatusUpdateRequest, 
  AlertDeleteRequest, 
  FCMTokenRequest
} from '../types';

export interface PaginatedAlertResponse {
  content: AlertEntry[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * 알림 관련 API 클래스
 * 
 * 책임:
 * - 알림 관련 API 엔드포인트 호출
 * - 응답 데이터 변환 (필요시)
 * 
 * 참고:
 * - HTTP 에러, 네트워크 에러, 401 토큰 갱신은 interceptors에서 처리됨
 * - 이 클래스는 interceptors를 신뢰하고 순수한 API 호출만 담당
 */
class AlertApi {

  /**
   * 전체 알림 목록 조회 (API 스펙 2번)
   * GET /api/alert
   * 
   * @returns 알림 목록 배열
   */
  async getAlerts(): Promise<AlertEntry[]> {
    const response = await apiInstance.get<ApiResponse<AlertEntry[]>>(
      '/alert'
    );

    return response.data.result;
  }

  /**
   * 페이징 알림 목록 조회 (API 스펙 3번)
   * GET /api/alert/paged
   * 
   * @param page 페이지 번호 (0부터 시작)
   * @param size 페이지 크기 (기본값: 10)
   * @param sort 정렬 기준 (기본값: alert.timestamp,DESC)
   * @returns 페이징된 알림 목록
   */
  async getPagedAlerts(
    page: number = 0, 
    size: number = 10, 
    sort: string = 'alert.timestamp,DESC'
  ): Promise<PaginatedAlertResponse> {
    const response = await apiInstance.get<ApiResponse<PaginatedAlertResponse>>(
      '/alert/paged',
      {
        params: {
          page,
          size,
          sort
        }
      }
    );

    return response.data.result;
  }

  /**
   * 알림 개별 상태 변경 (API 스펙 3번)
   * PATCH /api/alert/modif
   * 
   * 부작용: 서버의 알림 상태가 변경됨
   * 
   * @param request 알림 상태 업데이트 요청
   */
  async updateAlertStatus(request: AlertStatusUpdateRequest): Promise<void> {
    await apiInstance.patch<ApiResponse<null>>(
      '/alert/modify',
      request
    );
  }

  /**
   * 알림 개별 삭제 (API 스펙 4번)
   * PATCH /api/alert/delete
   * 
   * 부작용: 서버에서 알림이 삭제됨
   * 
   * @param request 알림 삭제 요청
   */
  async deleteAlert(request: AlertDeleteRequest): Promise<void> {
    await apiInstance.patch<ApiResponse<null>>(
      '/alert/delete',
      request
    );
  }

  /**
   * FCM 토큰 등록 (API 스펙 5번)
   * POST /api/fcm/register
   * 
   * 부작용: 서버에 FCM 토큰이 등록됨
   * 
   * @param request FCM 토큰 등록 요청
   */
  async registerFCMToken(request: FCMTokenRequest): Promise<void> {
    await apiInstance.post<ApiResponse<null>>(
      '/fcm/register',
      request
    );
  }

  // 헬퍼 메서드들 - 명확한 의도를 표현하는 이름

  /**
   * 특정 알림을 읽음 처리
   * 
   * 부작용: 해당 알림의 isRead 상태가 true로 변경됨
   * 
   * @param alertStatusId 읽음 처리할 알림 상태 ID
   */
  async markAlertAsRead(alertStatusId: number): Promise<void> {
    return this.updateAlertStatus({
      alertStatusId: alertStatusId,
      isRead: true
    });
  }

  /**
   * 특정 알림을 안읽음 처리
   * 
   * 부작용: 해당 알림의 isRead 상태가 false로 변경됨
   * 
   * @param alertStatusId 안읽음 처리할 알림 상태 ID
   */
  async markAlertAsUnread(alertStatusId: number): Promise<void> {
    return this.updateAlertStatus({
      alertStatusId: alertStatusId,
      isRead: false
    });
  }

  /**
   * 읽지 않은 알림만 조회
   * 
   * @returns 읽지 않은 알림 목록
   */
  async getUnreadAlerts(): Promise<AlertEntry[]> {
    const alerts = await this.getAlerts();
    return alerts.filter(alert => !alert.isRead);
  }

  /**
   * 읽은 알림만 조회
   * 
   * @returns 읽은 알림 목록
   */
  async getReadAlerts(): Promise<AlertEntry[]> {
    const alerts = await this.getAlerts();
    return alerts.filter(alert => alert.isRead);
  }

  /**
   * 특정 종류의 알림만 조회
   * 
   * @param kind 알림 종류
   * @returns 해당 종류의 알림 목록
   */
  async getAlertsByKind(kind: string): Promise<AlertEntry[]> {
    const alerts = await this.getAlerts();
    return alerts.filter(alert => alert.kind === kind);
  }

  /**
   * 알림 일괄 상태 변경 (API 스펙 6번)
   * PATCH /api/alert/modifyAll
   * 
   * 부작용: 모든 알림이 읽음 처리됨
   * 
   * @returns 업데이트된 알림 목록
   */
  async markAllAlertsAsRead(): Promise<AlertEntry[]> {
    const response = await apiInstance.patch<ApiResponse<AlertEntry[]>>(
      '/alert/modifyAll'
    );

    return response.data.result;
  }
}

// 싱글톤 인스턴스
export const alertApi = new AlertApi();
