import { Router } from 'express';
import {
  notifyNewReview,
  notifyDeletedReview,
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
  validateListReviewsQuery,
} from './reviews.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { requireApiKey } from '../../shared/middleware/apiKeyMiddleware.js';

export const reviewsWebhookRouter = Router();
reviewsWebhookRouter.post('/notify', requireApiKey, validateNotifyNewReview, notifyNewReview);
reviewsWebhookRouter.delete('/notify/:externalId', requireApiKey, notifyDeletedReview);

export const reviewsAdminRouter = Router();
reviewsAdminRouter.get('/', requireAuth, validateListReviewsQuery, getReviews);
reviewsAdminRouter.get('/stats', requireAuth, getStats);
reviewsAdminRouter.get('/:id', requireAuth, getReview);
reviewsAdminRouter.patch('/:id/approve', requireAuth, approveReview);
reviewsAdminRouter.patch('/:id/reject', requireAuth, validateRejectReview, rejectReview);
reviewsAdminRouter.post('/:id/respond', requireAuth, validateRespondToReview, respondToReview);
reviewsAdminRouter.delete('/:id/moderation', requireAuth, validateDeleteReview, deleteReview);
