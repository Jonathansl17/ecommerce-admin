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
import {
  validateNotifyNewReview,
  validateRespondToReview,
  validateRejectReview,
  validateListReviewsQuery,
} from './reviews.validator.js';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';
import { requireApiKey } from '../../shared/middleware/apiKeyMiddleware.js';
import { webhookRateLimit } from '../../shared/middleware/rateLimitMiddleware.js';

const ADMIN_ROLES = ['administrador'];

export const reviewsWebhookRouter = Router();
reviewsWebhookRouter.post('/notify', webhookRateLimit, requireApiKey, validateNotifyNewReview, notifyNewReview);

export const reviewsAdminRouter = Router();
reviewsAdminRouter.get('/', requireAuth, requireRole(ADMIN_ROLES), validateListReviewsQuery, getReviews);
reviewsAdminRouter.get('/stats', requireAuth, requireRole(ADMIN_ROLES), getStats);
reviewsAdminRouter.get('/:id', requireAuth, requireRole(ADMIN_ROLES), getReview);
reviewsAdminRouter.patch('/:id/approve', requireAuth, requireRole(ADMIN_ROLES), approveReview);
reviewsAdminRouter.patch('/:id/reject', requireAuth, requireRole(ADMIN_ROLES), validateRejectReview, rejectReview);
reviewsAdminRouter.post('/:id/respond', requireAuth, requireRole(ADMIN_ROLES), validateRespondToReview, respondToReview);
