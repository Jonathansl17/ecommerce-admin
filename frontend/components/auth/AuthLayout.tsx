import type { AuthLayoutProps } from '@/features/auth/types/auth.types';

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-foreground/70">{subtitle}</p>
        </div>
        {children}
      </div>
    </main>
  );
}
