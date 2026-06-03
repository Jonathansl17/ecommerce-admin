export const INVENTORY_MESSAGES = {
  CREADO_EXITOSO: 'Insumo registrado correctamente',
  NO_ENCONTRADO: 'Insumo no encontrado',
  NOMBRE_DUPLICADO: 'Ya existe un insumo con ese nombre',
  ENTRADA_REGISTRADA: 'Entrada registrada correctamente',
  CONSUMO_REGISTRADO: 'Consumo registrado correctamente',
  STOCK_INSUFICIENTE: 'Stock insuficiente para uno o más insumos',
  INSUMO_DUPLICADO_EN_OPERACION: 'No se puede incluir el mismo insumo más de una vez',
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

export const UNIT_OF_MEASURE = ['grams', 'kilograms', 'milliliters', 'liters', 'units'];

export const MOVEMENT_TYPES = {
  ENTRY: 'entry',
  CONSUMPTION: 'consumption',
};

export const UNIT_OF_MEASURE_LABELS = {
  grams: 'gramos',
  kilograms: 'kilogramos',
  milliliters: 'mililitros',
  liters: 'litros',
  units: 'unidades',
};
