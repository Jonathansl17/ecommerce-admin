import Link from 'next/link';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AUTH_STRINGS } from '@/lib/constants/auth.constants';
import type { RegisterFormData } from '@/lib/types/auth.types';

const strings = AUTH_STRINGS.register;

interface RegisterFormProps {
  formData: RegisterFormData;
  loading: boolean;
  handleChange: (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  fieldError: (field: string) => string | undefined;
}

export function RegisterForm({
  formData,
  loading,
  handleChange,
  handleSubmit,
  fieldError,
}: RegisterFormProps) {
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
