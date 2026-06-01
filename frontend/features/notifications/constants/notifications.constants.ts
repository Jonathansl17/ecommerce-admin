export const NOTIFICATION_STRINGS = {
  page: {
    title: 'Notificaciones',
    markAllRead: 'Marcar todas como leídas',
    filterAll: 'Todas',
    filterUnread: 'No leídas',
    filterRead: 'Leídas',
    empty: 'Sin notificaciones',
    emptySubtitle: 'Aquí aparecerán las notificaciones de nuevos pedidos y reseñas.',
    emptyUnread: 'Estás al día',
    emptyUnreadSubtitle: 'No tienes notificaciones sin leer.',
    emptyRead: 'Sin notificaciones leídas',
    emptyReadSubtitle: 'Las notificaciones que leas aparecerán aquí.',
    settingsTitle: 'Preferencias de notificaciones',
    disconnectedWarning:
      'Sin conexión en tiempo real. Es posible que no recibas notificaciones nuevas hasta que recargues la página.',
    ariaTabList: 'Filtrar notificaciones',
    ariaList: 'Lista de notificaciones',
    ariaCount: (n: number) => `${n} notificaciones`,
  },
  card: {
    markRead: 'Marcar como leída',
    justNow: 'Justo ahora',
    minutesAgo: (n: number) => `hace ${n} minuto${n === 1 ? '' : 's'}`,
    hoursAgo: (n: number) => `hace ${n} hora${n === 1 ? '' : 's'}`,
    daysAgo: (n: number) => `hace ${n} día${n === 1 ? '' : 's'}`,
  },
  order: {
    customizationBadge: 'Personalización',
    customizationBanner: 'Requiere personalización',
    productsLabel: 'Productos',
    totalLabel: 'Total',
    shippingLabel: 'Envío a',
    unitPrice: 'c/u',
    customizationAccept: 'Aceptar personalización',
    customizationReject: 'Rechazar',
    customizationAccepted: 'Personalización aceptada',
    customizationRejected: 'Personalización rechazada',
    customizationRejectionPlaceholder: 'Motivo del rechazo...',
    customizationRejectionSubmit: 'Confirmar rechazo',
    customizationRejectionCancel: 'Cancelar',
    customizationDetailsLabel: 'Personalización',
    viewDetailsText: 'Ver detalles del pedido',
  },
  review: {
    priorityBadge: 'Reseña negativa',
    priorityBanner: 'Reseña prioritaria — calificación baja',
    productLabel: 'Producto',
    ratingLabel: 'Calificación',
    clientLabel: 'Cliente',
    moderateAction: 'Moderar reseña',
  },
  preferences: {
    orderNotificationsLabel: 'Recibir notificaciones de nuevos pedidos',
    reviewNotificationsLabel: 'Recibir notificaciones de nuevas reseñas',
    saving: 'Guardando...',
    saved: 'Guardado',
    savedToast: 'Cambio guardado',
    errorToast: 'No se pudo guardar el cambio',
    error: 'Error al guardar',
    loading: 'Cargando preferencias...',
  },
  toast: {
    newOrder: 'Nuevo pedido recibido',
    customizationBadge: 'Personalización',
    newReview: 'Nueva reseña de producto',
    priorityBadge: 'Reseña negativa',
  },
  errors: {
    fetchError: 'No se pudieron cargar las notificaciones',
  },
} as const;

export const NOTIFICATION_PAGE_STRINGS = NOTIFICATION_STRINGS.page;

export const NOTIFICATION_EMPTY_STATE: Record<ReadFilter, { title: string; subtitle: string }> = {
  all: { title: NOTIFICATION_STRINGS.page.empty, subtitle: NOTIFICATION_STRINGS.page.emptySubtitle },
  unread: { title: NOTIFICATION_STRINGS.page.emptyUnread, subtitle: NOTIFICATION_STRINGS.page.emptyUnreadSubtitle },
  read: { title: NOTIFICATION_STRINGS.page.emptyRead, subtitle: NOTIFICATION_STRINGS.page.emptyReadSubtitle },
};
export const NOTIFICATION_CARD_STRINGS = NOTIFICATION_STRINGS.card;
export const NOTIFICATION_ORDER_STRINGS = NOTIFICATION_STRINGS.order;
export const NOTIFICATION_PREFERENCES_STRINGS = NOTIFICATION_STRINGS.preferences;
export const NOTIFICATION_REVIEW_STRINGS = NOTIFICATION_STRINGS.review;
export const NOTIFICATION_TOAST_STRINGS = NOTIFICATION_STRINGS.toast;

export const ROUTES = {
  CUSTOM_ORDERS: '/custom-orders',
  REVIEWS: '/reviews',
  NOTIFICATIONS: '/notifications',
} as const;

export const MAX_BADGE_COUNT = 99;
export const MAX_TOASTS = 3;
export const TOAST_DURATION_MS = 5000;
export const TOAST_PRIORITY_DURATION_MS = 10000;

export const CARD_BORDER_COLORS = {
  negative: '#ef4444',
  customization: '#f59e0b',
  unread: 'var(--primary)',
} as const;

export type ReadFilter = 'all' | 'unread' | 'read';

export const READ_FILTERS: { key: ReadFilter; label: string }[] = [
  { key: 'all', label: NOTIFICATION_STRINGS.page.filterAll },
  { key: 'unread', label: NOTIFICATION_STRINGS.page.filterUnread },
  { key: 'read', label: NOTIFICATION_STRINGS.page.filterRead },
];
