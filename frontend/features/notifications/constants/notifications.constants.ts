export const NOTIFICATION_STRINGS = {
  page: {
    title: 'Notificaciones',
    markAllRead: 'Marcar todas como leídas',
    empty: 'No tienes notificaciones',
    emptySubtitle: 'Aquí aparecerán las notificaciones de nuevos pedidos.',
    settingsTitle: 'Preferencias de notificaciones',
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
  },
  preferences: {
    orderNotificationsLabel: 'Recibir notificaciones de nuevos pedidos',
    saving: 'Guardando...',
    saved: 'Guardado',
    error: 'Error al guardar',
    loading: 'Cargando preferencias...',
  },
  toast: {
    newOrder: 'Nuevo pedido recibido',
    customizationBadge: 'Personalización',
  },
  errors: {
    fetchError: 'No se pudieron cargar las notificaciones',
  },
} as const;
