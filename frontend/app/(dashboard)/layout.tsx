'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { ADMIN_ROLE, AUTH_ROUTES } from '@/lib/constants/auth.constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push(AUTH_ROUTES.LOGIN); return; }
    if (user?.rol !== ADMIN_ROLE) { router.push(AUTH_ROUTES.LOGIN); return; }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.rol !== ADMIN_ROLE) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar desktop */}
      <div className="hidden lg:block">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      {/* Sidebar móvil (overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64">
            <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        <AdminHeader collapsed={collapsed} onMenuOpen={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
