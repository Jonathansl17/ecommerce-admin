import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import {
  notifyNewReview,
  getReviews,
  getReview,
  approveReview,
  rejectReview,
  respondToReview,
} from './reviews.controller.js';
import {
  validateNotifyNewReview,
  validateRejectReview,
  validateRespondToReview,
} from './reviews.validator.js';

const router = Router();

// No admin auth required — called by the external client app (webhook-style).
router.post('/notify', validateNotifyNewReview, notifyNewReview);

// Admin-authenticated routes.
router.get('/', requireAuth, getReviews);
router.get('/:id', requireAuth, getReview);
router.patch('/:id/approve', requireAuth, approveReview);
router.post('/:id/reject', requireAuth, validateRejectReview, rejectReview);
router.post('/:id/respond', requireAuth, validateRespondToReview, respondToReview);

export default router;
