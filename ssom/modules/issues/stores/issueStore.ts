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

  // 나의 이슈 목록 관련 상태
  myIssues: IssueResult[];
  isLoadingMyIssues: boolean;
  myIssuesError: string | null;

  // 개별 이슈 상세 조회 관련 상태
  currentIssue: IssueResult | null;
  isLoadingCurrentIssue: boolean;
  currentIssueError: string | null;

  // 액션들
  createDraft: (data: IssueDraftRequest) => Promise<void>;
  createGithubIssue: (data: CreateGithubIssueRequest) => Promise<void>;
  getAllIssues: () => Promise<void>;
  getMyIssues: () => Promise<void>;
  getIssueById: (issueId: number) => Promise<void>;
  clearDraft: () => void;
  clearIssue: () => void;
  clearCurrentIssue: () => void;
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
  myIssues: [],
  isLoadingMyIssues: false,
  myIssuesError: null,
  currentIssue: null,
  isLoadingCurrentIssue: false,
  currentIssueError: null,

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
      const errorMessage = error instanceof Error ? error.message : '이슈 초안 생성 중 오류가 발생했습니다.';
      if (__DEV__) console.error('[IssueStore] Issue draft creation error:', error);
      
      set({ 
        isDraftCreating: false,
        draftError: errorMessage
      });
      throw error;
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'GitHub 이슈 생성 중 오류가 발생했습니다.';
      if (__DEV__) console.error('[IssueStore] GitHub issue creation error:', error);
      
      set({ 
        isIssueCreating: false,
        issueCreateError: errorMessage
      });
      throw error;
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
      const errorMessage = error instanceof Error ? error.message : '이슈 목록을 불러오는 중 오류가 발생했습니다.';
      if (__DEV__) console.error('[IssueStore] Get all issues error:', error);
      
      set({ 
        isLoadingIssues: false,
        issuesError: errorMessage
      });
      throw error;
    }
  },

  // 나의 이슈 목록 조회
  getMyIssues: async () => {
    set({ isLoadingMyIssues: true, myIssuesError: null });
    
    try {
      const issues = await issueApi.getMyIssues();
      set({ 
        myIssues: issues,
        isLoadingMyIssues: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '나의 이슈 목록을 불러오는 중 오류가 발생했습니다.';
      if (__DEV__) console.error('[IssueStore] Get my issues error:', error);
      
      set({ 
        isLoadingMyIssues: false,
        myIssuesError: errorMessage
      });
      throw error;
    }
  },

  // 개별 이슈 상세 조회
  getIssueById: async (issueId: number) => {
    set({ isLoadingCurrentIssue: true, currentIssueError: null });
    
    try {
      const issue = await issueApi.getIssueById(issueId);
      set({ 
        currentIssue: issue,
        isLoadingCurrentIssue: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '이슈 상세 정보를 불러오는 중 오류가 발생했습니다.';
      if (__DEV__) console.error('[IssueStore] Get issue by ID error:', error);
      
      set({ 
        isLoadingCurrentIssue: false,
        currentIssueError: errorMessage
      });
      throw error;
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

  // 현재 이슈 클리어
  clearCurrentIssue: () => {
    set({ 
      currentIssue: null, 
      currentIssueError: null 
    });
  },

  // 에러 클리어
  clearError: () => {
    set({ 
      draftError: null,
      issueCreateError: null,
      issuesError: null,
      myIssuesError: null,
      currentIssueError: null 
    });
  }
}));
