export interface IssueFormData {
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
  assignee: {
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

export function validateField(
  fieldName: string, 
  value: string, 
  schema: ValidationSchema = issueFormSchema
): string | undefined {
  const rule = schema[fieldName];
  if (!rule) return undefined;

  const trimmedValue = value.trim();

  // Required 체크
  if (rule.required && !trimmedValue) {
    return `${getFieldDisplayName(fieldName)}을(를) 입력해주세요`;
  }

  // 값이 없고 required가 아니면 검증 통과
  if (!trimmedValue && !rule.required) {
    return undefined;
  }

  // 최소 길이 체크
  if (rule.minLength && trimmedValue.length < rule.minLength) {
    return `${getFieldDisplayName(fieldName)}은(는) 최소 ${rule.minLength}자 이상이어야 합니다`;
  }

  // 최대 길이 체크
  if (rule.maxLength && trimmedValue.length > rule.maxLength) {
    return `${getFieldDisplayName(fieldName)}은(는) ${rule.maxLength}자 이내로 입력해주세요`;
  }

  // 패턴 체크
  if (rule.pattern && !rule.pattern.test(trimmedValue)) {
    return `${getFieldDisplayName(fieldName)}의 형식이 올바르지 않습니다`;
  }

  // 커스텀 검증
  if (rule.custom) {
    return rule.custom(trimmedValue);
  }

  return undefined;
}

export function validateForm(
  formData: IssueFormData, 
  schema: ValidationSchema = issueFormSchema
): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(schema).forEach(fieldName => {
    const error = validateField(fieldName, formData[fieldName as keyof IssueFormData], schema);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
}

function getFieldDisplayName(fieldName: string): string {
  const displayNames: { [key: string]: string } = {
    title: '제목',
    description: '설명',
    assignee: '담당자',
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