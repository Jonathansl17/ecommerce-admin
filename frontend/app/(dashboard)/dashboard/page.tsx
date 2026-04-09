'use client';

import { useAuth } from '@/lib/context/AuthContext';

const PAGE_TITLE = 'Panel de Administración';
const PAGE_SUBTITLE = 'Bienvenido al panel administrativo. Gestiona productos, pedidos y usuarios.';

const QUICK_LINKS = [
  {
    href: '/productos',
    title: 'Gestionar productos',
    description: 'Administra el catálogo de productos, precios e inventario.',
  },
  {
    href: '/pedidos',
    title: 'Ver pedidos',
    description: 'Revisa y gestiona los pedidos de los clientes.',
  },
  {
    href: '/clientes',
    title: 'Gestionar clientes',
    description: 'Consulta la información y actividad de los clientes.',
  },
] as const;

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{PAGE_TITLE}</h1>
        <p className="mt-1 text-foreground/70">
          Hola, {user?.fullName}. {PAGE_SUBTITLE}
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
