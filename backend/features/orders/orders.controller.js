import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { createOrderNotification as createOrderNotificationService } from './orders.service.js';

export const notifyNewOrder = async (req, res, next) => {
  try {
    const result = await createOrderNotificationService(req.body);
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};
