export const NOTIFICATION_MESSAGES = {
  NOT_FOUND: 'Notificación no encontrada',
  ACCESS_DENIED: 'No tienes permiso para acceder a esta notificación',
  PREFERENCES_UPDATED: 'Preferencias actualizadas correctamente',
  WRONG_TYPE: 'Esta operación solo aplica a notificaciones de pedidos con personalización',
  ALREADY_PROCESSED: 'Esta notificación ya fue procesada',
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

export const SSE_CONFIG = {
  CONTENT_TYPE: 'text/event-stream',
  CACHE_CONTROL: 'no-cache',
  CONNECTION: 'keep-alive',
  CONNECTED_MSG: ': connected\n\n',
  KEEPALIVE_MSG: ': keepalive\n\n',
};

export const CUSTOMIZATION_STATUS = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const CONTENT_KEYS = {
  CUSTOMIZATION_STATUS: 'customizationStatus',
  CUSTOMIZATION_REJECTION_REASON: 'customizationRejectionReason',
};

export const NOTIFICATION_VALIDATION_MESSAGES = {
  ORDER_NOTIFICATIONS_BOOLEAN: 'El campo receiveOrderNotifications debe ser un booleano',
  REVIEW_NOTIFICATIONS_BOOLEAN: 'El campo receiveReviewNotifications debe ser un booleano',
  AT_LEAST_ONE_PREFERENCE: 'Debe incluir al menos un campo de preferencia para actualizar',
  CUSTOMIZATION_STATUS_INVALID: 'El estado debe ser "accepted" o "rejected"',
  REJECTION_REASON_MAX: 'La razón no puede superar 500 caracteres',
};

export const NOTIFICATION_VALIDATION_LIMITS = {
  REJECTION_REASON_MAX: 500,
};
