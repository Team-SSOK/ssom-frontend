import { LogEntry } from '../types';

export interface LogIssueParams {
  fromLog: string;
  logIds: string;
  multiSelect: string;
  logApps: string;
  logLevels: string;
}

/**
 * 선택된 로그들을 기반으로 이슈 생성 페이지에 전달할 파라미터를 구성합니다.
 * @param selectedLogs - 선택된 로그 목록
 * @param isMultiple - 다중 선택 여부 (기본값: true)
 * @returns 이슈 생성 페이지에 전달할 파라미터 객체
 */
export function buildLogIssueParams(
  selectedLogs: LogEntry[], 
  isMultiple: boolean = true
): LogIssueParams {
  if (selectedLogs.length === 0) {
    throw new Error('최소 하나의 로그를 선택해야 합니다.');
  }

  const logIds = selectedLogs.map(log => log.logId);
  const apps = selectedLogs.map(log => log.app);
  const levels = selectedLogs.map(log => log.level);

  // 중복 제거
  const uniqueApps = [...new Set(apps)];
  const uniqueLevels = [...new Set(levels)];

  return {
    fromLog: 'true',
    logIds: logIds.join(','),
    multiSelect: isMultiple ? 'true' : 'false',
    logApps: uniqueApps.join(','),
    logLevels: uniqueLevels.join(','),
  };
}

/**
 * 단일 로그 선택을 위한 편의 함수
 * @param log - 선택된 단일 로그
 * @returns 이슈 생성 페이지에 전달할 파라미터 객체
 */
export function buildSingleLogIssueParams(log: LogEntry): LogIssueParams {
  return buildLogIssueParams([log], false);
}

/**
 * 로그 파라미터의 유효성을 검사합니다.
 * @param params - 검사할 파라미터 객체
 * @returns 유효성 검사 결과
 */
export function validateLogIssueParams(params: LogIssueParams): boolean {
  return !!(
    params.fromLog === 'true' &&
    params.logIds &&
    params.logApps &&
    params.logLevels
  );
} 