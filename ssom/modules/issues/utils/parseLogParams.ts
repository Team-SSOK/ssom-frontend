export interface LogParams {
  fromLog?: string;
  logId?: string;
  logIds?: string;
  multiSelect?: string;
  logMessage?: string;
  logLevel?: string;
  logApp?: string;
  logApps?: string;
  logLevels?: string;
}

export interface ParsedLogData {
  isFromLog: boolean;
  isMultiSelect: boolean;
  logIds: string[];
  apps: string;
  levels: string;
  additionalContext: string;
  tagsFromLogs: string;
}

export function parseLogParams(params: LogParams): ParsedLogData {
  const isFromLog = params.fromLog === 'true';
  const isMultiSelect = params.multiSelect === 'true';
  
  // 로그 ID 목록 파싱
  const logIds = isMultiSelect && params.logIds
    ? params.logIds.split(',')
    : params.logId 
    ? [params.logId]
    : [];

  // 앱 정보 파싱
  const apps = isMultiSelect && params.logApps
    ? params.logApps.split(',').join(', ')
    : params.logApp || '';
  
  // 레벨 정보 파싱
  const levels = isMultiSelect && params.logLevels
    ? [...new Set(params.logLevels.split(','))].join(', ')
    : params.logLevel || '';

  // 추가 컨텍스트 생성
  const additionalContext = `로그 앱: ${apps}, 로그 레벨: ${levels}${isMultiSelect ? ', 다중 로그 분석 요청' : ''}`;

  // 태그 생성
  const tagsFromLogs = `${apps}, ${levels}, 인증, 보안${isMultiSelect ? ', 다중로그분석' : ''}`;

  return {
    isFromLog,
    isMultiSelect,
    logIds,
    apps,
    levels,
    additionalContext,
    tagsFromLogs,
  };
} 