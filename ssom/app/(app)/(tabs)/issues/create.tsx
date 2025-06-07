import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLocalSearchParams } from 'expo-router';

// Components
import IssueFormHeader from '@/modules/issues/components/Creation/Issue/IssueFormHeader';
import IssueMetaInfoBanner from '@/modules/issues/components/Creation/Issue/IssueMetaInfoBanner';
import IssueSubmitButton from '@/modules/issues/components/Creation/Issue/IssueSubmitButton';
import IssueFormField from '@/modules/issues/components/IssueFormField';

// Hooks
import { useIssueForm } from '@/modules/issues/hooks/useIssueForm';
import { LogParams } from '@/modules/issues/utils/parseLogParams';

export default function IssueCreateScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams() as LogParams;
  
  const {
    form,
    errors,
    isAnalyzing,
    isSubmitting,
    logData,
    updateField,
    resetForm,
    handleSubmit,
  } = useIssueForm(params);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <IssueFormHeader title="이슈 생성" onReset={resetForm} />

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
            fromLog={logData.isFromLog}
            logId={logData.isMultiSelect ? undefined : logData.logIds[0]}
            logIds={logData.isMultiSelect ? logData.logIds : undefined}
            multiSelect={logData.isMultiSelect}
          />

          <IssueFormField
            label="제목"
            value={form.title}
            onChangeText={updateField('title')}
            placeholder="이슈의 제목을 입력하세요"
            required
            error={errors.title}
            maxLength={100}
            disabled={isAnalyzing}
          />

          <IssueFormField
            label="설명"
            value={form.description}
            onChangeText={updateField('description')}
            placeholder="이슈에 대한 자세한 설명을 입력하세요"
            required
            error={errors.description}
            multiline
            numberOfLines={4}
            disabled={isAnalyzing}
          />

          <IssueFormField
            label="발생 위치"
            value={form.location}
            onChangeText={updateField('location')}
            placeholder="파일명 및 함수명 (예: JwtAuthenticationFilter.java - filter())"
            error={errors.location}
            disabled={isAnalyzing}
          />

          <IssueFormField
            label="원인"
            value={form.cause}
            onChangeText={updateField('cause')}
            placeholder="이슈 발생 원인을 입력하세요"
            error={errors.cause}
            multiline
            numberOfLines={3}
            disabled={isAnalyzing}
          />

          <IssueFormField
            label="문제 발생 조건"
            value={form.reproductionSteps}
            onChangeText={updateField('reproductionSteps')}
            placeholder="이슈 재현 방법을 단계별로 입력하세요"
            error={errors.reproductionSteps}
            multiline
            numberOfLines={4}
            disabled={isAnalyzing}
          />

          <IssueFormField
            label="해결 방안"
            value={form.solution}
            onChangeText={updateField('solution')}
            placeholder="제안하는 해결 방안을 입력하세요"
            error={errors.solution}
            multiline
            numberOfLines={3}
            disabled={isAnalyzing}
          />

          <IssueFormField
            label="관련 파일"
            value={form.references}
            onChangeText={updateField('references')}
            placeholder="관련 파일들을 쉼표로 구분하여 입력하세요"
            error={errors.references}
            disabled={isAnalyzing}
          />

          <IssueFormField
            label="담당자"
            value={form.assignee}
            onChangeText={updateField('assignee')}
            placeholder="담당자를 입력하세요 (선택사항)"
            error={errors.assignee}
            disabled={isAnalyzing}
          />

          <IssueFormField
            label="태그"
            value={form.tags}
            onChangeText={updateField('tags')}
            placeholder="태그를 쉼표로 구분하여 입력하세요"
            error={errors.tags}
            disabled={isAnalyzing}
          />
        </ScrollView>

        <IssueSubmitButton
          onPress={handleSubmit}
          disabled={isAnalyzing || isSubmitting}
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
});
