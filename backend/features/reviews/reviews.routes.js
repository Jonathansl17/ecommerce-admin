import { Router } from 'express';
import {
  notifyNewReview,
  getReviews,
  getReview,
  approveReview,
  rejectReview,
  respondToReview,
  getStats,
} from './reviews.controller.js';
import { validateNotifyNewReview } from './reviews.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { requireApiKey } from '../../shared/middleware/apiKeyMiddleware.js';

export const reviewsWebhookRouter = Router();
reviewsWebhookRouter.post('/notify', requireApiKey, validateNotifyNewReview, notifyNewReview);

export const reviewsAdminRouter = Router();
reviewsAdminRouter.get('/', requireAuth, getReviews);
reviewsAdminRouter.get('/stats', requireAuth, getStats);
reviewsAdminRouter.get('/:id', requireAuth, getReview);
reviewsAdminRouter.patch('/:id/approve', requireAuth, approveReview);
reviewsAdminRouter.patch('/:id/reject', requireAuth, rejectReview);
reviewsAdminRouter.post('/:id/respond', requireAuth, respondToReview);
