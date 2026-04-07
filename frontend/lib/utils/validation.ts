import { AUTH_STRINGS } from '@/lib/constants/auth.constants';
import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN_REGEX,
} from '@/lib/constants/validation.constants';
import type { FieldError, RegisterFormData } from '@/lib/types/auth.types';

export function validateRegisterForm(data: RegisterFormData): FieldError[] {
  const errors: FieldError[] = [];

  if (!data.fullName.trim()) {
    errors.push({
      field: 'fullName',
      message: AUTH_STRINGS.validation.fullNameRequired,
    });
  }

  if (!data.email.trim()) {
    errors.push({
      field: 'email',
      message: AUTH_STRINGS.validation.emailRequired,
    });
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.push({
      field: 'email',
      message: AUTH_STRINGS.validation.emailInvalid,
    });
  }

  if (!data.password) {
    errors.push({
      field: 'password',
      message: AUTH_STRINGS.validation.passwordRequired,
    });
  } else if (data.password.length < PASSWORD_MIN_LENGTH) {
    errors.push({
      field: 'password',
      message: AUTH_STRINGS.validation.passwordMinLength,
    });
  } else if (!PASSWORD_PATTERN_REGEX.test(data.password)) {
    errors.push({
      field: 'password',
      message: AUTH_STRINGS.validation.passwordPattern,
    });
  }

  if (!data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: AUTH_STRINGS.validation.confirmPasswordRequired,
    });
  } else if (data.confirmPassword !== data.password) {
    errors.push({
      field: 'confirmPassword',
      message: AUTH_STRINGS.validation.passwordsMismatch,
    });
  }

  return errors;
}

export function getFieldError(
  errors: FieldError[],
  field: string
): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}
