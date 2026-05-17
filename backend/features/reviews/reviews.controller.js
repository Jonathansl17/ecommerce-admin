import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import {
  createReviewNotification as createReviewNotificationService,
  getReviews as getReviewsService,
  getReview as getReviewService,
  approveReview as approveReviewService,
  rejectReview as rejectReviewService,
  respondToReview as respondToReviewService,
} from './reviews.service.js';

export const notifyNewReview = async (req, res, next) => {
  try {
    const result = await createReviewNotificationService(req.body);
    return res.status(HTTP_STATUS.CREATED).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const reviews = await getReviewsService({ status });
    return res.status(HTTP_STATUS.OK).json({ data: reviews, error: null, meta: null });
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
    const review = await rejectReviewService(req.params.id, req.user.id, req.body);
    return res.status(HTTP_STATUS.OK).json({ data: review, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const respondToReview = async (req, res, next) => {
  try {
    const review = await respondToReviewService(req.params.id, req.user.id, req.body);
    return res.status(HTTP_STATUS.CREATED).json({ data: review, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};
