export const NOTIFICATION_MESSAGES = {
  NOT_FOUND: 'Notificación no encontrada',
  ACCESS_DENIED: 'No tienes permiso para acceder a esta notificación',
  PREFERENCES_UPDATED: 'Preferencias actualizadas correctamente',
};

export const NOTIFICATION_EVENTS = {
  NEW_ORDER: 'new_order',
  MARK_READ: 'mark_read',
  NEW_REVIEW: 'new_review',
};

export const NOTIFICATION_CONFIG = {
  FETCH_LIMIT: 50,
  KEEPALIVE_INTERVAL_MS: 30_000,
  DEFAULT_ORDER_TITLE: 'Nuevo pedido recibido',
  DEFAULT_ORDER_ENTITY_TYPE: 'order',
  DEFAULT_REVIEW_ENTITY_TYPE: 'review',
  DEFAULT_REVIEW_PRIORITY_TITLE: 'Reseña negativa recibida',
  DEFAULT_REVIEW_TITLE: 'Nueva reseña de producto',
  LOW_RATING_THRESHOLD: 2,
};

export const NOTIFICATION_TYPE = {
  INTERNAL: 'internal',
};

export const NOTIFICATION_REVIEW_TITLES = {
  PRIORITY: 'Reseña negativa recibida',
  STANDARD: 'Nueva reseña de producto',
};
