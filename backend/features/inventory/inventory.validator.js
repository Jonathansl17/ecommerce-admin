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

const createEntrySchema = z.object({
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a cero'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')
    .optional(),
});

const createConsumptionSchema = z.object({
  items: z
    .array(
      z.object({
        supplyId: z.string().min(1),
        quantity: z.number().min(0.01, 'La cantidad debe ser mayor a cero'),
      })
    )
    .min(1, 'Debe incluir al menos un insumo'),
  reference: z.string().max(200).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')
    .optional(),
});

export const validateCreateConsumption = (req, res, next) => {
  const result = createConsumptionSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};

export const validateCreateEntry = (req, res, next) => {
  const result = createEntrySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};
