import { Router } from 'express';
import {
  notifyNewOrder,
  listar,
  obtenerPorId,
  actualizarEstado,
  cancelar,
} from './orders.controller.js';
import {
  validateNotifyNewOrder,
  validateListOrdersQuery,
  validateUpdateOrderStatus,
  validateOrderIdParam,
} from './orders.validator.js';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';
import { requireApiKey } from '../../shared/middleware/apiKeyMiddleware.js';
import { webhookRateLimit, adminWriteRateLimit } from '../../shared/middleware/rateLimitMiddleware.js';

export const ordersWebhookRouter = Router();
ordersWebhookRouter.post('/notify', webhookRateLimit, requireApiKey, validateNotifyNewOrder, notifyNewOrder);

// Admin-facing proxy routes over the client backend's /api/internal/orders.
// All require an authenticated admin (existing JWT cookie auth) and are mounted
// after the CSRF header check in server.js.
const ADMIN_ROLES = ['administrador'];

export const ordersAdminRouter = Router();
ordersAdminRouter.use(requireAuth, requireRole(ADMIN_ROLES));
ordersAdminRouter.get('/', validateListOrdersQuery, listar);
ordersAdminRouter.get('/:id', validateOrderIdParam, obtenerPorId);
ordersAdminRouter.patch('/:id/status', adminWriteRateLimit, validateOrderIdParam, validateUpdateOrderStatus, actualizarEstado);
ordersAdminRouter.post('/:id/cancel', adminWriteRateLimit, validateOrderIdParam, cancelar);

// Default export preserves the legacy import shape: the webhook router (which
// is what server.js mounted before this split).
export default ordersWebhookRouter;
