export const REVIEW_MESSAGES = {
  NO_ENCONTRADA: 'Reseña no encontrada',
  YA_PROCESADA: 'La reseña ya fue procesada',
  YA_TIENE_RESPUESTA: 'Esta reseña ya tiene una respuesta',
  NO_RESPONDER_RECHAZADA: 'No se puede responder a una reseña rechazada',
  ERROR_EMAIL_RECHAZO: '[Reviews] Error al enviar email de rechazo al cliente:',
};

export const MODERATION_DEFAULT_REASON = 'other';

export const MODERATION_REASON_CODES = [
  'offensive_content',
  'spam',
  'false_information',
  'off_topic',
  'other',
];

export const MODERATION_REASON_LABELS = {
  offensive_content: 'Contenido ofensivo',
  spam: 'Spam',
  false_information: 'Información falsa',
  off_topic: 'Fuera de tema',
  other: 'Otro motivo',
};

export const REVIEW_BAD_RESPONSE_FIELDS = {
  ERROR: 'error',
};

export const REVIEW_VALIDATION = {
  REVIEW_ID_MIN: 1,
  PRODUCT_NAME_MIN: 1,
  PRODUCT_NAME_MAX: 150,
  PRODUCT_ID_MIN: 1,
  CLIENT_NAME_MIN: 1,
  CLIENT_NAME_MAX: 150,
  RATING_MIN: 1,
  RATING_MAX: 5,
  REVIEW_TEXT_MIN: 1,
  REVIEW_TEXT_MAX: 2000,
  RESPONSE_TEXT_MIN: 10,
  RESPONSE_TEXT_MAX: 500,
  NOTES_MAX: 500,
  DELETE_DETAIL_MAX: 500,
};

export const REVIEW_LIST_LIMITS = {
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  DEFAULT_LIMIT: 20,
  MIN_OFFSET: 0,
};

export const REVIEW_LIST_STATUSES = ['pending', 'approved', 'rejected'];

export const REVIEW_VALIDATION_MESSAGES = {
  RESPONSE_REQUIRED: 'La respuesta es obligatoria',
  RESPONSE_MIN: `La respuesta debe tener al menos ${REVIEW_VALIDATION.RESPONSE_TEXT_MIN} caracteres`,
  RESPONSE_MAX: `La respuesta no puede superar ${REVIEW_VALIDATION.RESPONSE_TEXT_MAX} caracteres`,
  REASON_INVALID: 'Motivo de rechazo inválido',
  NOTES_MAX: `Las notas no pueden superar ${REVIEW_VALIDATION.NOTES_MAX} caracteres`,
  DELETE_REASON_REQUIRED: 'Debes seleccionar un motivo de eliminación',
  DELETE_REASON_INVALID: 'Motivo de eliminación inválido',
  DELETE_DETAIL_MAX: `La descripción no puede superar ${REVIEW_VALIDATION.DELETE_DETAIL_MAX} caracteres`,
};
