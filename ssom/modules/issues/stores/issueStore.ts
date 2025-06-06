import { create } from 'zustand';
import { issueApi, IssueDraftRequest, IssueDraftResult, CreateGithubIssueRequest, IssueResult } from '../apis/issueApi';

interface IssueState {
  // 이슈 초안 생성 관련 상태
  draftResult: IssueDraftResult | null;
  isDraftCreating: boolean;
  draftError: string | null;

  // GitHub 이슈 생성 관련 상태
  createdIssue: IssueResult | null;
  isIssueCreating: boolean;
  issueCreateError: string | null;

  // 전체 이슈 목록 관련 상태
  allIssues: IssueResult[];
  isLoadingIssues: boolean;
  issuesError: string | null;

  // 액션들
  createDraft: (data: IssueDraftRequest) => Promise<void>;
  createGithubIssue: (data: CreateGithubIssueRequest) => Promise<boolean>;
  getAllIssues: () => Promise<void>;
  clearDraft: () => void;
  clearIssue: () => void;
  clearError: () => void;
}

export const useIssueStore = create<IssueState>((set, get) => ({
  // 초기 상태
  draftResult: null,
  isDraftCreating: false,
  draftError: null,
  createdIssue: null,
  isIssueCreating: false,
  issueCreateError: null,
  allIssues: [],
  isLoadingIssues: false,
  issuesError: null,

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

  // GitHub 이슈 생성
  createGithubIssue: async (data: CreateGithubIssueRequest) => {
    set({ isIssueCreating: true, issueCreateError: null });
    
    try {
      const result = await issueApi.createGithubIssue(data);
      set({ 
        createdIssue: result,
        isIssueCreating: false 
      });
      return true; // 성공
    } catch (error) {
      console.error('GitHub issue creation error:', error);
      set({ 
        isIssueCreating: false,
        issueCreateError: error instanceof Error ? error.message : 'GitHub 이슈 생성 중 오류가 발생했습니다.'
      });
      return false; // 실패
    }
  },

  // 전체 이슈 목록 조회
  getAllIssues: async () => {
    set({ isLoadingIssues: true, issuesError: null });
    
    try {
      const issues = await issueApi.getAllIssues();
      set({ 
        allIssues: issues,
        isLoadingIssues: false 
      });
    } catch (error) {
      console.error('Get all issues error:', error);
      set({ 
        isLoadingIssues: false,
        issuesError: error instanceof Error ? error.message : '이슈 목록을 불러오는 중 오류가 발생했습니다.'
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

  // 생성된 이슈 클리어
  clearIssue: () => {
    set({ 
      createdIssue: null, 
      issueCreateError: null 
    });
  },

  // 에러 클리어
  clearError: () => {
    set({ 
      draftError: null,
      issueCreateError: null,
      issuesError: null 
    });
  }
}));
