export const CUSTOM_ORDERS_STRINGS = {
  page: {
    title: 'Pedidos personalizados',
    filterPending: 'Pendientes',
    filterAccepted: 'Aceptados',
    filterAll: 'Todos',
    ariaTabList: 'Filtrar pedidos personalizados',
    ariaOrderList: 'Lista de pedidos personalizados',
    ariaLoading: 'Cargando pedidos personalizados',
    ariaPendingCount: (n: number) => `${n} pedido${n === 1 ? '' : 's'} pendiente${n === 1 ? '' : 's'}`,
    ariaAcceptedCount: (n: number) => `${n} pedido${n === 1 ? '' : 's'} aceptado${n === 1 ? '' : 's'}`,
    ariaAllCount: (n: number) => `${n} pedido${n === 1 ? '' : 's'} en total`,
  },
  empty: {
    pending: 'Sin pedidos pendientes',
    pendingSubtitle: 'Todos los pedidos personalizados han sido revisados.',
    all: 'Sin pedidos personalizados',
    allSubtitle: 'Cuando lleguen pedidos con personalización aparecerán aquí.',
  },
  card: {
    orderIdLabel: 'Pedido',
    clientLabel: 'Cliente',
    shippingLabel: 'Envío a',
    totalLabel: 'Total',
    unitPrice: 'c/u',
    productsLabel: 'Productos',
    statusPending: 'Pendiente',
    statusAccepted: 'Aceptada',
    statusRejected: 'Rechazada',
    actionAccept: 'Aceptar',
    actionReject: 'Rechazar',
    actionConfirmReject: 'Confirmar rechazo',
    actionCancelReject: 'Cancelar',
    rejectionPlaceholder: 'Motivo del rechazo (opcional)...',
    rejectionReasonLabel: 'Motivo',
    ariaAccept: (orderId: string) => `Aceptar personalización del pedido ${orderId}`,
    ariaReject: (orderId: string) => `Rechazar personalización del pedido ${orderId}`,
    ariaConfirmReject: 'Confirmar rechazo de personalización',
    ariaCancelReject: 'Cancelar rechazo',
    justNow: 'Justo ahora',
    minutesAgo: (n: number) => `hace ${n} minuto${n === 1 ? '' : 's'}`,
    hoursAgo: (n: number) => `hace ${n} hora${n === 1 ? '' : 's'}`,
    daysAgo: (n: number) => `hace ${n} día${n === 1 ? '' : 's'}`,
    customizationSectionLabel: 'Personalización solicitada',
    budgetLabel: 'Presupuesto del cliente',
    contactLabel: 'Contactar cliente',
    contactSubject: (orderId: string) => `Tu pedido personalizado #${orderId} fue aceptado`,
    loadingLabel: 'Guardando...',
  },
  errors: {
    fetchError: 'No se pudieron cargar los pedidos personalizados',
    fetchErrorSubtitle: 'Verifica tu conexión e intenta de nuevo.',
    retryLabel: 'Reintentar',
  },
} as const;

export const ORDER_STATUS = { ACCEPTED: 'accepted', REJECTED: 'rejected' } as const;

export const BORDER_COLOR_CLASSES = {
  pending: 'border-l-amber-400',
  accepted: 'border-l-green-500',
  rejected: 'border-l-red-500',
} as const;

export type StatusFilter = 'pending' | 'accepted' | 'all';

export const CUSTOM_ORDER_CARD_STRINGS = CUSTOM_ORDERS_STRINGS.card;

export const SKELETON_COUNT = 3;

export const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'pending', label: CUSTOM_ORDERS_STRINGS.page.filterPending },
  { key: 'accepted', label: CUSTOM_ORDERS_STRINGS.page.filterAccepted },
  { key: 'all', label: CUSTOM_ORDERS_STRINGS.page.filterAll },
];
