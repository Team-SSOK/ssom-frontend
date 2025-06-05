import { create } from 'zustand';
import { issueApi, IssueDraftRequest, IssueDraftResult } from '../apis/issueApi';

interface IssueState {
  // 이슈 초안 생성 관련 상태
  draftResult: IssueDraftResult | null;
  isDraftCreating: boolean;
  draftError: string | null;

  // 액션들
  createDraft: (data: IssueDraftRequest) => Promise<void>;
  clearDraft: () => void;
  clearError: () => void;
}

export const useIssueStore = create<IssueState>((set, get) => ({
  // 초기 상태
  draftResult: null,
  isDraftCreating: false,
  draftError: null,

  // 이슈 초안 생성
  createDraft: async (data: IssueDraftRequest) => {
    set({ isDraftCreating: true, draftError: null });
    
    try {
      const result = await issueApi.createDraft(data);
      set({ 
        draftResult: result,
        isDraftCreating: false 
      });
    } catch (error) {
      console.error('Issue draft creation error:', error);
      set({ 
        isDraftCreating: false,
        draftError: error instanceof Error ? error.message : '이슈 초안 생성 중 오류가 발생했습니다.'
      });
    }
  },

  // 초안 결과 클리어
  clearDraft: () => {
    set({ 
      draftResult: null, 
      draftError: null 
    });
  },

  // 에러 클리어
  clearError: () => {
    set({ draftError: null });
  }
}));
