import { z } from 'zod/v4';
import { INVENTORY_VALIDATION, UNIT_OF_MEASURE } from './inventory.constants.js';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const createSupplySchema = z.object({
  name: z
    .string({ required_error: 'El nombre del insumo es requerido' })
    .min(INVENTORY_VALIDATION.NAME_MIN, 'El nombre no puede estar vacío')
    .max(INVENTORY_VALIDATION.NAME_MAX, `El nombre no puede superar ${INVENTORY_VALIDATION.NAME_MAX} caracteres`),
  unitOfMeasure: z.enum(UNIT_OF_MEASURE, {
    error: `La unidad de medida debe ser una de: ${UNIT_OF_MEASURE.join(', ')}`,
  }),
  initialStock: z
    .number({ required_error: 'El stock inicial es requerido' })
    .min(INVENTORY_VALIDATION.STOCK_MIN, 'El stock inicial no puede ser negativo'),
});

const updateSupplySchema = z.object({
  name: z
    .string({ required_error: 'El nombre del insumo es requerido' })
    .min(INVENTORY_VALIDATION.NAME_MIN, 'El nombre no puede estar vacío')
    .max(INVENTORY_VALIDATION.NAME_MAX, `El nombre no puede superar ${INVENTORY_VALIDATION.NAME_MAX} caracteres`),
  unitOfMeasure: z.enum(UNIT_OF_MEASURE, {
    error: `La unidad de medida debe ser una de: ${UNIT_OF_MEASURE.join(', ')}`,
  }),
  minThreshold: z
    .number()
    .min(INVENTORY_VALIDATION.STOCK_MIN, 'El umbral mínimo no puede ser negativo')
    .optional()
    .default(0),
});

const createEntrySchema = z.object({
  quantity: z
    .number({ required_error: 'La cantidad es requerida' })
    .min(INVENTORY_VALIDATION.QUANTITY_MIN, 'La cantidad debe ser mayor a cero'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD')
    .optional(),
});

const itemSchema = z.object({
  supplyId: z
    .string({ required_error: 'El ID del insumo es requerido' })
    .min(INVENTORY_VALIDATION.SUPPLY_ID_MIN, 'El ID del insumo no puede estar vacío'),
  quantity: z
    .number({ required_error: 'La cantidad es requerida' })
    .min(INVENTORY_VALIDATION.QUANTITY_MIN, 'La cantidad debe ser mayor a cero'),
});

const createEntriesSchema = z.object({
  items: z
    .array(itemSchema)
    .min(INVENTORY_VALIDATION.ITEMS_MIN, 'Debe incluir al menos un insumo'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD')
    .optional(),
});

const createConsumptionSchema = z.object({
  items: z
    .array(itemSchema)
    .min(INVENTORY_VALIDATION.ITEMS_MIN, 'Debe incluir al menos un insumo'),
  reference: z
    .string()
    .max(INVENTORY_VALIDATION.REFERENCE_MAX, `La referencia no puede superar ${INVENTORY_VALIDATION.REFERENCE_MAX} caracteres`)
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD')
    .optional(),
});

const dateRangeQuerySchema = z.object({
  dateFrom: z
    .string({ required_error: 'El parámetro dateFrom es requerido' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateFrom debe tener el formato YYYY-MM-DD'),
  dateTo: z
    .string({ required_error: 'El parámetro dateTo es requerido' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateTo debe tener el formato YYYY-MM-DD'),
});

const movementsQuerySchema = z.object({
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateFrom debe tener el formato YYYY-MM-DD')
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateTo debe tener el formato YYYY-MM-DD')
    .optional(),
  type: z.enum(['entry', 'consumption'], {
    error: "El tipo debe ser 'entry' o 'consumption'",
  }).optional(),
});

export const validateCreateSupply = (req, res, next) => {
  const resultado = createSupplySchema.safeParse(req.body);
  if (!resultado.success) return responderErrores(res, resultado.error);
  req.body = resultado.data;
  next();
};

export const validateUpdateSupply = (req, res, next) => {
  const resultado = updateSupplySchema.safeParse(req.body);
  if (!resultado.success) return responderErrores(res, resultado.error);
  req.body = resultado.data;
  next();
};

export const validateCreateEntry = (req, res, next) => {
  const resultado = createEntrySchema.safeParse(req.body);
  if (!resultado.success) return responderErrores(res, resultado.error);
  req.body = resultado.data;
  next();
};

export const validateCreateEntries = (req, res, next) => {
  const resultado = createEntriesSchema.safeParse(req.body);
  if (!resultado.success) return responderErrores(res, resultado.error);
  req.body = resultado.data;
  next();
};

export const validateCreateConsumption = (req, res, next) => {
  const resultado = createConsumptionSchema.safeParse(req.body);
  if (!resultado.success) return responderErrores(res, resultado.error);
  req.body = resultado.data;
  next();
};

export const validateReportQuery = (req, res, next) => {
  const resultado = dateRangeQuerySchema.safeParse(req.query);
  if (!resultado.success) return responderErrores(res, resultado.error);
  next();
};

export const validateMovementsQuery = (req, res, next) => {
  const resultado = movementsQuerySchema.safeParse(req.query);
  if (!resultado.success) return responderErrores(res, resultado.error);
  next();
};
