import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { router, useLocalSearchParams } from 'expo-router';
import { useToast } from '@/hooks/useToast';
import { useIssueStore } from '@/modules/issues/stores/issueStore';

// Components
import IssueFormHeader from '@/modules/issues/components/Creation/Issue/IssueFormHeader';
import IssueMetaInfoBanner from '@/modules/issues/components/Creation/Issue/IssueMetaInfoBanner';
import SectionLabel from '@/modules/issues/components/Creation/Common/SectionLabel';
import IssueTextInput from '@/modules/issues/components/Creation/Issue/IssueTextInput';
import IssueTextarea from '@/modules/issues/components/Creation/Issue/IssueTextarea';
import IssueSubmitButton from '@/modules/issues/components/Creation/Issue/IssueSubmitButton';

interface CreateIssueForm {
  title: string;
  description: string;
  assignee: string;
  tags: string;
  location: string;
  cause: string;
  reproductionSteps: string;
  solution: string;
  references: string;
}

// AI 분석 응답 타입은 issueApi.ts의 IssueMessage와 동일

export default function IssueCreateScreen() {
  const { colors } = useTheme();
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
  const params = useLocalSearchParams<{
    fromLog?: string;
    logId?: string;
    logIds?: string;
    multiSelect?: string;
    logMessage?: string;
    logLevel?: string;
    logApp?: string;
    logApps?: string;
    logLevels?: string;
  }>();

  const [form, setForm] = useState<CreateIssueForm>({
    title: '',
    description: '',
    assignee: '',
    tags: '',
    location: '',
    cause: '',
    reproductionSteps: '',
    solution: '',
    references: '',
  });

  // isSubmitting은 store의 isIssueCreating으로 대체
  const [errors, setErrors] = useState<Partial<CreateIssueForm>>({});

  // 로그에서 이슈 생성 시 AI 분석 수행
  useEffect(() => {
    if (params.fromLog === 'true') {
      // 다중 선택인지 단일 선택인지 확인
      const logIds = params.multiSelect === 'true' && params.logIds
        ? params.logIds.split(',')
        : params.logId 
        ? [params.logId]
        : [];

      if (logIds.length > 0) {
        // 추가 컨텍스트 정보 구성
        const apps = params.multiSelect === 'true' && params.logApps
          ? params.logApps.split(',').join(', ')
          : params.logApp || '';
        
        const levels = params.multiSelect === 'true' && params.logLevels
          ? [...new Set(params.logLevels.split(','))].join(', ')
          : params.logLevel || '';

        const additionalContext = `로그 앱: ${apps}, 로그 레벨: ${levels}${params.multiSelect === 'true' ? ', 다중 로그 분석 요청' : ''}`;

        createDraft({ 
          logIds, 
          additionalContext 
        });
      }
    }
  }, [params.fromLog, params.logId, params.logIds, params.multiSelect, params.logLevel, params.logApp, params.logApps, params.logLevels, createDraft]);

  // AI 분석 결과를 폼에 반영
  useEffect(() => {
    if (draftResult) {
      const analysisData = draftResult.message;
      
      // 다중 로그의 경우 앱과 레벨 정보도 합쳐서 태그에 포함
      const apps = params.multiSelect === 'true' && params.logApps
        ? params.logApps.split(',').join(', ')
        : params.logApp || '';
      
      const levels = params.multiSelect === 'true' && params.logLevels
        ? [...new Set(params.logLevels.split(','))].join(', ')
        : params.logLevel || '';

      setForm({
        title: analysisData.title,
        description: analysisData.description,
        assignee: '',
        tags: `${apps}, ${levels}, 인증, 보안${params.multiSelect === 'true' ? ', 다중로그분석' : ''}`,
        location: `${analysisData.location.file} - ${analysisData.location.function}`,
        cause: analysisData.cause,
        reproductionSteps: analysisData.reproduction_steps.join('\n'),
        solution: analysisData.solution,
        references: analysisData.references,
      });
    }
  }, [draftResult, params.multiSelect, params.logApps, params.logApp, params.logLevels, params.logLevel]);

  // 에러 처리
  useEffect(() => {
    if (draftError) {
      showError({ title: 'AI 분석 오류', message: draftError });
      clearError();
    }
  }, [draftError, showError, clearError]);

  // GitHub 이슈 생성 에러 처리
  useEffect(() => {
    if (issueCreateError) {
      showError({ title: 'GitHub 이슈 생성 오류', message: issueCreateError });
      clearError();
    }
  }, [issueCreateError, showError, clearError]);

  // 컴포넌트 unmount 시 cleanup
  useEffect(() => {
    return () => {
      clearDraft();
      clearIssue();
    };
  }, [clearDraft, clearIssue]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateIssueForm> = {};

    if (!form.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (!form.description.trim()) {
      newErrors.description = '설명을 입력해주세요';
    }

    if (form.title.length > 100) {
      newErrors.title = '제목은 100자 이내로 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // 로그 ID 목록 준비
    const logIds = params.multiSelect === 'true' && params.logIds
      ? params.logIds.split(',')
      : params.logId 
      ? [params.logId]
      : [];

    // 담당자 목록 준비 (빈 문자열이 아닐 경우에만)
    const assigneeUsernames = form.assignee.trim() 
      ? form.assignee.split(',').map(name => name.trim()).filter(name => name)
      : [];

    // 재현 단계 배열로 변환
    const reproductionSteps = form.reproductionSteps.trim()
      ? form.reproductionSteps.split('\n').map(step => step.trim()).filter(step => step)
      : [];

    // 위치 정보 파싱 (예: "JwtAuthenticationFilter.java - filter()")
    const locationParts = form.location.includes(' - ') 
      ? form.location.split(' - ')
      : [form.location, ''];

    const issueData = {
      title: form.title,
      description: form.description,
      logIds,
      assigneeUsernames,
      cause: form.cause || undefined,
      solution: form.solution || undefined,
      reproductionSteps,
      references: form.references || undefined,
      locationFile: locationParts[0] || undefined,
      locationFunction: locationParts[1] || undefined,
    };

    console.log('GitHub 이슈 생성 데이터:', issueData);

    const success = await createGithubIssue(issueData);

    if (success) {
      showSuccess({
        title: '이슈 생성 완료',
        message: '새로운 GitHub 이슈가 성공적으로 생성되었습니다.'
      });

      // 성공 시 메인 탭으로 이동
      router.push('/(app)/(tabs)');
    }
  };

  const handleReset = () => {
    setForm({
      title: '',
      description: '',
      assignee: '',
      tags: '',
      location: '',
      cause: '',
      reproductionSteps: '',
      solution: '',
      references: '',
    });
    setErrors({});
  };

  const updateFormField = (field: keyof CreateIssueForm) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <IssueFormHeader title="이슈 생성" onReset={handleReset} />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <IssueMetaInfoBanner
            isAnalyzing={isDraftCreating}
            fromLog={params.fromLog === 'true'}
            logId={params.multiSelect === 'true' ? undefined : params.logId}
            logIds={params.multiSelect === 'true' ? params.logIds?.split(',') : undefined}
            multiSelect={params.multiSelect === 'true'}
          />

          {/* Title Section */}
          <View style={styles.section}>
            <SectionLabel text="제목" required />
            <IssueTextInput
              value={form.title}
              onChangeText={updateFormField('title')}
              placeholder="이슈의 제목을 입력하세요"
              error={errors.title}
              maxLength={100}
            />
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <SectionLabel text="설명" required />
            <IssueTextarea
              value={form.description}
              onChangeText={updateFormField('description')}
              placeholder="이슈에 대한 자세한 설명을 입력하세요"
              error={errors.description}
              numberOfLines={4}
            />
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <SectionLabel text="발생 위치" />
            <IssueTextInput
              value={form.location}
              onChangeText={updateFormField('location')}
              placeholder="파일명 및 함수명 (예: JwtAuthenticationFilter.java - filter())"
            />
          </View>

          {/* Cause Section */}
          <View style={styles.section}>
            <SectionLabel text="원인" />
            <IssueTextarea
              value={form.cause}
              onChangeText={updateFormField('cause')}
              placeholder="이슈 발생 원인을 입력하세요"
              numberOfLines={3}
            />
          </View>

          {/* Reproduction Steps Section */}
          <View style={styles.section}>
            <SectionLabel text="문제 발생 조건" />
            <IssueTextarea
              value={form.reproductionSteps}
              onChangeText={updateFormField('reproductionSteps')}
              placeholder="이슈 재현 방법을 단계별로 입력하세요"
              numberOfLines={4}
            />
          </View>

          {/* Solution Section */}
          <View style={styles.section}>
            <SectionLabel text="해결 방안" />
            <IssueTextarea
              value={form.solution}
              onChangeText={updateFormField('solution')}
              placeholder="제안하는 해결 방안을 입력하세요"
              numberOfLines={3}
            />
          </View>

          {/* References Section */}
          <View style={styles.section}>
            <SectionLabel text="관련 파일" />
            <IssueTextInput
              value={form.references}
              onChangeText={updateFormField('references')}
              placeholder="관련 파일들을 쉼표로 구분하여 입력하세요"
            />
          </View>

          {/* Assignee Section */}
          <View style={styles.section}>
            <SectionLabel text="담당자" />
            <IssueTextInput
              value={form.assignee}
              onChangeText={updateFormField('assignee')}
              placeholder="담당자를 입력하세요 (선택사항)"
            />
          </View>

          {/* Tags Section */}
          <View style={styles.section}>
            <SectionLabel text="태그" />
            <IssueTextInput
              value={form.tags}
              onChangeText={updateFormField('tags')}
              placeholder="태그를 쉼표로 구분하여 입력하세요"
            />
          </View>
        </ScrollView>

        <IssueSubmitButton
          onPress={handleSubmit}
          disabled={isDraftCreating || isIssueCreating}
          isLoading={isIssueCreating}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
});
