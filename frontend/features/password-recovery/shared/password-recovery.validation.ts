import { AUTH_STRINGS } from '@/features/auth/constants/auth.constants';
import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN_REGEX,
} from '@/features/auth/constants/validation.constants';
import type {
  ForgotPasswordFormData,
  RecoveryFieldError,
  ResetPasswordFormData,
} from '@/features/password-recovery/types/password-recovery.types';

export function validateForgotPasswordForm(data: ForgotPasswordFormData): RecoveryFieldError[] {
  const errors: RecoveryFieldError[] = [];

  if (!data.email.trim()) {
    errors.push({ field: 'email', message: AUTH_STRINGS.validation.emailRequired });
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.push({ field: 'email', message: AUTH_STRINGS.validation.emailInvalid });
  }

  return errors;
}

export function validateResetPasswordForm(data: ResetPasswordFormData): RecoveryFieldError[] {
  const errors: RecoveryFieldError[] = [];

  if (!data.password) {
    errors.push({ field: 'password', message: AUTH_STRINGS.validation.passwordRequired });
  } else if (data.password.length < PASSWORD_MIN_LENGTH) {
    errors.push({ field: 'password', message: AUTH_STRINGS.validation.passwordMinLength });
  } else if (!PASSWORD_PATTERN_REGEX.test(data.password)) {
    errors.push({ field: 'password', message: AUTH_STRINGS.validation.passwordPattern });
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

export function getRecoveryFieldError(
  errors: RecoveryFieldError[],
  field: string
): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}
