'use client';

import { useState } from 'react';
import { PASSWORD_RECOVERY_STRINGS } from '@/features/password-recovery/constants/password-recovery.constants';
import { requestPasswordRecovery } from '@/features/password-recovery/shared/password-recovery.api';
import {
  getRecoveryFieldError,
  validateForgotPasswordForm,
} from '@/features/password-recovery/shared/password-recovery.validation';
import type {
  ForgotPasswordFormData,
  PasswordRecoveryApiErrorResponse,
  RecoveryFieldError,
} from '@/features/password-recovery/types/password-recovery.types';

const INITIAL_FORM_DATA: ForgotPasswordFormData = {
  email: '',
};

export function useForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<RecoveryFieldError[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();

  function handleChange(field: keyof ForgotPasswordFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setSuccessMessage(undefined);
    };
  }

  function fieldError(field: string): string | undefined {
    return getRecoveryFieldError(errors, field);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage(undefined);

    const validationErrors = validateForgotPasswordForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await requestPasswordRecovery(formData);
      setSuccessMessage(response.message);
    } catch (err) {
      const apiError = err as PasswordRecoveryApiErrorResponse;
      if (apiError.errors && apiError.errors.length > 0) {
        setErrors(apiError.errors);
      } else {
        setErrors([
          {
            field: 'general',
            message: PASSWORD_RECOVERY_STRINGS.errors.connectionError,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    formData,
    loading,
    successMessage,
    handleChange,
    handleSubmit,
    fieldError,
  };
}
