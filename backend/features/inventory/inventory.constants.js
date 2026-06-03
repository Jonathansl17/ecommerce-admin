export const INVENTORY_MESSAGES = {
  CREADO_EXITOSO: 'Insumo registrado correctamente',
  NO_ENCONTRADO: 'Insumo no encontrado',
  NOMBRE_DUPLICADO: 'Ya existe un insumo con ese nombre',
  ENTRADA_REGISTRADA: 'Entrada registrada correctamente',
  CONSUMO_REGISTRADO: 'Consumo registrado correctamente',
  STOCK_INSUFICIENTE: 'Stock insuficiente para uno o más insumos',
  INSUMO_DUPLICADO_EN_OPERACION: 'No se puede incluir el mismo insumo más de una vez',
  ELIMINADO_EXITOSO: 'Insumo eliminado correctamente',
};

export const INVENTORY_CONFIG = {
  ITEM_TYPE: 'supply',
  ESTADO_POR_DEFECTO: 'active',
};

export const INVENTORY_VALIDATION = {
  NAME_MIN: 1,
  NAME_MAX: 100,
  STOCK_MIN: 0,
  QUANTITY_MIN: 0.01,
  REFERENCE_MAX: 200,
  SUPPLY_ID_MIN: 1,
  ITEMS_MIN: 1,
};

export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
};

export const REPORT_CONFIG = {
  MAX_DATE_RANGE_DAYS: 365,
};

export const UNIT_OF_MEASURE = ['grams', 'kilograms', 'milliliters', 'liters', 'units'];

export const UNIT_OF_MEASURE_LABELS = {
  grams: 'gramos',
  kilograms: 'kilogramos',
  milliliters: 'mililitros',
  liters: 'litros',
  units: 'unidades',
};
