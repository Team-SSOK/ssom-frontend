import { create } from 'zustand';
import { alertApi } from '../apis/alertApi';
import { AlertEntry } from '../types';
import { ALERT_CONFIG } from '@/api/constants';
import { deduplicateById, sortByTimestamp } from '@/utils/storeHelpers';

interface AlertState {
  alerts: AlertEntry[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setAlerts: (alerts: AlertEntry[]) => void;
  addAlert: (alert: AlertEntry) => void;
  updateAlert: (alertStatusId: number, updates: Partial<AlertEntry>) => void;
  removeAlert: (alertStatusId: number) => void;
  markAsRead: (alertStatusId: number) => Promise<void>;
  deleteAlert: (alertStatusId: number) => Promise<void>;
  loadAlerts: () => Promise<void>;
  clearAlerts: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  isLoading: false,
  error: null,

  setAlerts: (alerts: AlertEntry[]) => {
    // Toss 원칙: 순수 함수를 사용한 예측 가능한 데이터 변환
    const uniqueAlerts = deduplicateById(alerts, (alert) => alert.alertId);
    const sortedAlerts = sortByTimestamp(uniqueAlerts);
    
    set({ alerts: sortedAlerts });
  },

  addAlert: (alert: AlertEntry) => {
    set(state => {
      // 중복 방지: 같은 alertId, alertStatusId 또는 id가 이미 있으면 추가하지 않음
      const exists = state.alerts.some(existingAlert => 
        existingAlert.alertId === alert.alertId || 
        existingAlert.alertStatusId === alert.alertStatusId ||
        existingAlert.id === alert.id
      );
      
      if (exists) {
        console.log('중복 알림 방지:', alert.id);
        return state;
      }
      
      // 새 알림 추가 후 timestamp 기준으로 최신순 정렬 (최대 개수 제한)
      const newAlerts = [alert, ...state.alerts]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
      
      // timestamp 기준 최신순 정렬 유지
      const sortedAlerts = updatedAlerts.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      return { alerts: sortedAlerts };
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
      set({ isLoading: true, error: null });
      const alertList = await alertApi.getAlerts();

      get().setAlerts(alertList);
    } catch (error: any) {
      const errorMessage = error.message || '알림 목록을 불러오는데 실패했습니다.';
      if (__DEV__) console.error('알림 목록 로드 실패:', error);
      
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearAlerts: () => {
    set({ alerts: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
