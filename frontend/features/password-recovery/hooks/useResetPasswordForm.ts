'use client';

import { useEffect, useState } from 'react';
import { PASSWORD_RECOVERY_STRINGS } from '@/features/password-recovery/constants/password-recovery.constants';
import {
  resetPassword,
  validatePasswordRecoveryToken,
} from '@/features/password-recovery/shared/password-recovery.api';
import {
  getRecoveryFieldError,
  validateResetPasswordForm,
} from '@/features/password-recovery/shared/password-recovery.validation';
import type {
  PasswordRecoveryApiErrorResponse,
  RecoveryFieldError,
  ResetPasswordFormData,
} from '@/features/password-recovery/types/password-recovery.types';

const INITIAL_FORM_DATA: ResetPasswordFormData = {
  password: '',
  confirmPassword: '',
};

export function useResetPasswordForm(token: string | null) {
  const [formData, setFormData] = useState<ResetPasswordFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<RecoveryFieldError[]>([]);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();
  const [generalMessage, setGeneralMessage] = useState<string>();

  useEffect(() => {
    let active = true;

    async function runValidation() {
      if (!token) {
        if (!active) return;
        setIsTokenValid(false);
        setGeneralMessage(PASSWORD_RECOVERY_STRINGS.resetPassword.invalidToken);
        setValidatingToken(false);
        return;
      }

      try {
        await validatePasswordRecoveryToken(token);
        if (!active) return;
        setIsTokenValid(true);
        setGeneralMessage(undefined);
      } catch {
        if (!active) return;
        setIsTokenValid(false);
        setGeneralMessage(PASSWORD_RECOVERY_STRINGS.resetPassword.invalidToken);
      } finally {
        if (active) {
          setValidatingToken(false);
        }
      }
    }

    runValidation();

    return () => {
      active = false;
    };
  }, [token]);

  function handleChange(field: keyof ResetPasswordFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function fieldError(field: string): string | undefined {
    return getRecoveryFieldError(errors, field);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage(undefined);

    if (!token || !isTokenValid) {
      setErrors([
        {
          field: 'general',
          message: PASSWORD_RECOVERY_STRINGS.errors.invalidRecoveryToken,
        },
      ]);
      return;
    }

    const validationErrors = validateResetPasswordForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({ ...formData, token });
      setSuccessMessage(response.message);
      setIsTokenValid(false);
      setGeneralMessage(undefined);
      setFormData(INITIAL_FORM_DATA);
    } catch (err) {
      const apiError = err as PasswordRecoveryApiErrorResponse;
      if (apiError.errors && apiError.errors.length > 0) {
        setErrors(apiError.errors);
      } else if (apiError.error === PASSWORD_RECOVERY_STRINGS.errors.invalidRecoveryToken) {
        setErrors([
          {
            field: 'general',
            message: PASSWORD_RECOVERY_STRINGS.errors.invalidRecoveryToken,
          },
        ]);
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
    validatingToken,
    isTokenValid,
    successMessage,
    generalMessage,
    handleChange,
    handleSubmit,
    fieldError,
  };
}
