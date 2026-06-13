import { z } from 'zod/v4';
import { PRODUCTS_CONFIG, PRODUCTS_MESSAGES } from './products.constants.js';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const STOCK_ADJUSTMENT_REASONS = ['manual_adjustment', 'error_correction', 'damaged_product', 'return'];

const isAllowedImageUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

const imageUrlSchema = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z
    .string()
    .max(PRODUCTS_CONFIG.IMAGEN_MAX_LENGTH, 'La URL de imagen no puede superar 300 caracteres')
    .refine(isAllowedImageUrl, 'La imagen debe ser una URL válida')
    .nullable()
    .optional(),
);

const categorySchema = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z
    .string()
    .max(PRODUCTS_CONFIG.CATEGORIA_MAX_LENGTH, 'La categoría no puede superar 80 caracteres')
    .nullable()
    .optional(),
);

export const validateProductId = (paramName = 'id') => (req, res, next) => {
  if (!/^\d+$/.test(req.params[paramName])) {
    return res.status(400).json({ data: null, error: 'ID de producto inválido', meta: null });
  }
  next();
};

const createProductSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre no puede superar 100 caracteres'),
  description: z.string().max(500, 'La descripción no puede superar 500 caracteres').nullable().optional(),
  price: z.number({ required_error: 'El precio es requerido' }).positive('El precio debe ser mayor a cero').max(9_999_999, 'El precio excede el límite permitido'),
  status: z.enum(['active', 'inactive'], { error: 'Estado inválido' }).optional(),
  imageUrl: imageUrlSchema,
  category: categorySchema,
});

const updateProductSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  price: z.number().positive().max(9_999_999).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  minThreshold: z
    .number({ error: PRODUCTS_MESSAGES.UMBRAL_INVALIDO })
    .int(PRODUCTS_MESSAGES.UMBRAL_INVALIDO)
    .min(PRODUCTS_CONFIG.UMBRAL_MIN, PRODUCTS_MESSAGES.UMBRAL_INVALIDO)
    .max(PRODUCTS_CONFIG.UMBRAL_MAX, PRODUCTS_MESSAGES.UMBRAL_INVALIDO)
    .nullable()
    .optional(),
  imageUrl: imageUrlSchema,
  category: categorySchema,
});

const adjustStockSchema = z.object({
  newStock: z
    .number({ error: 'La cantidad debe ser un número' })
    .int('El stock debe ser un número entero')
    .min(0, 'La cantidad no puede ser negativa')
    .max(2_000_000, 'El stock no puede superar 2,000,000'),
  reason: z.enum(STOCK_ADJUSTMENT_REASONS, { error: 'Motivo no válido' }),
  note: z.string().max(500).optional(),
});

const bulkAdjustmentItemSchema = z.object({
  productId: z.string().min(1, 'El ID del producto es requerido'),
  newStock: z
    .number({ error: 'La cantidad debe ser un número' })
    .int('El stock debe ser un número entero')
    .min(0, 'La cantidad no puede ser negativa')
    .max(2_000_000, 'El stock no puede superar 2,000,000'),
});

const bulkAdjustStockSchema = z.object({
  adjustments: z
    .array(bulkAdjustmentItemSchema)
    .min(1, 'Debe incluir al menos un producto')
    .max(100, 'No se pueden ajustar más de 100 productos por operación'),
  reason: z.enum(STOCK_ADJUSTMENT_REASONS, { error: 'Motivo no válido' }),
  note: z.string().max(500).optional(),
});

const movementsQuerySchema = z.object({
  reason: z.enum(STOCK_ADJUSTMENT_REASONS, { error: 'Motivo de filtro inválido' }).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate debe tener formato YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate debe tener formato YYYY-MM-DD').optional(),
  page: z.coerce.number().int().min(1, 'La página debe ser mayor a 0').default(1),
  limit: z.coerce.number().int().min(1).max(100, 'El límite no puede superar 100').default(20),
});

export const validateCreateProduct = (req, res, next) => {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

export const validateUpdateProduct = (req, res, next) => {
  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

export const validateAdjustStock = (req, res, next) => {
  const result = adjustStockSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

export const validateBulkAdjustStock = (req, res, next) => {
  const result = bulkAdjustStockSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

export const validateMovementsQuery = (req, res, next) => {
  const result = movementsQuerySchema.safeParse(req.query);
  if (!result.success) return responderErrores(res, result.error);
  Object.assign(req.query, result.data);
  next();
};
