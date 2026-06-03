export const DASHBOARD_ROUTE = '/dashboard';

export const HEADER_CONFIG = {
  INITIALS_MAX_LENGTH: 2,
  INITIALS_FALLBACK: 'AD',
};

export const PAGE_TITLES: Record<string, string> = {
  [DASHBOARD_ROUTE]: 'Dashboard',
  '/inventory': 'Inventario de insumos',
  '/products': 'Stock de productos',
  '/sales': 'Ventas',
  '/custom-orders': 'Pedidos personalizados',
  '/reviews': 'Moderación de reseñas',
  '/users': 'Usuarios admin',
  '/notifications': 'Notificaciones',
  '/settings': 'Ajustes',
};
