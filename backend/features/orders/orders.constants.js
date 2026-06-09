export const ORDER_MESSAGES = {
  NOTIFICATION_SENT: 'Notificación de pedido enviada correctamente',
  NO_ENCONTRADO: 'Pedido no encontrado',
  SERVICIO_EXTERNO_NO_DISPONIBLE: 'Servicio externo no disponible',
  CONFIGURACION_CLIENTE_FALTANTE: 'Configuracion del cliente faltante',
  ERROR_DESCONOCIDO: 'Error inesperado al comunicarse con el servicio del cliente',
};

export const ORDER_STATUSES = ['received', 'in_process', 'ready', 'sold', 'rejected'];

export const ORDER_VALIDATION = {
  ORDER_ID_MIN: 1,
  ORDER_ID_MAX: 100,
  CLIENT_NAME_MIN: 1,
  CLIENT_NAME_MAX: 150,
  PRODUCTS_MIN: 1,
  PRODUCT_NAME_MIN: 1,
  PRODUCT_NAME_MAX: 150,
  SHIPPING_ADDRESS_MIN: 1,
  SHIPPING_ADDRESS_MAX: 300,
  CLIENT_USER_ID_MIN: 1,
  CLIENT_USER_ID_MAX: 100,
};

export const ORDER_LIST_LIMITS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  MIN_OFFSET: 0,
  MAX_OFFSET: 100_000,
};

export const ORDER_BAD_RESPONSE_FIELDS = {
  ERROR: 'error',
};

export const ORDER_PARAM_NAMES = {
  ID: 'id',
};

export const ORDER_CLIENT_STATUS = {
  CONFIRMED: 'confirmed',
};

export const ORDER_RESPONSE_FIELDS = {
  ORDER: 'order',
};

export const ORDER_ROUTES = {
  NOTIFY: '/notify',
  LIST: '/',
  BY_ID: '/:id',
  UPDATE_STATUS: '/:id/status',
  CANCEL: '/:id/cancel',
  APPROVE_PAYMENT: '/:id/payments/:paymentId/approve',
};

export const ORDER_VALIDATION_MESSAGES = {
  PRODUCT_NAME_REQUIRED: 'El nombre del producto es requerido',
  PRODUCT_NAME_EMPTY: 'El nombre del producto no puede estar vacío',
  PRODUCT_NAME_MAX: `El nombre del producto no puede superar ${ORDER_VALIDATION.PRODUCT_NAME_MAX} caracteres`,
  QUANTITY_REQUIRED: 'La cantidad es requerida',
  QUANTITY_INTEGER: 'La cantidad debe ser un número entero',
  QUANTITY_POSITIVE: 'La cantidad debe ser mayor a cero',
  UNIT_PRICE_REQUIRED: 'El precio unitario es requerido',
  UNIT_PRICE_NONNEGATIVE: 'El precio unitario no puede ser negativo',
  ORDER_ID_REQUIRED: 'El ID del pedido es requerido',
  ORDER_ID_EMPTY: 'El ID del pedido no puede estar vacío',
  ORDER_ID_MAX: `El ID del pedido no puede superar ${ORDER_VALIDATION.ORDER_ID_MAX} caracteres`,
  CLIENT_NAME_REQUIRED: 'El nombre del cliente es requerido',
  CLIENT_NAME_EMPTY: 'El nombre del cliente no puede estar vacío',
  CLIENT_NAME_MAX: `El nombre del cliente no puede superar ${ORDER_VALIDATION.CLIENT_NAME_MAX} caracteres`,
  PRODUCTS_MIN: 'Debe incluir al menos un producto',
  TOTAL_REQUIRED: 'El total es requerido',
  TOTAL_NONNEGATIVE: 'El total no puede ser negativo',
  SHIPPING_ADDRESS_REQUIRED: 'La dirección de envío es requerida',
  SHIPPING_ADDRESS_EMPTY: 'La dirección de envío no puede estar vacía',
  SHIPPING_ADDRESS_MAX: `La dirección de envío no puede superar ${ORDER_VALIDATION.SHIPPING_ADDRESS_MAX} caracteres`,
  HAS_CUSTOMIZATION_REQUIRED: 'El campo hasCustomization es requerido',
  STATUS_REQUIRED: 'El campo status es requerido',
};
