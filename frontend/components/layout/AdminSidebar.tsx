'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Archive,
  Boxes,
  Receipt,
  ClipboardList,
  MessageSquare,
  Users,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/AuthContext';

const navSections = [
  {
    label: 'GENERAL',
    items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'INVENTARIO',
    items: [
      { href: '/inventory', label: 'Insumos', icon: Archive },
      { href: '/products', label: 'Stock de productos', icon: Boxes },
    ],
  },
  {
    label: 'COMERCIO',
    items: [
      { href: '/sales', label: 'Ventas', icon: Receipt },
      { href: '/custom-orders', label: 'Pedidos personalizados', icon: ClipboardList },
    ],
  },
  {
    label: 'MODERACIÓN',
    items: [{ href: '/reviews', label: 'Reseñas', icon: MessageSquare }],
  },
  {
    label: 'CONFIGURACIÓN',
    items: [
      { href: '/users', label: 'Usuarios admin', icon: Users },
      { href: '/notifications', label: 'Notificaciones', icon: Bell },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  return (
    <aside
      className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-border bg-card transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              {!collapsed && (
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </p>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          collapsed ? 'justify-center px-2' : ''
                        } ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          {!collapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-sm font-semibold">{initials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{user?.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>
    </aside>
  );
}
