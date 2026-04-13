import { z } from 'zod';

const createSupplySchema = z.object({
  name: z.string().min(1).max(100),
  unitOfMeasure: z.enum(['grams', 'kilograms', 'milliliters', 'liters', 'units']),
  initialStock: z.number().min(0),
});

export const validateCreateSupply = (req, res, next) => {
  const result = createSupplySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};
