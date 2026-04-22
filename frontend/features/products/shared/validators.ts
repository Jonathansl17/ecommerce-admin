import { z } from 'zod';
import { STOCK_ADJUSTMENT_VALIDATION } from '../constants/validation';
import { PRODUCTS_MESSAGES } from '../constants/messages';

const { validation } = PRODUCTS_MESSAGES;

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
