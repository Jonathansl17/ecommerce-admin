export const NOTIFICATION_STRINGS = {
  page: {
    title: 'Notificaciones',
    markAllRead: 'Marcar todas como leídas',
    empty: 'No tienes notificaciones',
    emptySubtitle: 'Aquí aparecerán las notificaciones de nuevos pedidos y reseñas.',
    settingsTitle: 'Preferencias de notificaciones',
    disconnectedWarning:
      'Sin conexión en tiempo real. Es posible que no recibas notificaciones nuevas hasta que recargues la página.',
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
  review: {
    priorityBadge: 'Reseña negativa',
    priorityBanner: 'Reseña prioritaria — calificación baja',
    productLabel: 'Producto',
    ratingLabel: 'Calificación',
    clientLabel: 'Cliente',
  },
  preferences: {
    orderNotificationsLabel: 'Recibir notificaciones de nuevos pedidos',
    reviewNotificationsLabel: 'Recibir notificaciones de nuevas reseñas',
    saving: 'Guardando...',
    saved: 'Guardado',
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
