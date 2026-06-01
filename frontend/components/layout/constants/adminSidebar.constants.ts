import {
  LayoutDashboard,
  Archive,
  Boxes,
  Receipt,
  ClipboardList,
  MessageSquare,
  Users,
  Bell,
  Settings,
} from 'lucide-react';
import type { NavSection } from '../types/adminSidebar.types';

export const SIDEBAR_STRINGS = {
  LOGOUT_LABEL: 'Cerrar sesión',
} as const;

export const MAX_BADGE = 99;

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'GENERAL',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/notifications', label: 'Notificaciones', icon: Bell, showBadge: true },
    ],
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
      { href: '/sales', label: 'Pedidos', icon: Receipt },
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
      { href: '/settings', label: 'Ajustes', icon: Settings },
    ],
  },
];
