import type { OrderStatus } from '../types/orders.types';

export const ORDERS_API = {
  GET_ALL: '/orders',
  GET_ONE: (id: string) => `/orders/${id}`,
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  CANCEL: (id: string) => `/orders/${id}/cancel`,
  APPROVE_PAYMENT: (id: string, paymentId: string) => `/orders/${id}/payments/${paymentId}/approve`,
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

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_preparation: 'bg-violet-100 text-violet-800',
  customization_in_progress: 'bg-pink-100 text-pink-800',
  ready_shipment: 'bg-green-100 text-green-700',
  shipped: 'bg-sky-100 text-sky-700',
  in_transit: 'bg-orange-50 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const APPROVE_PAYMENT_BTN_COLOR = '#16a34a' as const;

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
    loading: 'Cargando pedido...',
    backToList: 'Volver a pedidos',
    sectionClient: 'Cliente',
    sectionShipping: 'Dirección de envío',
    sectionItems: 'Artículos del pedido',
    sectionPayments: 'Pagos',
    sectionTimeline: 'Historial de estados',
    noClient: 'Cliente no disponible',
    labelSubtotal: 'Subtotal:',
    labelTaxes: 'Impuestos:',
    labelTotal: 'Total:',
    labelClientName: 'Nombre',
    labelClientEmail: 'Email',
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
    approvePaymentButton: 'Aprobar pago',
    approvingLabel: '...',
    confirmApproveTitle: 'Aprobar pago',
    confirmApproveMessage: 'Esto marcará el pago como aprobado y moverá el pedido a "Confirmado". ¿Deseas continuar?',
    confirmApproveAccept: 'Sí, aprobar',
    confirmApproveDismiss: 'Cancelar',
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
    approvePayment: 'No se pudo aprobar el pago.',
    cancel: 'No se pudo cancelar el pedido.',
    unknown: 'Ocurrió un error inesperado.',
  },
} as const;
