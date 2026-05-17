import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { createReviewNotification as createReviewNotificationService } from './reviews.service.js';

export const notifyNewReview = async (req, res, next) => {
  try {
    const result = await createReviewNotificationService(req.body);
    return res.status(HTTP_STATUS.CREATED).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};
