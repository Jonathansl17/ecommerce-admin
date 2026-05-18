import type { CSSProperties } from 'react';
import type { OrderStatus } from '../types/orders.types';

export const ORDERS_API = {
  GET_ALL: '/orders',
  GET_ONE: (id: string) => `/orders/${id}`,
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  CANCEL: (id: string) => `/orders/${id}/cancel`,
} as const;

export const DEFAULT_LIMIT = 20;
export const PAGE_LIMIT_OPTIONS = [10, 20, 50] as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Pago pendiente',
  confirmed: 'Confirmado',
  in_preparation: 'En preparación',
  customization_in_progress: 'Personalización en proceso',
  ready_shipment: 'Listo para envío',
  shipped: 'Enviado',
  in_transit: 'En tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const ORDER_STATUS_BADGE_STYLES: Record<OrderStatus, CSSProperties> = {
  pending_payment: { backgroundColor: '#fef9c3', color: '#854d0e' },
  confirmed: { backgroundColor: '#dbeafe', color: '#1e40af' },
  in_preparation: { backgroundColor: '#ede9fe', color: '#5b21b6' },
  customization_in_progress: { backgroundColor: '#fce7f3', color: '#9d174d' },
  ready_shipment: { backgroundColor: '#d1fae5', color: '#065f46' },
  shipped: { backgroundColor: '#e0f2fe', color: '#0369a1' },
  in_transit: { backgroundColor: '#fff7ed', color: '#9a3412' },
  delivered: { backgroundColor: '#dcfce7', color: '#166534' },
  cancelled: { backgroundColor: '#fee2e2', color: '#991b1b' },
};

export const ORDER_STATUSES: OrderStatus[] = [
  'pending_payment',
  'confirmed',
  'in_preparation',
  'customization_in_progress',
  'ready_shipment',
  'shipped',
  'in_transit',
  'delivered',
  'cancelled',
];

export const ORDERS_STRINGS = {
  page: {
    title: 'Pedidos',
    subtitle: 'Consulta y gestiona los pedidos de los clientes.',
  },
  table: {
    colId: 'ID',
    colDate: 'Fecha',
    colClient: 'Cliente',
    colTotal: 'Total',
    colStatus: 'Estado',
    colActions: 'Acciones',
    viewDetail: 'Ver detalle',
    emptyMessage: 'No hay pedidos que coincidan con los filtros.',
  },
  filters: {
    statusLabel: 'Estado',
    statusAll: 'Todos los estados',
    fromLabel: 'Desde',
    toLabel: 'Hasta',
    applyButton: 'Aplicar',
    clearButton: 'Limpiar',
  },
  detail: {
    backToList: 'Volver a pedidos',
    sectionClient: 'Cliente',
    sectionShipping: 'Dirección de envío',
    sectionItems: 'Artículos del pedido',
    sectionPayments: 'Pagos',
    sectionTimeline: 'Historial de estados',
    noClient: 'Cliente no disponible',
    colItem: 'Artículo',
    colQty: 'Cantidad',
    colUnitPrice: 'Precio unitario',
    colLineTotal: 'Subtotal',
    colPaymentMethod: 'Método',
    colPaymentAmount: 'Monto',
    colPaymentStatus: 'Estado de pago',
    colPaymentRef: 'Referencia',
    colPaymentDate: 'Fecha',
    noPayments: 'No hay pagos registrados.',
    noItems: 'No hay artículos en este pedido.',
    unknownProduct: 'Producto desconocido',
    colorLabel: 'Color',
    sizeLabel: 'Talla',
  },
  status: {
    changeLabel: 'Cambiar estado',
    changingLabel: 'Actualizando...',
    cancelButton: 'Cancelar pedido',
    cancellingButton: 'Cancelando...',
    confirmCancelTitle: 'Cancelar pedido',
    confirmCancelMessage: '¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.',
    confirmCancelAccept: 'Sí, cancelar',
    confirmCancelDismiss: 'No, volver',
  },
  pagination: {
    prev: 'Anterior',
    next: 'Siguiente',
    showing: 'Mostrando',
    of: 'de',
    results: 'resultados',
  },
  errors: {
    fetchList: 'No se pudieron cargar los pedidos.',
    fetchDetail: 'No se pudo cargar el detalle del pedido.',
    updateStatus: 'No se pudo actualizar el estado del pedido.',
    cancel: 'No se pudo cancelar el pedido.',
    unknown: 'Ocurrió un error inesperado.',
  },
} as const;
