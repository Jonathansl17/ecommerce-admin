import Link from 'next/link';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthField } from '@/features/auth/components/minicomponents/AuthField';
import { FormGeneralError } from '@/features/auth/components/minicomponents/FormGeneralError';
import { Button } from '@/components/ui/Button';
import { AUTH_STRINGS } from '@/features/auth/constants/auth.constants';
import type { LoginFormProps } from '@/features/auth/types/auth.types';

const strings = AUTH_STRINGS.login;

export function LoginForm({
  formData,
  loading,
  handleChange,
  handleSubmit,
  fieldError,
}: LoginFormProps) {
  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      <FormGeneralError message={fieldError('general')} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          autoComplete="current-password"
          error={fieldError('password')}
        />

        <Button
          type="submit"
          isLoading={loading}
          loadingText={strings.submittingButton}
        >
          {strings.submitButton}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/70">
        {strings.noAccountText}{' '}
        <Link href="/register" className="font-medium text-foreground underline">
          {strings.registerLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
