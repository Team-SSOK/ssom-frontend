import { create } from 'zustand';
import { alertApi } from '../apis/alertApi';
import { AlertEntry } from '../types';
import { ALERT_CONFIG } from '@/api/constants';
import { deduplicateById } from '@/utils/storeHelpers';

interface AlertState {
  alerts: AlertEntry[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  hasNextPage: boolean;
  pageSize: number;
  
  // Actions
  setAlerts: (alerts: AlertEntry[]) => void;
  addAlert: (alert: AlertEntry) => void;
  updateAlert: (alertStatusId: number, updates: Partial<AlertEntry>) => void;
  removeAlert: (alertStatusId: number) => void;
  markAsRead: (alertStatusId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteAlert: (alertStatusId: number) => Promise<void>;
  loadAlerts: () => Promise<void>;
  loadMoreAlerts: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  clearAlerts: () => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetPagination: () => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  page: 0,
  hasNextPage: true,
  pageSize: 10,

  setAlerts: (alerts: AlertEntry[]) => {
    // Toss 원칙: 순수 함수를 사용한 예측 가능한 데이터 변환
    // alertId 기준으로 중복 제거 (id 필드는 서버에서 중복될 수 있음)
    // 백엔드에서 이미 시간순으로 정렬된 데이터를 보내주므로 별도 정렬 불필요
    const uniqueAlerts = deduplicateById(alerts, (alert) => alert.alertId);
    
    set({ alerts: uniqueAlerts });
  },

  addAlert: (alert: AlertEntry) => {
    set(state => {
      // 중복 방지: 같은 alertId, alertStatusId가 이미 있으면 추가하지 않음
      // id 필드는 서버에서 중복될 수 있으므로 체크에서 제외
      const exists = state.alerts.some(existingAlert => 
        existingAlert.alertId === alert.alertId || 
        existingAlert.alertStatusId === alert.alertStatusId
      );
      
      if (exists) {
        console.log('중복 알림 방지 (alertId 또는 alertStatusId):', alert.alertId, alert.alertStatusId);
        return state;
      }
      
      // 새 알림을 맨 앞에 추가 (백엔드에서 정렬된 순서를 유지)
      const newAlerts = [alert, ...state.alerts]
        .slice(0, ALERT_CONFIG.MAX_ALERTS_COUNT);
      
      return { alerts: newAlerts };
    });
  },

  updateAlert: (alertStatusId: number, updates: Partial<AlertEntry>) => {
    set(state => {
      const updatedAlerts = state.alerts.map(alert => 
        alert.alertStatusId === alertStatusId 
          ? { ...alert, ...updates }
          : alert
      );
      
      // 백엔드에서 이미 정렬된 순서를 유지하므로 별도 정렬 불필요
      return { alerts: updatedAlerts };
    });
  },

  removeAlert: (alertStatusId: number) => {
    set(state => ({
      alerts: state.alerts.filter(alert => alert.alertStatusId !== alertStatusId)
    }));
  },

  markAsRead: async (alertStatusId: number) => {
    try {
      await alertApi.markAlertAsRead(alertStatusId);
      
      // 로컬 상태 업데이트
      get().updateAlert(alertStatusId, { isRead: true });
    } catch (error: any) {
      console.log('알림 읽음 처리 실패:', error);
      set({ error: '알림 읽음 처리에 실패했습니다.' });
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const updatedAlerts = await alertApi.markAllAlertsAsRead();
      
      // 서버에서 받은 업데이트된 알림 목록으로 전체 상태 업데이트
      get().setAlerts(updatedAlerts);
    } catch (error: any) {
      console.log('전체 알림 읽음 처리 실패:', error);
      set({ error: '전체 알림 읽음 처리에 실패했습니다.' });
      throw error;
    }
  },

  deleteAlert: async (alertStatusId: number) => {
    try {
      await alertApi.deleteAlert({ alertStatusId });
      
      // 로컬 상태에서 제거
      get().removeAlert(alertStatusId);
    } catch (error: any) {
      console.log('알림 삭제 실패:', error);
      set({ error: '알림 삭제에 실패했습니다.' });
      throw error;
    }
  },

  loadAlerts: async () => {
    try {
      set({ isLoading: true, error: null, page: 0 });
      const response = await alertApi.getPagedAlerts(0, get().pageSize);

      set({ 
        alerts: response.content,
        page: 0,
        hasNextPage: !response.last
      });
    } catch (error: any) {
      const errorMessage = error.message || '알림 목록을 불러오는데 실패했습니다.';
      if (__DEV__) console.error('알림 목록 로드 실패:', error);
      
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadMoreAlerts: async () => {
    const state = get();
    
    // 이미 로딩 중이거나 더 이상 페이지가 없으면 리턴
    if (state.isLoadingMore || !state.hasNextPage) {
      return;
    }

    try {
      set({ isLoadingMore: true, error: null });
      const nextPage = state.page + 1;
      const response = await alertApi.getPagedAlerts(nextPage, state.pageSize);

      // 기존 알림에 새로운 알림 추가 (중복 제거)
      const allAlerts = [...state.alerts, ...response.content];
      const uniqueAlerts = deduplicateById(allAlerts, (alert) => alert.alertId);

      set({ 
        alerts: uniqueAlerts,
        page: nextPage,
        hasNextPage: !response.last
      });
    } catch (error: any) {
      const errorMessage = error.message || '추가 알림을 불러오는데 실패했습니다.';
      if (__DEV__) console.error('추가 알림 로드 실패:', error);
      
      set({ error: errorMessage });
    } finally {
      set({ isLoadingMore: false });
    }
  },

  refreshAlerts: async () => {
    try {
      set({ page: 0, hasNextPage: true });
      await get().loadAlerts();
    } catch (error: any) {
      if (__DEV__) console.error('알림 새로고침 실패:', error);
      throw error;
    }
  },

  clearAlerts: () => {
    set({ alerts: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setLoadingMore: (loading: boolean) => {
    set({ isLoadingMore: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  resetPagination: () => {
    set({ page: 0, hasNextPage: true });
  },
}));
