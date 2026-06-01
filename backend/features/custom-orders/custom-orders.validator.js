import { z } from 'zod/v4';
import { CUSTOM_ORDER_STATUSES, CUSTOM_ORDERS_VALIDATION } from './custom-orders.constants.js';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const updateStatusSchema = z.object({
  status: z.enum(CUSTOM_ORDER_STATUSES, {
    error: CUSTOM_ORDERS_VALIDATION.STATUS_INVALID,
  }),
});

export const validateUpdateStatus = (req, res, next) => {
  const result = updateStatusSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};
