'use client';

import { useState } from 'react';
import { AUTH_STRINGS } from '@/features/auth/constants/auth.constants';
import { validateRegisterForm, getFieldError } from '@/features/auth/shared/auth.validation';
import { registerUser } from '@/features/auth/shared/auth.api';
import type { FieldError, RegisterFormData } from '@/features/auth/types/auth.types';

const INITIAL_FORM_DATA: RegisterFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof RegisterFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function fieldError(field: string): string | undefined {
    return getFieldError(errors, field);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    const validationErrors = validateRegisterForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const apiError = await registerUser(formData);

      if (apiError) {
        if (apiError.errors && apiError.errors.length > 0) {
          setErrors(apiError.errors);
        } else {
          setErrors([
            {
              field: 'general',
              message: apiError.error ?? AUTH_STRINGS.errors.unexpectedError,
            },
          ]);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setErrors([
        { field: 'general', message: AUTH_STRINGS.errors.connectionError },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return {
    formData,
    loading,
    success,
    handleChange,
    handleSubmit,
    fieldError,
  };
}
