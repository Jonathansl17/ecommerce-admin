import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { FormGeneralError } from '@/components/auth/FormGeneralError';
import { Button } from '@/components/ui/Button';
import { AUTH_ROUTES, AUTH_STRINGS } from '@/features/auth/constants/auth.constants';
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

        <div className="text-right text-sm">
          <Link
            href={AUTH_ROUTES.FORGOT_PASSWORD}
            className="font-medium text-foreground underline"
          >
            {strings.forgotPasswordLink}
          </Link>
        </div>

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
        <Link href={AUTH_ROUTES.REGISTER} className="font-medium text-foreground underline">
          {strings.registerLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
