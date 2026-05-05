import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { FormGeneralError } from '@/components/auth/FormGeneralError';
import { Button } from '@/components/ui/Button';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';
import { PASSWORD_RECOVERY_STRINGS } from '@/features/password-recovery/constants/password-recovery.constants';
import type { ForgotPasswordFormProps } from '@/features/password-recovery/types/password-recovery.types';

const strings = PASSWORD_RECOVERY_STRINGS.forgotPassword;

export function ForgotPasswordForm({
  formData,
  loading,
  successMessage,
  handleChange,
  handleSubmit,
  fieldError,
}: ForgotPasswordFormProps) {
  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      <FormGeneralError message={fieldError('general')} />

      {successMessage ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900">
          {successMessage}
        </p>
      ) : null}

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

        <Button type="submit" isLoading={loading} loadingText={strings.submittingButton}>
          {strings.submitButton}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/70">
        <Link href={AUTH_ROUTES.LOGIN} className="font-medium text-foreground underline">
          {strings.backToLogin}
        </Link>
      </p>
    </AuthLayout>
  );
}
