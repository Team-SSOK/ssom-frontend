import apiInstance from '@/api/apiInstance';

// 요청 타입 정의
export interface IssueDraftRequest {
  logIds: string[];
  additionalContext?: string;
}

export interface CreateGithubIssueRequest {
  title: string;
  description: string;
  logIds: string[];
  assigneeUsernames?: string[];
  cause?: string;
  solution?: string;
  reproductionSteps?: string[];
  references?: string;
  locationFile?: string;
  locationFunction?: string;
}

// 응답 타입 정의
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
}

export interface LogData {
  level: string;
  logger: string;
  thread: string;
  message: string;
  app: string;
}

export interface IssueLocation {
  file: string;
  function: string;
}

export interface IssueMessage {
  title: string;
  description: string;
  location: IssueLocation;
  cause: string;
  reproduction_steps: string[];
  log: string;
  solution: string;
  references: string;
}

export interface IssueDraftResult {
  log: LogData[];
  message: IssueMessage;
}

export interface IssueResult {
  issueId: number;
  githubIssueNumber: number;
  title: string;
  description: string;
  status: string;
  createdByEmployeeId: string;
  assigneeGithubIds: string[];
  logIds: string[];
  isGithubSynced: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 이슈 관련 API 클래스
 * 
 * 책임:
 * - 이슈 생성 관련 API 엔드포인트 호출
 * - 응답 데이터 변환
 * - 비즈니스 로직 관련 에러 처리만 담당
 * 
 * 참고:
 * - HTTP 에러, 네트워크 에러, 401 토큰 갱신은 interceptors에서 처리됨
 * - 이 클래스는 interceptors를 신뢰하고 순수한 API 호출만 담당
 */
export class IssueApi {
  /**
   * LLM Issue 초안 작성 API 호출
   * POST /api/issues/draft
   * 
   * 참고: LLM 분석은 시간이 오래 걸릴 수 있어 별도 timeout 설정
   */
  async createDraft(data: IssueDraftRequest): Promise<IssueDraftResult> {
    const response = await apiInstance.post<ApiResponse<IssueDraftResult>>(
      '/issues/draft',
      data,
      {
        timeout: 30000, // LLM 분석을 위해 30초으로 설정
      }
    );

    return response.data.result;
  }

  /**
   * GitHub Issue 생성 API 호출
   * POST /api/issues/github
   */
  async createGithubIssue(data: CreateGithubIssueRequest): Promise<IssueResult> {
    const response = await apiInstance.post<ApiResponse<IssueResult>>(
      '/issues/github',
      data
    );

    return response.data.result;
  }

  /**
   * 내가 담당자로 지정된 Issue 목록 조회 API 호출
   * GET /api/issues/my
   */
  async getMyIssues(): Promise<IssueResult[]> {
    const response = await apiInstance.get<ApiResponse<IssueResult[]>>(
      '/issues/my'
    );

    return response.data.result;
  }

  /**
   * 전체 Issue 목록 조회 API 호출
   * GET /api/issues
   */
  async getAllIssues(): Promise<IssueResult[]> {
    const response = await apiInstance.get<ApiResponse<IssueResult[]>>(
      '/issues'
    );

    return response.data.result;
  }

  /**
   * 특정 Issue 상세 정보 조회 API 호출
   * GET /api/issues/{issueId}
   */
  async getIssueById(issueId: number): Promise<IssueResult> {
    const response = await apiInstance.get<ApiResponse<IssueResult>>(
      `/issues/${issueId}`
    );

    return response.data.result;
  }
}

// 싱글톤 인스턴스 생성
export const issueApi = new IssueApi();
