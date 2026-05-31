import { z } from 'zod/v4';
import { ORDER_LIST_LIMITS, ORDER_VALIDATION } from './orders.constants.js';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const orderProductSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del producto es requerido' })
    .min(ORDER_VALIDATION.PRODUCT_NAME_MIN, 'El nombre del producto no puede estar vacío')
    .max(ORDER_VALIDATION.PRODUCT_NAME_MAX, `El nombre del producto no puede superar ${ORDER_VALIDATION.PRODUCT_NAME_MAX} caracteres`),
  quantity: z
    .number({ required_error: 'La cantidad es requerida' })
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a cero'),
  unitPrice: z
    .number({ required_error: 'El precio unitario es requerido' })
    .nonnegative('El precio unitario no puede ser negativo'),
  isCustomizable: z.boolean().optional().default(false),
});

const notifyNewOrderSchema = z.object({
  orderId: z
    .string({ required_error: 'El ID del pedido es requerido' })
    .min(ORDER_VALIDATION.ORDER_ID_MIN, 'El ID del pedido no puede estar vacío')
    .max(100, 'El ID del pedido no puede superar 100 caracteres'),
  clientName: z
    .string({ required_error: 'El nombre del cliente es requerido' })
    .min(ORDER_VALIDATION.CLIENT_NAME_MIN, 'El nombre del cliente no puede estar vacío')
    .max(ORDER_VALIDATION.CLIENT_NAME_MAX, `El nombre del cliente no puede superar ${ORDER_VALIDATION.CLIENT_NAME_MAX} caracteres`),
  products: z
    .array(orderProductSchema)
    .min(ORDER_VALIDATION.PRODUCTS_MIN, 'Debe incluir al menos un producto'),
  total: z
    .number({ required_error: 'El total es requerido' })
    .nonnegative('El total no puede ser negativo'),
  shippingAddress: z
    .string({ required_error: 'La dirección de envío es requerida' })
    .min(ORDER_VALIDATION.SHIPPING_ADDRESS_MIN, 'La dirección de envío no puede estar vacía')
    .max(ORDER_VALIDATION.SHIPPING_ADDRESS_MAX, `La dirección de envío no puede superar ${ORDER_VALIDATION.SHIPPING_ADDRESS_MAX} caracteres`),
  hasCustomization: z.boolean({ required_error: 'El campo hasCustomization es requerido' }),
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
  status: optionalTrimmedString(ORDER_VALIDATION.STATUS_MIN, ORDER_VALIDATION.STATUS_MAX, 'status'),
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
  status: z
    .string({ required_error: 'El campo status es requerido' })
    .trim()
    .min(ORDER_VALIDATION.STATUS_MIN, 'El campo status no puede estar vacío')
    .max(ORDER_VALIDATION.STATUS_MAX, `El campo status no puede superar ${ORDER_VALIDATION.STATUS_MAX} caracteres`),
});

export const validateUpdateOrderStatus = (req, res, next) => {
  const result = updateOrderStatusSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};
