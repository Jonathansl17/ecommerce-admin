import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { FormGeneralError } from '@/components/auth/FormGeneralError';
import { Button } from '@/components/ui/Button';
import { AUTH_ROUTES, AUTH_STRINGS } from '@/features/auth/constants/auth.constants';
import type { RegisterFormProps } from '@/features/auth/types/auth.types';

const strings = AUTH_STRINGS.register;

export function RegisterForm({
  formData,
  loading,
  handleChange,
  handleSubmit,
  fieldError,
}: RegisterFormProps) {
  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      <FormGeneralError message={fieldError('general')} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField
          id="fullName"
          label={strings.fullNameLabel}
          type="text"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          placeholder={strings.fullNamePlaceholder}
          autoComplete="name"
          error={fieldError('fullName')}
        />

        <AuthField
          id="email"
          label={strings.emailLabel}
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder={strings.emailPlaceholder}
          autoComplete="email"
          error={fieldError('email')}
        />

        <AuthField
          id="password"
          label={strings.passwordLabel}
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          placeholder={strings.passwordPlaceholder}
          autoComplete="new-password"
          error={fieldError('password')}
        />

        <AuthField
          id="confirmPassword"
          label={strings.confirmPasswordLabel}
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          placeholder={strings.confirmPasswordPlaceholder}
          autoComplete="new-password"
          error={fieldError('confirmPassword')}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={loading}
          loadingText={strings.submittingButton}
        >
          {strings.submitButton}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/70">
        {strings.hasAccountText}{' '}
        <Link href={AUTH_ROUTES.LOGIN} className="font-medium text-foreground underline">
          {strings.loginLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
