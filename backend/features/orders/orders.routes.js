import { Router } from 'express';
import {
  notifyNewOrder,
  listar,
  obtenerPorId,
  actualizarEstado,
  cancelar,
  aprobarPago,
} from './orders.controller.js';
import {
  validateNotifyNewOrder,
  validateListOrdersQuery,
  validateUpdateOrderStatus,
} from './orders.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { requireApiKey } from '../../shared/middleware/apiKeyMiddleware.js';
import { ORDER_ROUTES } from './orders.constants.js';

export const ordersWebhookRouter = Router();
ordersWebhookRouter.post(ORDER_ROUTES.NOTIFY, requireApiKey, validateNotifyNewOrder, notifyNewOrder);

// Admin-facing proxy routes over the client backend's /api/internal/orders.
// All require an authenticated admin (existing JWT cookie auth) and are mounted
// after the CSRF header check in server.js.
export const ordersAdminRouter = Router();
ordersAdminRouter.get(ORDER_ROUTES.LIST, requireAuth, validateListOrdersQuery, listar);
ordersAdminRouter.get(ORDER_ROUTES.BY_ID, requireAuth, obtenerPorId);
ordersAdminRouter.patch(ORDER_ROUTES.UPDATE_STATUS, requireAuth, validateUpdateOrderStatus, actualizarEstado);
ordersAdminRouter.post(ORDER_ROUTES.CANCEL, requireAuth, cancelar);
ordersAdminRouter.patch(ORDER_ROUTES.APPROVE_PAYMENT, requireAuth, aprobarPago);

// Default export preserves the legacy import shape: the webhook router (which
// is what server.js mounted before this split).
export default ordersWebhookRouter;
