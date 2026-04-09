import Link from 'next/link';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AUTH_STRINGS } from '@/lib/constants/auth.constants';
import type { LoginFormData } from '@/lib/types/auth.types';

const strings = AUTH_STRINGS.login;

interface LoginFormProps {
  formData: LoginFormData;
  loading: boolean;
  handleChange: (
    field: keyof LoginFormData
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  fieldError: (field: string) => string | undefined;
}

export function LoginForm({
  formData,
  loading,
  handleChange,
  handleSubmit,
  fieldError,
}: LoginFormProps) {
  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      {fieldError('general') && (
        <p role="alert" aria-live="polite" className="text-center text-sm text-red-500">
          {fieldError('general')}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            aria-describedby={
              fieldError('password') ? 'password-error' : undefined
            }
            autoComplete="current-password"
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
        {strings.noAccountText}{' '}
        <Link href="/register" className="font-medium text-foreground underline">
          {strings.registerLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
