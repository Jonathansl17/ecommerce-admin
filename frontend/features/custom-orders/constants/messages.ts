import type { CustomOrderStatus } from '../types/custom-orders.types';

export const CUSTOM_ORDERS_MESSAGES = {
  page: {
    title: 'Pedidos personalizados',
    subtitle: 'Gestiona el estado de los pedidos personalizados desde el tablero kanban.',
  },
  board: {
    loading: 'Cargando pedidos personalizados...',
    empty: 'No hay pedidos personalizados.',
    emptyColumn: 'Sin pedidos',
  },
  card: {
    product: 'Producto',
    client: 'Cliente',
    details: 'Detalles',
    noDetails: 'Sin detalles adicionales',
    createdAt: 'Recibido el',
    stock: 'Stock disponible',
    moveTo: 'Mover a',
    updating: 'Actualizando...',
  },
  errors: {
    fetch: 'No se pudieron cargar los pedidos personalizados.',
    updateStatus: 'No se pudo actualizar el estado del pedido.',
    stockInsuficiente: 'Stock insuficiente para completar este pedido.',
    notFound: 'Este pedido ya no existe.',
    unknown: 'Ocurrió un error inesperado. Intentá de nuevo.',
    networkError: 'No se pudo actualizar el estado. Intentá de nuevo.',
  },
  tabs: {
    stockProductos: 'Stock de productos',
    pedidosPersonalizados: 'Pedidos personalizados',
  },
} as const;

export const CUSTOM_ORDER_STATUS_LABELS: Record<CustomOrderStatus, string> = {
  received: 'Recibido',
  in_process: 'En proceso',
  ready: 'Listo',
  sold: 'Vendido',
  rejected: 'Rechazado',
};
