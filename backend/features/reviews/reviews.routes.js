import { Router } from 'express';
import {
  notifyNewReview,
  getReviews,
  getReview,
  approveReview,
  rejectReview,
  respondToReview,
  deleteReview,
  getStats,
} from './reviews.controller.js';
import {
  validateNotifyNewReview,
  validateRespondToReview,
  validateRejectReview,
  validateDeleteReview,
} from './reviews.validator.js';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';
import { requireApiKey } from '../../shared/middleware/apiKeyMiddleware.js';
import { webhookRateLimit } from '../../shared/middleware/rateLimitMiddleware.js';

const ADMIN_ROLES = ['administrador'];

export const reviewsWebhookRouter = Router();
reviewsWebhookRouter.post('/notify', webhookRateLimit, requireApiKey, validateNotifyNewReview, notifyNewReview);

export const reviewsAdminRouter = Router();
reviewsAdminRouter.get('/', requireAuth, getReviews);
reviewsAdminRouter.get('/stats', requireAuth, getStats);
reviewsAdminRouter.get('/:id', requireAuth, getReview);
reviewsAdminRouter.patch('/:id/approve', requireAuth, approveReview);
reviewsAdminRouter.patch('/:id/reject', requireAuth, validateRejectReview, rejectReview);
reviewsAdminRouter.post('/:id/respond', requireAuth, validateRespondToReview, respondToReview);
reviewsAdminRouter.delete('/:id/moderation', requireAuth, validateDeleteReview, deleteReview);
