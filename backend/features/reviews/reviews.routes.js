import { Router } from 'express';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';
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
  validateGetReviews,
  validateReviewId,
  validateRespondToReview,
} from './reviews.validator.js';
import { requireApiKey } from '../../shared/middleware/apiKeyMiddleware.js';

export const reviewsWebhookRouter = Router();
reviewsWebhookRouter.post('/notify', requireApiKey, validateNotifyNewReview, notifyNewReview);

const isAdmin = requireRole(['administrador']);

export const reviewsAdminRouter = Router();
reviewsAdminRouter.get('/', requireAuth, validateGetReviews, getReviews);
reviewsAdminRouter.get('/stats', requireAuth, getStats);
reviewsAdminRouter.get('/:id', requireAuth, getReview);
reviewsAdminRouter.patch('/:id/approve', requireAuth, isAdmin, validateReviewId, approveReview);
reviewsAdminRouter.patch('/:id/reject', requireAuth, isAdmin, validateReviewId, rejectReview);
reviewsAdminRouter.post('/:id/respond', requireAuth, isAdmin, validateReviewId, validateRespondToReview, respondToReview);
