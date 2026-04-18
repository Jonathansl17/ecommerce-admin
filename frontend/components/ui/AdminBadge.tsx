'use client';

import { useAuth } from '@/features/auth/hooks/AuthContext';
import { AUTH_STRINGS } from '@/features/auth/constants/auth.constants';

const badgeLabel = AUTH_STRINGS.dashboard.adminBadgeLabel;

export function AdminBadge() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      role="status"
      aria-label={badgeLabel}
      className="fixed top-4 right-4 z-50 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full shadow-lg"
    >
      {badgeLabel}
    </div>
  );
}
