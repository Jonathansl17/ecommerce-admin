'use client';

import { useAuth } from '@/lib/context/AuthContext';

const ADMIN_BADGE_TEXT = 'Panel Administrativo';

export function AdminBadge() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      role="status"
      aria-label={ADMIN_BADGE_TEXT}
      className="fixed top-4 right-4 z-50 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full shadow-lg"
    >
      {ADMIN_BADGE_TEXT}
    </div>
  );
}
