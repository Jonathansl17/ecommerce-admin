import { z } from 'zod/v4';
import { ORDER_LIST_LIMITS, ORDER_STATUSES, ORDER_VALIDATION, ORDER_VALIDATION_MESSAGES } from './orders.constants.js';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const orderProductSchema = z.object({
  name: z
    .string({ required_error: ORDER_VALIDATION_MESSAGES.PRODUCT_NAME_REQUIRED })
    .min(ORDER_VALIDATION.PRODUCT_NAME_MIN, ORDER_VALIDATION_MESSAGES.PRODUCT_NAME_EMPTY)
    .max(ORDER_VALIDATION.PRODUCT_NAME_MAX, ORDER_VALIDATION_MESSAGES.PRODUCT_NAME_MAX),
  quantity: z
    .number({ required_error: ORDER_VALIDATION_MESSAGES.QUANTITY_REQUIRED })
    .int(ORDER_VALIDATION_MESSAGES.QUANTITY_INTEGER)
    .positive(ORDER_VALIDATION_MESSAGES.QUANTITY_POSITIVE),
  unitPrice: z
    .number({ required_error: ORDER_VALIDATION_MESSAGES.UNIT_PRICE_REQUIRED })
    .nonnegative(ORDER_VALIDATION_MESSAGES.UNIT_PRICE_NONNEGATIVE),
  isCustomizable: z.boolean().optional().default(false),
  customizationDetails: z
    .record(
      z.string().regex(/^[a-zA-Z0-9_-]+$/, 'Las claves de customizationDetails solo pueden contener letras, números, _ y -').max(100),
      z.string().max(500),
    )
    .refine((val) => Object.keys(val).length <= 50, {
      message: 'customizationDetails no puede tener más de 50 entradas',
    })
    .optional(),
});

const notifyNewOrderSchema = z.object({
  orderId: z
    .string({ required_error: ORDER_VALIDATION_MESSAGES.ORDER_ID_REQUIRED })
    .min(ORDER_VALIDATION.ORDER_ID_MIN, ORDER_VALIDATION_MESSAGES.ORDER_ID_EMPTY)
    .max(ORDER_VALIDATION.ORDER_ID_MAX, ORDER_VALIDATION_MESSAGES.ORDER_ID_MAX),
  clientName: z
    .string({ required_error: ORDER_VALIDATION_MESSAGES.CLIENT_NAME_REQUIRED })
    .min(ORDER_VALIDATION.CLIENT_NAME_MIN, ORDER_VALIDATION_MESSAGES.CLIENT_NAME_EMPTY)
    .max(ORDER_VALIDATION.CLIENT_NAME_MAX, ORDER_VALIDATION_MESSAGES.CLIENT_NAME_MAX),
  products: z
    .array(orderProductSchema)
    .min(ORDER_VALIDATION.PRODUCTS_MIN, ORDER_VALIDATION_MESSAGES.PRODUCTS_MIN),
  total: z
    .number({ required_error: ORDER_VALIDATION_MESSAGES.TOTAL_REQUIRED })
    .nonnegative(ORDER_VALIDATION_MESSAGES.TOTAL_NONNEGATIVE),
  shippingAddress: z
    .string({ required_error: ORDER_VALIDATION_MESSAGES.SHIPPING_ADDRESS_REQUIRED })
    .min(ORDER_VALIDATION.SHIPPING_ADDRESS_MIN, ORDER_VALIDATION_MESSAGES.SHIPPING_ADDRESS_EMPTY)
    .max(ORDER_VALIDATION.SHIPPING_ADDRESS_MAX, ORDER_VALIDATION_MESSAGES.SHIPPING_ADDRESS_MAX),
  hasCustomization: z.boolean({ required_error: ORDER_VALIDATION_MESSAGES.HAS_CUSTOMIZATION_REQUIRED }),
});

export const validateNotifyNewOrder = (req, res, next) => {
  const result = notifyNewOrderSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

const optionalTrimmedString = (min, max, label) =>
  z
    .string()
    .trim()
    .min(min, `${label} no puede estar vacío`)
    .max(max, `${label} excede el máximo permitido`)
    .optional();

const optionalIsoDate = (label) =>
  z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value)), { message: `${label} debe ser una fecha ISO válida` })
    .optional();

const optionalIntFromQuery = ({ min, max, label }) =>
  z
    .preprocess(
      (value) => {
        if (value === undefined || value === null || value === '') return undefined;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
      },
      z
        .number({ invalid_type_error: `${label} debe ser un número` })
        .int(`${label} debe ser un entero`)
        .min(min, `${label} no puede ser menor a ${min}`)
        .max(max, `${label} no puede ser mayor a ${max}`)
        .optional(),
    );

const listOrdersQuerySchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  clientUserId: optionalTrimmedString(
    ORDER_VALIDATION.CLIENT_USER_ID_MIN,
    ORDER_VALIDATION.CLIENT_USER_ID_MAX,
    'clientUserId',
  ),
  from: optionalIsoDate('from'),
  to: optionalIsoDate('to'),
  limit: optionalIntFromQuery({
    min: ORDER_LIST_LIMITS.MIN_LIMIT,
    max: ORDER_LIST_LIMITS.MAX_LIMIT,
    label: 'limit',
  }),
  offset: optionalIntFromQuery({
    min: ORDER_LIST_LIMITS.MIN_OFFSET,
    max: Number.MAX_SAFE_INTEGER,
    label: 'offset',
  }),
});

export const validateListOrdersQuery = (req, res, next) => {
  const result = listOrdersQuerySchema.safeParse(req.query);
  if (!result.success) return responderErrores(res, result.error);
  const data = result.data;
  req.validatedQuery = {
    status: data.status,
    clientUserId: data.clientUserId,
    from: data.from,
    to: data.to,
    limit: data.limit ?? ORDER_LIST_LIMITS.DEFAULT_LIMIT,
    offset: data.offset ?? ORDER_LIST_LIMITS.MIN_OFFSET,
  };
  next();
};

const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES, {
    required_error: ORDER_VALIDATION_MESSAGES.STATUS_REQUIRED,
    error: `Estado inválido. Valores permitidos: ${ORDER_STATUSES.join(', ')}`,
  }),
});

export const validateUpdateOrderStatus = (req, res, next) => {
  const result = updateOrderStatusSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

const orderIdParamSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, 'El ID del pedido es requerido')
    .max(ORDER_VALIDATION.ORDER_ID_MAX, ORDER_VALIDATION_MESSAGES.ORDER_ID_MAX),
});

export const validateOrderIdParam = (req, res, next) => {
  const result = orderIdParamSchema.safeParse(req.params);
  if (!result.success) return responderErrores(res, result.error);
  next();
};
