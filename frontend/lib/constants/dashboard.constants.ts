export const DASHBOARD_ROUTES = {
  PRODUCTS: '/productos',
  ORDERS: '/pedidos',
  CUSTOMERS: '/clientes',
} as const;

export const QUICK_LINKS = [
  {
    href: DASHBOARD_ROUTES.PRODUCTS,
    title: 'Gestionar productos',
    description: 'Administra el catálogo de productos, precios e inventario.',
  },
  {
    href: DASHBOARD_ROUTES.ORDERS,
    title: 'Ver pedidos',
    description: 'Revisa y gestiona los pedidos de los clientes.',
  },
  {
    href: DASHBOARD_ROUTES.CUSTOMERS,
    title: 'Gestionar clientes',
    description: 'Consulta la información y actividad de los clientes.',
  },
] as const;
