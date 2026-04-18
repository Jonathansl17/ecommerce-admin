'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROLE, AUTH_ROUTES, AUTH_STRINGS } from '@/features/auth/constants/auth.constants';
import { STORE_URL } from '@/lib/constants/api.constants';
import { validateLoginForm, getFieldError } from '@/features/auth/shared/auth.validation';
import { loginUser } from '@/features/auth/shared/auth.api';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import type { ApiErrorResponse, FieldError, LoginFormData } from '@/features/auth/types/auth.types';

const INITIAL_FORM_DATA: LoginFormData = {
  email: '',
  password: '',
};

export function useLoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof LoginFormData) {
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

    const validationErrors = validateLoginForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData);

      if (response.usuario.rol !== ADMIN_ROLE) {
        window.location.href = STORE_URL;
        return;
      }

      auth.login(response.token, response.usuario);
      router.push(AUTH_ROUTES.DASHBOARD);
    } catch (err) {
      const apiError = err as ApiErrorResponse;

      if (apiError.errors && apiError.errors.length > 0) {
        setErrors(apiError.errors);
      } else if (apiError.error) {
        setErrors([
          {
            field: 'general',
            message: AUTH_STRINGS.errors.invalidCredentials,
          },
        ]);
      } else {
        setErrors([
          { field: 'general', message: AUTH_STRINGS.errors.connectionError },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    formData,
    loading,
    handleChange,
    handleSubmit,
    fieldError,
  };
}
