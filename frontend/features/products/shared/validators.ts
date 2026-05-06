import { z } from 'zod';
import { STOCK_ADJUSTMENT_VALIDATION, CREATE_PRODUCT_VALIDATION } from '../constants/validation';
import { PRODUCTS_MESSAGES } from '../constants/messages';

const { validation, createValidation } = PRODUCTS_MESSAGES;

export const adjustStockSchema = z.object({
  newStock: z
    .number({ invalid_type_error: validation.newStockRequired })
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
    .string({ required_error: createValidation.nameRequired })
    .min(CREATE_PRODUCT_VALIDATION.NAME.MIN_LENGTH, createValidation.nameMin)
    .max(CREATE_PRODUCT_VALIDATION.NAME.MAX_LENGTH, createValidation.nameMax),
  description: z
    .string()
    .max(CREATE_PRODUCT_VALIDATION.DESCRIPTION.MAX_LENGTH, createValidation.descriptionMax)
    .optional(),
  price: z
    .number({ invalid_type_error: createValidation.priceRequired })
    .min(CREATE_PRODUCT_VALIDATION.PRICE.MIN, createValidation.priceMin)
    .max(CREATE_PRODUCT_VALIDATION.PRICE.MAX, createValidation.priceMax),
  status: z.enum(['active', 'inactive']),
});
