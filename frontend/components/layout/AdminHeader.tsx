'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Home } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { DASHBOARD_ROUTE, HEADER_CONFIG, PAGE_TITLES } from './adminHeader.constants';

interface AdminHeaderProps {
  onMenuOpen: () => void;
}

function buildInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, HEADER_CONFIG.INITIALS_MAX_LENGTH)
    .join('')
    .toUpperCase();
}

export function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isRoot = pathname === DASHBOARD_ROUTE;
  const initials = user?.fullName
    ? buildInitials(user.fullName)
    : HEADER_CONFIG.INITIALS_FALLBACK;

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur lg:px-6">
      {/* Izquierda — menú móvil + home */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuOpen}
          className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {!isRoot && (
          <Link
            href={DASHBOARD_ROUTE}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Inicio"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* Derecha — usuario */}
      <div className="flex shrink-0 items-center gap-3">
        {user?.fullName && (
          <span className="hidden text-sm text-muted-foreground sm:block truncate max-w-[160px]">
            {user.fullName}
          </span>
        )}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label={user?.fullName ?? HEADER_CONFIG.INITIALS_FALLBACK}
          title={user?.fullName}
        >
          <span className="text-sm font-semibold">{initials}</span>
        </div>
      </div>
    </header>
  );
}
