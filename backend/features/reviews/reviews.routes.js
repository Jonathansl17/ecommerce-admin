import { Router } from 'express';
import { notifyNewReview } from './reviews.controller.js';
import { validateNotifyNewReview } from './reviews.validator.js';

const router = Router();

// No admin auth required — this endpoint is called by the external client app.
// Validation via Zod schema is still enforced.
router.post('/notify', validateNotifyNewReview, notifyNewReview);

export default router;
