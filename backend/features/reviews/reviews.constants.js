export const REVIEW_VALIDATION = {
  REVIEW_ID_MIN: 1,
  CLIENT_NAME_MIN: 1,
  CLIENT_NAME_MAX: 100,
  PRODUCT_NAME_MIN: 1,
  PRODUCT_NAME_MAX: 100,
  REVIEW_TEXT_MAX: 2000,
};

export const REVIEW_MESSAGES = {
  NO_ENCONTRADA: 'Reseña no encontrada',
  YA_PROCESADA: 'La reseña ya fue procesada',
  SERVICIO_EXTERNO_NO_DISPONIBLE: 'Servicio externo no disponible',
  CONFIGURACION_CLIENTE_FALTANTE: 'Configuracion del cliente faltante',
  ERROR_DESCONOCIDO: 'Error inesperado al comunicarse con el servicio del cliente',
};

export const REVIEW_BAD_RESPONSE_FIELDS = {
  ERROR: 'error',
};
