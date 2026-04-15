'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

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
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur lg:px-6 relative">
      {/* Izquierda — menú móvil + título */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          {!isRoot && (
            <nav className="flex items-center gap-1 text-xs text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Admin
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{pageTitle}</span>
            </nav>
          )}
          <h1 className="text-lg font-semibold leading-tight text-foreground">{pageTitle}</h1>
        </div>
      </div>

      {/* Centro — título del panel */}
      <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground">
        Panel Administrativo
      </span>

      {/* Derecha — acciones */}
      <div className="flex items-center gap-2">
        <Link
          href="/notifications"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Bell className="h-5 w-5" />
        </Link>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <span className="text-sm font-semibold">{initials}</span>
        </div>
      </div>
    </header>
  );
}
