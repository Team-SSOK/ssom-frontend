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

interface AIAnalysisResponse {
  title: string;
  description: string;
  location: {
    file: string;
    function: string;
  };
  cause: string;
  reproduction_steps: string[];
  log: string;
  solution: string;
  references: string;
}

export default function IssueCreateScreen() {
  const { colors } = useTheme();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateIssueForm>>({});

  // Mock AI 분석 데이터 (다중 로그 지원)
  const getMockAnalysisData = async (logIds: string[]): Promise<AIAnalysisResponse> => {
    console.log('AI 분석 요청 - Log IDs:', logIds);
    
    // 실제로는 서버 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000)); // 로딩 시뮬레이션
    
    const isMultiple = logIds.length > 1;
    
    return {
      title: isMultiple 
        ? `hotfix: 다중 로그 분석 - ${logIds.length}개 로그에서 공통 이슈 발견`
        : "hotfix: Authorization 헤더 누락 시 인증 오류 발생",
      description: isMultiple
        ? `${logIds.length}개의 로그를 분석한 결과, 공통적으로 발생하는 인증 관련 오류가 확인됨. 여러 서비스에서 동일한 패턴의 오류가 반복적으로 발생하고 있어 즉시 조치가 필요함.`
        : "운영 환경에서 Authorization 헤더가 없거나 형식이 올바르지 않은 요청에 대해 인증 오류가 발생하여 접근이 차단됨.",
      location: {
        file: "JwtAuthenticationFilter.java",
        function: "filter()"
      },
      cause: isMultiple
        ? `다중 로그 분석 결과, Authorization 헤더 검증 로직에서 일관된 문제가 발생. ${logIds.length}개의 로그에서 동일한 패턴 확인됨.`
        : "Authorization 헤더가 없거나 'Bearer ' 접두어가 없으면 인증 실패 처리로 바로 응답을 종료함.",
      reproduction_steps: isMultiple
        ? [
            `1. 분석된 ${logIds.length}개 로그 ID: ${logIds.join(', ')}`,
            "2. 각 로그에서 공통적으로 Authorization 헤더 관련 오류 발생",
            "3. 여러 서비스에서 동일한 인증 실패 패턴 반복",
            "4. 서버 로그에서 반복적인 'Authentication error' 확인"
          ]
        : [
            "1. 운영 환경에서 인증이 필요한 API 호출",
            "2. Authorization 헤더를 포함하지 않거나 'Bearer ' 접두어 없이 전송",
            "3. 서버 로그에서 'Authentication error: Authorization header is missing or invalid' 오류 확인"
          ],
      log: isMultiple
        ? `Multiple logs analyzed: ${logIds.join(', ')} - Authentication error: Authorization header is missing or invalid`
        : "Authentication error: Authorization header is missing or invalid",
      solution: isMultiple
        ? `다중 로그 분석을 통해 확인된 공통 이슈에 대한 통합 해결방안: 1) 클라이언트 측 Authorization 헤더 표준화, 2) 서버 측 헤더 검증 로직 개선, 3) 모니터링 강화로 재발 방지`
        : "클라이언트 요청 시 반드시 올바른 형식의 Authorization 헤더를 포함하도록 안내하고, 서버 측에서는 헤더 유효성 검사 로직을 명확히 문서화하여 재발 방지.",
      references: "JwtAuthenticationFilter.java, JwtAuthenticationEntryPoint.java, SecurityConfig.java"
    };
  };

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
        setIsAnalyzing(true);
        getMockAnalysisData(logIds)
          .then((analysisData) => {
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
          })
          .catch((error) => {
            console.error('AI 분석 실패:', error);
            Alert.alert('오류', 'AI 분석 중 오류가 발생했습니다.');
          })
          .finally(() => {
            setIsAnalyzing(false);
          });
      }
    }
  }, [params.fromLog, params.logId, params.logIds, params.multiSelect, params.logLevel, params.logApp, params.logApps, params.logLevels]);

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

    setIsSubmitting(true);

    try {
      // TODO: API 호출로 이슈 생성
      console.log('이슈 생성 데이터:', form);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API call

      // 성공 시 알림 및 이슈 리스트로 이동
      Alert.alert(
        '이슈 생성 완료',
        '새로운 이슈가 성공적으로 생성되었습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              router.push('/(app)/(tabs)');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        '오류',
        '이슈 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
        [{ text: '확인' }]
      );
    } finally {
      setIsSubmitting(false);
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
            isAnalyzing={isAnalyzing}
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
          disabled={isAnalyzing}
          isLoading={isSubmitting}
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
