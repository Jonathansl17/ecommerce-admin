import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import {
  getReviews,
  getReview,
  approveReview,
  rejectReview,
  getStats,
} from './reviews.controller.js';

const router = Router();

// Admin-authenticated routes. All review data is proxied through the client backend.
router.get('/', requireAuth, getReviews);
router.get('/stats', requireAuth, getStats);
router.get('/:id', requireAuth, getReview);
router.patch('/:id/approve', requireAuth, approveReview);
router.patch('/:id/reject', requireAuth, rejectReview);

export default router;
