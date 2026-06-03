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

const ADMIN_ROLES = ['administrador'];
import { requireApiKey } from '../../shared/middleware/apiKeyMiddleware.js';

export const reviewsWebhookRouter = Router();
reviewsWebhookRouter.post('/notify', requireApiKey, validateNotifyNewReview, notifyNewReview);

export const reviewsAdminRouter = Router();
reviewsAdminRouter.get('/', requireAuth, validateListReviewsQuery, getReviews);
reviewsAdminRouter.get('/stats', requireAuth, getStats);
reviewsAdminRouter.get('/:id', requireAuth, getReview);
reviewsAdminRouter.patch('/:id/approve', requireAuth, requireRole(ADMIN_ROLES), approveReview);
reviewsAdminRouter.patch('/:id/reject', requireAuth, requireRole(ADMIN_ROLES), validateRejectReview, rejectReview);
reviewsAdminRouter.post('/:id/respond', requireAuth, requireRole(ADMIN_ROLES), validateRespondToReview, respondToReview);
