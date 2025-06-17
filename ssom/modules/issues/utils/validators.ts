export interface IssueFormData {
  title: string;
  description: string;
  assignees: string[];
  tags: string;
  location: string;
  cause: string;
  reproductionSteps: string;
  solution: string;
  references: string;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface ValidationRule {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

type FieldName = keyof Omit<IssueFormData, 'assignees'>;

const issueFormSchema: ValidationSchema = {
  title: {
    required: true,
    maxLength: 100,
    minLength: 1,
  },
  description: {
    required: true,
    minLength: 1,
  },
  assignees: {
    required: false,
  },
  tags: {
    required: false,
  },
  location: {
    required: false,
  },
  cause: {
    required: false,
  },
  reproductionSteps: {
    required: false,
  },
  solution: {
    required: false,
  },
  references: {
    required: false,
  },
};

export function validateField(field: keyof Omit<IssueFormData, 'assignees'>, value: string): string | undefined {
  const rules = issueFormSchema[field];
  if (!rules) return undefined;

  const trimmedValue = value.trim();

  // Required 체크
  if (rules.required && !trimmedValue) {
    return `${getFieldDisplayName(field)}을(를) 입력해주세요`;
  }

  // 값이 없고 required가 아니면 검증 통과
  if (!trimmedValue && !rules.required) {
    return undefined;
  }

  // 최소 길이 체크
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return `${getFieldDisplayName(field)}은(는) 최소 ${rules.minLength}자 이상이어야 합니다`;
  }

  // 최대 길이 체크
  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return `${getFieldDisplayName(field)}은(는) ${rules.maxLength}자 이내로 입력해주세요`;
  }

  // 패턴 체크
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return `${getFieldDisplayName(field)}의 형식이 올바르지 않습니다`;
  }

  // 커스텀 검증
  if (rules.custom) {
    return rules.custom(trimmedValue);
  }

  return undefined;
}

export function validateForm(formData: IssueFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  const schema = issueFormSchema;

  Object.keys(schema).forEach(key => {
    const fieldName = key as keyof IssueFormData;
    if (fieldName === 'assignees') return; // assignees는 별도 처리

    const error = validateField(fieldName, formData[fieldName] as string);
    if (error) {
      errors[fieldName] = error;
    }
  });

  if (formData.assignees.length > 5) {
    errors.assignees = '담당자는 최대 5명까지 지정할 수 있습니다.';
  }

  return errors;
}

function getFieldDisplayName(fieldName: string): string {
  const displayNames: { [key: string]: string } = {
    title: '제목',
    description: '설명',
    assignees: '담당자',
    tags: '태그',
    location: '발생 위치',
    cause: '원인',
    reproductionSteps: '문제 발생 조건',
    solution: '해결 방안',
    references: '관련 파일',
  };

  return displayNames[fieldName] || fieldName;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(error => error !== undefined);
}

export function getFirstErrorField(errors: ValidationErrors): string | undefined {
  return Object.keys(errors).find(key => errors[key] !== undefined);
} 