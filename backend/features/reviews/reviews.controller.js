import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import {
  createReviewNotification as createReviewNotificationService,
  getReviews as getReviewsService,
  getReview as getReviewService,
  approveReview as approveReviewService,
  rejectReview as rejectReviewService,
  respondToReview as respondToReviewService,
  stats as statsService,
} from './reviews.service.js';

export const notifyNewReview = async (req, res, next) => {
  try {
    const result = await createReviewNotificationService(req.body);
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { status, productId, clientUserId, rating, limit, offset } = req.query;
    const result = await getReviewsService({
      status,
      productId,
      clientUserId,
      rating: rating !== undefined ? Number(rating) : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (_req, res, next) => {
  try {
    const result = await statsService();
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const review = await getReviewService(req.params.id);
    return res.status(HTTP_STATUS.OK).json({ data: review, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const approveReview = async (req, res, next) => {
  try {
    const review = await approveReviewService(req.params.id);
    return res.status(HTTP_STATUS.OK).json({ data: review, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const rejectReview = async (req, res, next) => {
  try {
    const { reason, notes } = req.body ?? {};
    const review = await rejectReviewService(req.params.id, { reason, notes });
    return res.status(HTTP_STATUS.OK).json({ data: review, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const respondToReview = async (req, res, next) => {
  try {
    const { responseText } = req.body;
    const result = await respondToReviewService(req.params.id, { responseText });
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};
