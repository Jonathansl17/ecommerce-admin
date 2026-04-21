import { z } from 'zod';

const STOCK_ADJUSTMENT_REASONS = ['manual_adjustment', 'error_correction', 'damaged_product', 'return'];

const adjustStockSchema = z.object({
  newStock: z
    .number({ invalid_type_error: 'La cantidad debe ser un número' })
    .min(0, 'La cantidad no puede ser negativa'),
  reason: z.enum(STOCK_ADJUSTMENT_REASONS, { error: 'Motivo no válido' }),
  note: z.string().max(500).optional(),
});

export const validateAdjustStock = (req, res, next) => {
  const result = adjustStockSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};
