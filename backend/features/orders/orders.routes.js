import { Router } from 'express';
import { notifyNewOrder } from './orders.controller.js';
import { validateNotifyNewOrder } from './orders.validator.js';

const router = Router();

// No admin auth required — this endpoint is called by the external client app.
// Validation via Zod schema is still enforced.
router.post('/notify', validateNotifyNewOrder, notifyNewOrder);

export default router;
