'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { AUTH_STRINGS } from '@/lib/constants/auth.constants';
import { QUICK_LINKS } from '@/lib/constants/dashboard.constants';

const strings = AUTH_STRINGS.dashboard;

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{strings.pageTitle}</h1>
        <p className="mt-1 text-foreground/70">
          {strings.greeting} {user?.fullName}. {strings.pageSubtitle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-lg border border-foreground/10 bg-background p-6 hover:border-foreground/30 transition-colors"
          >
            <h2 className="text-base font-semibold text-foreground">
              {link.title}
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              {link.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
