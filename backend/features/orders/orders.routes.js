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

export const ordersWebhookRouter = Router();
ordersWebhookRouter.post('/notify', requireApiKey, validateNotifyNewOrder, notifyNewOrder);

// Admin-facing proxy routes over the client backend's /api/internal/orders.
// All require an authenticated admin (existing JWT cookie auth) and are mounted
// after the CSRF header check in server.js.
export const ordersAdminRouter = Router();
ordersAdminRouter.get('/', requireAuth, validateListOrdersQuery, listar);
ordersAdminRouter.get('/:id', requireAuth, obtenerPorId);
ordersAdminRouter.patch('/:id/status', requireAuth, validateUpdateOrderStatus, actualizarEstado);
ordersAdminRouter.post('/:id/cancel', requireAuth, cancelar);
ordersAdminRouter.patch('/:id/payments/:paymentId/approve', requireAuth, aprobarPago);

// Default export preserves the legacy import shape: the webhook router (which
// is what server.js mounted before this split).
export default ordersWebhookRouter;
