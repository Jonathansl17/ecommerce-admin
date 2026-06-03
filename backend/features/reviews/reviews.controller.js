import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import {
  createReviewNotification as createReviewNotificationService,
  getReviews as getReviewsService,
  getReview as getReviewService,
  approveReview as approveReviewService,
  rejectReview as rejectReviewService,
  respondToReview as respondToReviewService,
  deleteReview as deleteReviewService,
  stats as statsService,
} from './reviews.service.js';
import { sendReviewRejectedEmail } from '../../shared/services/email.service.js';
import { REVIEW_MESSAGES } from './reviews.constants.js';

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
    const { status, rating, product, client, limit, offset } = req.query;
    const result = await getReviewsService({
      status,
      product,
      client,
      rating: rating !== undefined ? Number(rating) : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const { product, client } = req.query;
    const result = await statsService({ product, client });
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
    const result = await rejectReviewService(req.params.id, req.user.id, { reason, notes });

    const review = result?.review ?? result;
    sendReviewRejectedEmail({
      customerEmail: review?.clientUser?.email ?? null,
      customerName: review?.clientUser?.fullName ?? null,
      productName: review?.product?.name ?? '',
    }).catch((err) => console.error(REVIEW_MESSAGES.ERROR_EMAIL_RECHAZO, err));

    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const respondToReview = async (req, res, next) => {
  try {
    const { responseText } = req.body;
    const result = await respondToReviewService(req.params.id, req.user.id, { responseText });
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { reason, detail } = req.body;
    const result = await deleteReviewService(req.params.id, req.user.id, { reason, detail });
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};
