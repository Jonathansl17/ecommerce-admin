import { Router } from 'express';
import { notifyNewOrder } from './orders.controller.js';
import { validateNotifyNewOrder } from './orders.validator.js';

// Webhook-style endpoint called by the external client app.
// No admin auth required; validation via Zod schema is still enforced.
// Mounted under /api/orders before the CSRF header check in server.js.
export const ordersWebhookRouter = Router();
ordersWebhookRouter.post('/notify', validateNotifyNewOrder, notifyNewOrder);

// Admin-facing proxy router over the client backend's /api/internal/orders.
// Mounted under /api/orders after the CSRF header check in server.js.
// Routes are added in a follow-up commit.
export const ordersAdminRouter = Router();

// Default export preserves the legacy import shape: the webhook router.
export default ordersWebhookRouter;
