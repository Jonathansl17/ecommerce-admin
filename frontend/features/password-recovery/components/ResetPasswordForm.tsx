import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { FormGeneralError } from '@/components/auth/FormGeneralError';
import { Button } from '@/components/ui/Button';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';
import { PASSWORD_RECOVERY_STRINGS } from '@/features/password-recovery/constants/password-recovery.constants';
import type { ResetPasswordFormProps } from '@/features/password-recovery/types/password-recovery.types';

const strings = PASSWORD_RECOVERY_STRINGS.resetPassword;

export function ResetPasswordForm({
  formData,
  loading,
  validatingToken,
  isTokenValid,
  successMessage,
  generalMessage,
  handleChange,
  handleSubmit,
  fieldError,
}: ResetPasswordFormProps) {
  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      <FormGeneralError message={fieldError('general') || generalMessage} />

      {successMessage ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900">
          {successMessage}
        </p>
      ) : null}

      {!successMessage ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            isLoading={loading || validatingToken}
            loadingText={validatingToken ? strings.validatingToken : strings.submittingButton}
            disabled={!isTokenValid}
          >
            {strings.submitButton}
          </Button>
        </form>
      ) : null}

      <p className="text-center text-sm text-foreground/70">
        <Link href={AUTH_ROUTES.LOGIN} className="font-medium text-foreground underline">
          {strings.backToLogin}
        </Link>
      </p>
    </AuthLayout>
  );
}
