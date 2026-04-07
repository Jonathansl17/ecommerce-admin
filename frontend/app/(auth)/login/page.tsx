import Link from 'next/link';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AUTH_STRINGS } from '@/lib/constants/auth.constants';

export default function LoginPage() {
  const strings = AUTH_STRINGS.login;

  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {strings.emailLabel}
          </label>
          <Input
            type="email"
            disabled
            placeholder={strings.emailPlaceholder}
            className="opacity-50 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {strings.passwordLabel}
          </label>
          <Input
            type="password"
            disabled
            placeholder={strings.passwordPlaceholder}
            className="opacity-50 cursor-not-allowed"
          />
        </div>

        <Button type="button" disabled>
          {strings.comingSoon}
        </Button>
      </div>

      <p className="text-center text-sm text-foreground/70">
        {strings.noAccountText}{' '}
        <Link href="/register" className="font-medium text-foreground underline">
          {strings.registerLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
