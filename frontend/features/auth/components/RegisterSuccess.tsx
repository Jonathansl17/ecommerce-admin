import Link from 'next/link';
import { AUTH_STRINGS } from '@/features/auth/constants/auth.constants';

const strings = AUTH_STRINGS.register;

export function RegisterSuccess() {
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
