import { z } from 'zod';
import { STOCK_ADJUSTMENT_VALIDATION, CREATE_PRODUCT_VALIDATION, THRESHOLD_VALIDATION } from '../constants/validation';
import { PRODUCTS_MESSAGES } from '../constants/messages';

const { validation, createValidation, thresholdValidation } = PRODUCTS_MESSAGES;

export const adjustStockSchema = z.object({
  newStock: z
    .number({ error: validation.newStockRequired })
    .min(STOCK_ADJUSTMENT_VALIDATION.NEW_STOCK_MIN, validation.newStockMin),
  reason: z.enum(
    ['manual_adjustment', 'error_correction', 'damaged_product', 'return'],
    { error: validation.reasonRequired }
  ),
  note: z
    .string()
    .max(STOCK_ADJUSTMENT_VALIDATION.NOTE_MAX_LENGTH, validation.noteMax)
    .optional(),
});

export const createProductSchema = z.object({
  name: z
    .string({ error: createValidation.nameRequired })
    .min(CREATE_PRODUCT_VALIDATION.NAME.MIN_LENGTH, createValidation.nameMin)
    .max(CREATE_PRODUCT_VALIDATION.NAME.MAX_LENGTH, createValidation.nameMax),
  description: z
    .string()
    .max(CREATE_PRODUCT_VALIDATION.DESCRIPTION.MAX_LENGTH, createValidation.descriptionMax)
    .optional(),
  price: z
    .number({ error: createValidation.priceRequired })
    .min(CREATE_PRODUCT_VALIDATION.PRICE.MIN, createValidation.priceMin)
    .max(CREATE_PRODUCT_VALIDATION.PRICE.MAX, createValidation.priceMax),
  status: z.enum(['active', 'inactive']),
});

const thresholdSchema = z.preprocess(
  (v) => {
    if (v === '' || v === undefined || v === null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  },
  z
    .number()
    .int(thresholdValidation.integer)
    .min(THRESHOLD_VALIDATION.MIN, thresholdValidation.min)
    .max(THRESHOLD_VALIDATION.MAX, thresholdValidation.max)
    .nullable()
);

export const editProductSchema = createProductSchema.extend({
  minThreshold: thresholdSchema.optional().default(null),
});
