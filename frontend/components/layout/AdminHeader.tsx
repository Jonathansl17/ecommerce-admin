'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/AuthContext';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventario de insumos',
  '/products': 'Stock de productos',
  '/sales': 'Ventas',
  '/custom-orders': 'Pedidos personalizados',
  '/reviews': 'Moderación de reseñas',
  '/users': 'Usuarios admin',
  '/notifications': 'Notificaciones',
};

interface AdminHeaderProps {
  onMenuOpen: () => void;
}

export function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle = pageTitles[pathname] ?? 'Dashboard';
  const isRoot = pathname === '/dashboard';

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur lg:px-6">
      {/* Izquierda — menú móvil + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuOpen}
          className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {isRoot ? (
          <span className="text-sm font-semibold text-foreground">{pageTitle}</span>
        ) : (
          <nav aria-label="Navegación" className="flex items-center gap-1 min-w-0">
            <Link
              href="/dashboard"
              className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate text-sm font-semibold text-foreground">{pageTitle}</span>
          </nav>
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
          aria-label={user?.fullName ?? 'Usuario'}
          title={user?.fullName}
        >
          <span className="text-sm font-semibold">{initials}</span>
        </div>
      </div>
    </header>
  );
}
