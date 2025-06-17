import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useLocalSearchParams } from 'expo-router';

// Components
import IssueFormHeader from '@/modules/issues/components/Creation/Issue/IssueFormHeader';
import IssueMetaInfoBanner from '@/modules/issues/components/Creation/Issue/IssueMetaInfoBanner';
import IssueSubmitButton from '@/modules/issues/components/Creation/Issue/IssueSubmitButton';
import IssueFormField from '@/modules/issues/components/IssueFormField';
import AssigneeAutoComplete from '@/modules/issues/components/Creation/AssigneeAutoComplete';
import { Text } from '@/components';

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
    addAssignee,
    removeAssignee,
    resetForm,
    handleSubmit,
  } = useIssueForm(params);

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <IssueFormHeader title="이슈 생성" onReset={resetForm} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {logData.isFromLog && (
            <IssueMetaInfoBanner
              isAnalyzing={isAnalyzing}
              logId={logData.logIds.length === 1 ? logData.logIds[0] : undefined}
              logIds={logData.logIds.length > 1 ? logData.logIds : undefined}
            />
          )}
          
          <Section title="기본 정보">
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
              numberOfLines={5}
              disabled={isAnalyzing}
            />
          </Section>

          <Section title="세부 정보">
            <AssigneeAutoComplete
              label="담당자"
              selectedAssignees={form.assignees}
              onAddAssignee={addAssignee}
              onRemoveAssignee={removeAssignee}
              placeholder="담당자 이름 또는 ID 검색"
              error={errors.assignees}
              disabled={isAnalyzing}
            />
            <IssueFormField
              label="태그"
              value={form.tags}
              onChangeText={updateField('tags')}
              placeholder="태그를 쉼표(,)로 구분하여 입력하세요"
              error={errors.tags}
              disabled={isAnalyzing}
            />
          </Section>

          <Section title="추가 정보 (선택사항)">
            <IssueFormField
              label="발생 위치"
              value={form.location}
              onChangeText={updateField('location')}
              placeholder="파일명 및 함수명 (예: JwtFilter.java)"
              error={errors.location}
              disabled={isAnalyzing}
            />
            <IssueFormField
              label="원인"
              value={form.cause}
              onChangeText={updateField('cause')}
              placeholder="예상되는 원인을 입력하세요"
              error={errors.cause}
              multiline
              numberOfLines={3}
              disabled={isAnalyzing}
            />
          </Section>
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
});
