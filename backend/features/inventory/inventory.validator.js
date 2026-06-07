import { z } from 'zod/v4';
import { INVENTORY_VALIDATION, UNIT_OF_MEASURE, PAGINATION_CONFIG, REPORT_CONFIG } from './inventory.constants.js';
import { INVENTORY_VALIDATION_MESSAGES as MSG } from './inventory.validation-messages.js';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const createSupplySchema = z.object({
  name: z
    .string({ required_error: MSG.NAME_REQUIRED })
    .min(INVENTORY_VALIDATION.NAME_MIN, MSG.NAME_EMPTY)
    .max(INVENTORY_VALIDATION.NAME_MAX, MSG.NAME_MAX),
  unitOfMeasure: z.enum(UNIT_OF_MEASURE, {
    error: MSG.UNIT_INVALID,
  }),
  initialStock: z
    .number({ required_error: MSG.STOCK_REQUIRED })
    .min(INVENTORY_VALIDATION.STOCK_MIN, MSG.STOCK_MIN)
    .max(INVENTORY_VALIDATION.STOCK_MAX, MSG.STOCK_MAX),
});

const updateSupplySchema = z.object({
  name: z
    .string({ required_error: MSG.NAME_REQUIRED })
    .min(INVENTORY_VALIDATION.NAME_MIN, MSG.NAME_EMPTY)
    .max(INVENTORY_VALIDATION.NAME_MAX, MSG.NAME_MAX),
  unitOfMeasure: z.enum(UNIT_OF_MEASURE, {
    error: MSG.UNIT_INVALID,
  }),
  minThreshold: z
    .number()
    .min(INVENTORY_VALIDATION.STOCK_MIN, MSG.THRESHOLD_MIN)
    .max(INVENTORY_VALIDATION.THRESHOLD_MAX, MSG.THRESHOLD_MAX)
    .optional()
    .default(0),
});

const createEntrySchema = z.object({
  quantity: z
    .number({ required_error: MSG.QUANTITY_REQUIRED })
    .min(INVENTORY_VALIDATION.QUANTITY_MIN, MSG.QUANTITY_MIN)
    .max(INVENTORY_VALIDATION.QUANTITY_MAX, MSG.QUANTITY_MAX),
  date: z
    .string()
    .regex(DATE_REGEX, MSG.DATE_FORMAT)
    .optional(),
});

const itemSchema = z.object({
  supplyId: z
    .string({ required_error: MSG.SUPPLY_ID_REQUIRED })
    .min(INVENTORY_VALIDATION.SUPPLY_ID_MIN, MSG.SUPPLY_ID_EMPTY),
  quantity: z
    .number({ required_error: MSG.QUANTITY_REQUIRED })
    .min(INVENTORY_VALIDATION.QUANTITY_MIN, MSG.QUANTITY_MIN)
    .max(INVENTORY_VALIDATION.QUANTITY_MAX, MSG.QUANTITY_MAX),
});

const createEntriesSchema = z.object({
  items: z
    .array(itemSchema)
    .min(INVENTORY_VALIDATION.ITEMS_MIN, MSG.ITEMS_MIN)
    .max(INVENTORY_VALIDATION.ITEMS_MAX, MSG.ITEMS_MAX),
  date: z
    .string()
    .regex(DATE_REGEX, MSG.DATE_FORMAT)
    .optional(),
});

const createConsumptionSchema = z.object({
  items: z
    .array(itemSchema)
    .min(INVENTORY_VALIDATION.ITEMS_MIN, MSG.ITEMS_MIN)
    .max(INVENTORY_VALIDATION.ITEMS_MAX, MSG.ITEMS_MAX),
  reference: z
    .string()
    .max(INVENTORY_VALIDATION.REFERENCE_MAX, MSG.REFERENCE_MAX)
    .optional(),
  date: z
    .string()
    .regex(DATE_REGEX, MSG.DATE_FORMAT)
    .optional(),
});

const dateRangeQuerySchema = z.object({
  dateFrom: z
    .string({ required_error: MSG.DATE_FROM_REQUIRED })
    .regex(DATE_REGEX, MSG.DATE_FROM_FORMAT),
  dateTo: z
    .string({ required_error: MSG.DATE_TO_REQUIRED })
    .regex(DATE_REGEX, MSG.DATE_TO_FORMAT),
}).refine(({ dateFrom, dateTo }) => {
  const diff = (new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24);
  return diff <= REPORT_CONFIG.MAX_DATE_RANGE_DAYS;
}, { message: MSG.DATE_RANGE_MAX });

const movementsQuerySchema = z.object({
  dateFrom: z
    .string()
    .regex(DATE_REGEX, MSG.DATE_FROM_FORMAT)
    .optional(),
  dateTo: z
    .string()
    .regex(DATE_REGEX, MSG.DATE_TO_FORMAT)
    .optional(),
  type: z.enum(['entry', 'consumption'], {
    error: MSG.TYPE_INVALID,
  }).optional(),
  page: z.coerce.number().int().min(1, MSG.PAGE_MIN).optional().default(PAGINATION_CONFIG.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1, MSG.LIMIT_MIN).max(PAGINATION_CONFIG.MAX_LIMIT, MSG.LIMIT_MAX).optional().default(PAGINATION_CONFIG.DEFAULT_LIMIT),
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
  Object.assign(req.query, resultado.data);
  next();
};
