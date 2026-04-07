'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AUTH_STRINGS } from '@/lib/constants/auth.constants';
import { validateRegisterForm, getFieldError } from '@/lib/utils/validation';
import { registerUser } from '@/lib/utils/api';
import type { FieldError, RegisterFormData } from '@/lib/types/auth.types';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strings = AUTH_STRINGS.register;

  function handleChange(field: keyof RegisterFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function fieldError(field: string): string | undefined {
    return getFieldError(errors, field);
  }

  async function handleSubmit(e: FormEvent) {
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

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            {strings.successTitle}
          </h1>
          <p className="text-foreground/70">{strings.successMessage}</p>
          <Link
            href="/login"
            className="inline-block rounded-md bg-foreground text-background px-6 py-2 font-medium hover:opacity-90 transition-opacity"
          >
            {strings.goToLogin}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      {fieldError('general') && (
        <p role="alert" className="text-center text-sm text-red-500">
          {fieldError('general')}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          id="fullName"
          label={strings.fullNameLabel}
          error={fieldError('fullName')}
        >
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            placeholder={strings.fullNamePlaceholder}
            hasError={!!fieldError('fullName')}
            aria-describedby={fieldError('fullName') ? 'fullName-error' : undefined}
            autoComplete="name"
          />
        </FormField>

        <FormField
          id="email"
          label={strings.emailLabel}
          error={fieldError('email')}
        >
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder={strings.emailPlaceholder}
            hasError={!!fieldError('email')}
            aria-describedby={fieldError('email') ? 'email-error' : undefined}
            autoComplete="email"
          />
        </FormField>

        <FormField
          id="password"
          label={strings.passwordLabel}
          error={fieldError('password')}
        >
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            placeholder={strings.passwordPlaceholder}
            hasError={!!fieldError('password')}
            aria-describedby={fieldError('password') ? 'password-error' : undefined}
            autoComplete="new-password"
          />
        </FormField>

        <FormField
          id="confirmPassword"
          label={strings.confirmPasswordLabel}
          error={fieldError('confirmPassword')}
        >
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder={strings.confirmPasswordPlaceholder}
            hasError={!!fieldError('confirmPassword')}
            aria-describedby={
              fieldError('confirmPassword') ? 'confirmPassword-error' : undefined
            }
            autoComplete="new-password"
          />
        </FormField>

        <Button
          type="submit"
          isLoading={loading}
          loadingText={strings.submittingButton}
        >
          {strings.submitButton}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/70">
        {strings.hasAccountText}{' '}
        <Link href="/login" className="font-medium text-foreground underline">
          {strings.loginLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
