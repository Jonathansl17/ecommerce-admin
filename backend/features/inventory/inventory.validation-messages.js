import { INVENTORY_VALIDATION, UNIT_OF_MEASURE, PAGINATION_CONFIG, REPORT_CONFIG } from './inventory.constants.js';

export const INVENTORY_VALIDATION_MESSAGES = {
  // Name
  NAME_REQUIRED: 'El nombre del insumo es requerido',
  NAME_EMPTY: 'El nombre no puede estar vacío',
  NAME_MAX: `El nombre no puede superar ${INVENTORY_VALIDATION.NAME_MAX} caracteres`,

  // Unit of measure
  UNIT_INVALID: `La unidad de medida debe ser una de: ${UNIT_OF_MEASURE.join(', ')}`,

  // Stock / threshold
  STOCK_REQUIRED: 'El stock inicial es requerido',
  STOCK_MIN: 'El stock inicial no puede ser negativo',
  STOCK_MAX: `El stock inicial no puede superar ${INVENTORY_VALIDATION.STOCK_MAX}`,
  THRESHOLD_MIN: 'El umbral mínimo no puede ser negativo',
  THRESHOLD_MAX: `El umbral mínimo no puede superar ${INVENTORY_VALIDATION.THRESHOLD_MAX}`,

  // Quantity
  QUANTITY_REQUIRED: 'La cantidad es requerida',
  QUANTITY_MIN: 'La cantidad debe ser mayor a cero',
  QUANTITY_MAX: `La cantidad no puede superar ${INVENTORY_VALIDATION.QUANTITY_MAX}`,

  // Supply ID
  SUPPLY_ID_REQUIRED: 'El ID del insumo es requerido',
  SUPPLY_ID_EMPTY: 'El ID del insumo no puede estar vacío',

  // Items array
  ITEMS_MIN: 'Debe incluir al menos un insumo',
  ITEMS_MAX: `No se pueden incluir más de ${INVENTORY_VALIDATION.ITEMS_MAX} insumos por operación`,

  // Reference
  REFERENCE_MAX: `La referencia no puede superar ${INVENTORY_VALIDATION.REFERENCE_MAX} caracteres`,

  // Date
  DATE_FORMAT: 'La fecha debe tener el formato YYYY-MM-DD',
  DATE_FROM_REQUIRED: 'El parámetro dateFrom es requerido',
  DATE_FROM_FORMAT: 'dateFrom debe tener el formato YYYY-MM-DD',
  DATE_TO_REQUIRED: 'El parámetro dateTo es requerido',
  DATE_TO_FORMAT: 'dateTo debe tener el formato YYYY-MM-DD',

  // Movement type
  TYPE_INVALID: "El tipo debe ser 'entry' o 'consumption'",

  // Pagination
  PAGE_MIN: 'El número de página debe ser mayor a cero',
  LIMIT_MIN: 'El límite debe ser mayor a cero',
  LIMIT_MAX: `El límite no puede superar ${PAGINATION_CONFIG.MAX_LIMIT} registros`,

  // Date range
  DATE_RANGE_MAX: `El rango de fechas no puede superar ${REPORT_CONFIG.MAX_DATE_RANGE_DAYS} días`,
};
