'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { QUICK_LINKS } from '@/lib/constants/dashboard.constants';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Hola, <span className="font-medium text-foreground">{user?.fullName}</span>. Gestiona productos, pedidos y usuarios.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/30"
          >
            <h2 className="text-base font-semibold text-foreground">{link.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
