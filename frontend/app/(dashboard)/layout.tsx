'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { ADMIN_ROLE, AUTH_ROUTES, AUTH_STRINGS } from '@/lib/constants/auth.constants';
import { STORE_URL } from '@/lib/constants/api.constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const strings = AUTH_STRINGS.dashboard;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(AUTH_ROUTES.LOGIN);
      return;
    }

    if (user?.rol !== ADMIN_ROLE) {
      window.location.href = STORE_URL;
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.rol !== ADMIN_ROLE) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a
            href={AUTH_ROUTES.DASHBOARD}
            className="text-lg font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            {strings.navTitle}
          </a>

          <button
            onClick={logout}
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            {strings.logoutButton}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
