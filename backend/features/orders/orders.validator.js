import { z } from 'zod/v4';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { ORDER_VALIDATION } from './orders.constants.js';

const responderErrores = (res, error) => {
  const errores = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errores });
};

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
    .min(ORDER_VALIDATION.ORDER_ID_MIN, 'El ID del pedido no puede estar vacío'),
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
