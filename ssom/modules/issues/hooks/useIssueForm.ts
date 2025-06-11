import { useReducer, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { useToast } from '@/hooks/useToast';
import { useIssueStore } from '../stores/issueStore';
import { IssueFormData, ValidationErrors, validateForm, getFirstErrorField } from '../utils/validators';
import { LogParams, parseLogParams } from '../utils/parseLogParams';

// Form Action Types
type FormAction =
  | { type: 'SET_FIELD'; field: keyof IssueFormData; value: string }
  | { type: 'SET_FORM'; form: IssueFormData }
  | { type: 'RESET_FORM' }
  | { type: 'SET_ERRORS'; errors: ValidationErrors }
  | { type: 'CLEAR_ERROR'; field: keyof IssueFormData };

// Form State
interface FormState {
  form: IssueFormData;
  errors: ValidationErrors;
}

const initialForm: IssueFormData = {
  title: '',
  description: '',
  assignee: '',
  tags: '',
  location: '',
  cause: '',
  reproductionSteps: '',
  solution: '',
  references: '',
};

const initialState: FormState = {
  form: initialForm,
  errors: {},
};

// Form Reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'SET_FORM':
      return {
        ...state,
        form: action.form,
      };
    case 'RESET_FORM':
      return initialState;
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: undefined },
      };
    default:
      return state;
  }
}

export function useIssueForm(params: LogParams) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { showError, showSuccess } = useToast();
  
  const { 
    createDraft, 
    draftResult, 
    isDraftCreating, 
    draftError, 
    createGithubIssue, 
    isIssueCreating, 
    issueCreateError, 
    clearDraft, 
    clearIssue, 
    clearError 
  } = useIssueStore();

  // Parse log parameters
  const logData = parseLogParams(params);

  // AI 분석 호출
  useEffect(() => {
    if (logData.isFromLog && logData.logIds.length > 0) {
      createDraft({ 
        logIds: logData.logIds, 
        additionalContext: logData.additionalContext 
      });
    }
  }, [logData.isFromLog, logData.logIds.length, logData.additionalContext, createDraft]);

  // AI 분석 결과를 폼에 반영
  useEffect(() => {
    if (draftResult) {
      const analysisData = draftResult.message;
      
      dispatch({
        type: 'SET_FORM',
        form: {
          title: analysisData.title,
          description: analysisData.description,
          assignee: '',
          tags: logData.tagsFromLogs,
          location: `${analysisData.location.file} - ${analysisData.location.function}`,
          cause: analysisData.cause,
          reproductionSteps: analysisData.reproduction_steps.join('\n'),
          solution: analysisData.solution,
          references: analysisData.references,
        }
      });
    }
  }, [draftResult, logData.tagsFromLogs]);

  // Draft 에러 처리
  useEffect(() => {
    if (draftError) {
      showError({ title: 'AI 분석 오류', message: draftError });
      clearError();
    }
  }, [draftError, showError, clearError]);

  // 이슈 생성 에러 처리
  useEffect(() => {
    if (issueCreateError) {
      showError({ title: 'GitHub 이슈 생성 오류', message: issueCreateError });
      clearError();
    }
  }, [issueCreateError, showError, clearError]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearDraft();
      clearIssue();
    };
  }, [clearDraft, clearIssue]);

  // Field 업데이트 함수
  const updateField = useCallback((field: keyof IssueFormData) => (value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // 폼 리셋
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // 폼 유효성 검사
  const validateAndSetErrors = useCallback((): boolean => {
    const validationErrors = validateForm(state.form);
    dispatch({ type: 'SET_ERRORS', errors: validationErrors });
    return Object.keys(validationErrors).length === 0;
  }, [state.form]);

  // 이슈 생성 처리
  const handleSubmit = useCallback(async () => {
    if (!validateAndSetErrors()) {
      const firstErrorField = getFirstErrorField(state.errors);
      if (firstErrorField) {
        // TODO: 첫 번째 에러 필드로 스크롤 (ScrollView ref 필요)
        console.warn(`첫 번째 에러 필드: ${firstErrorField}`);
      }
      return;
    }

    // 담당자 목록 준비
    const assigneeUsernames = state.form.assignee.trim() 
      ? state.form.assignee.split(',').map(name => name.trim()).filter(name => name)
      : [];

    // 재현 단계 배열로 변환
    const reproductionSteps = state.form.reproductionSteps.trim()
      ? state.form.reproductionSteps.split('\n').map(step => step.trim()).filter(step => step)
      : [];

    // 위치 정보 파싱
    const locationParts = state.form.location.includes(' - ') 
      ? state.form.location.split(' - ')
      : [state.form.location, ''];

    const issueData = {
      title: state.form.title,
      description: state.form.description,
      logIds: logData.logIds,
      assigneeUsernames,
      cause: state.form.cause || undefined,
      solution: state.form.solution || undefined,
      reproductionSteps,
      references: state.form.references || undefined,
      locationFile: locationParts[0] || undefined,
      locationFunction: locationParts[1] || undefined,
    };

    try {
      await createGithubIssue(issueData);
      showSuccess({
        title: '이슈 생성 완료',
        message: '새로운 GitHub 이슈가 성공적으로 생성되었습니다.'
      });

      // 성공 시 메인 탭으로 이동 (딜레이 포함)
      setTimeout(() => {
        router.push('/(app)/(tabs)');
      }, 500);
    } catch (error) {
      // Store에서 이미 에러 처리됨
    }
  }, [state.form, state.errors, validateAndSetErrors, logData.logIds, createGithubIssue, showSuccess]);

  return {
    // State
    form: state.form,
    errors: state.errors,
    isAnalyzing: isDraftCreating,
    isSubmitting: isIssueCreating,
    logData,
    
    // Actions
    updateField,
    resetForm,
    handleSubmit,
  };
} 