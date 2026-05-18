export const ORDER_MESSAGES = {
  NOTIFICATION_SENT: 'Notificación de pedido enviada correctamente',
  NO_ENCONTRADO: 'Pedido no encontrado',
  SERVICIO_EXTERNO_NO_DISPONIBLE: 'Servicio externo no disponible',
  CONFIGURACION_CLIENTE_FALTANTE: 'Configuracion del cliente faltante',
  ERROR_DESCONOCIDO: 'Error inesperado al comunicarse con el servicio del cliente',
};

export const ORDER_VALIDATION = {
  ORDER_ID_MIN: 1,
  CLIENT_NAME_MIN: 1,
  CLIENT_NAME_MAX: 150,
  PRODUCTS_MIN: 1,
  PRODUCT_NAME_MIN: 1,
  PRODUCT_NAME_MAX: 150,
  SHIPPING_ADDRESS_MIN: 1,
  SHIPPING_ADDRESS_MAX: 300,
  STATUS_MIN: 1,
  STATUS_MAX: 50,
  CLIENT_USER_ID_MIN: 1,
  CLIENT_USER_ID_MAX: 100,
};

export const ORDER_LIST_LIMITS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  MIN_OFFSET: 0,
};

export const ORDER_BAD_RESPONSE_FIELDS = {
  ERROR: 'error',
};

export const ORDER_PARAM_NAMES = {
  ID: 'id',
};
