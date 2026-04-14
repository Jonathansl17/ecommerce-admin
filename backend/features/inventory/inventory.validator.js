import { z } from 'zod';

const UNIT_OF_MEASURE = ['grams', 'kilograms', 'milliliters', 'liters', 'units'];

const createSupplySchema = z.object({
  name: z.string().min(1).max(100),
  unitOfMeasure: z.enum(UNIT_OF_MEASURE),
  initialStock: z.number().min(0),
});

const updateSupplySchema = z.object({
  name: z.string().min(1).max(100),
  unitOfMeasure: z.enum(UNIT_OF_MEASURE),
});

export const validateCreateSupply = (req, res, next) => {
  const result = createSupplySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};

export const validateUpdateSupply = (req, res, next) => {
  const result = updateSupplySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};
