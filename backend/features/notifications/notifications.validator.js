import { z } from 'zod/v4';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';
import {
  CUSTOMIZATION_STATUS,
  NOTIFICATION_VALIDATION_MESSAGES,
  NOTIFICATION_VALIDATION_LIMITS,
} from './notifications.constants.js';

const updatePreferencesSchema = z
  .object({
    receiveOrderNotifications: z
      .boolean({ error: NOTIFICATION_VALIDATION_MESSAGES.ORDER_NOTIFICATIONS_BOOLEAN })
      .optional(),
    receiveReviewNotifications: z
      .boolean({ error: NOTIFICATION_VALIDATION_MESSAGES.REVIEW_NOTIFICATIONS_BOOLEAN })
      .optional(),
  })
  .refine(
    (data) =>
      data.receiveOrderNotifications !== undefined ||
      data.receiveReviewNotifications !== undefined,
    { message: NOTIFICATION_VALIDATION_MESSAGES.AT_LEAST_ONE_PREFERENCE },
  );

const updateCustomizationStatusSchema = z
  .object({
    status: z.enum([CUSTOMIZATION_STATUS.ACCEPTED, CUSTOMIZATION_STATUS.REJECTED], {
      error: NOTIFICATION_VALIDATION_MESSAGES.CUSTOMIZATION_STATUS_INVALID,
    }),
    rejectionReason: z
      .string()
      .trim()
      .min(1, NOTIFICATION_VALIDATION_MESSAGES.REJECTION_REASON_REQUIRED)
      .max(NOTIFICATION_VALIDATION_LIMITS.REJECTION_REASON_MAX, NOTIFICATION_VALIDATION_MESSAGES.REJECTION_REASON_MAX)
      .optional(),
  })
  .refine(
    (data) => data.status !== CUSTOMIZATION_STATUS.REJECTED || Boolean(data.rejectionReason),
    { message: NOTIFICATION_VALIDATION_MESSAGES.REJECTION_REASON_REQUIRED, path: ['rejectionReason'] },
  );

export const validateUpdateCustomizationStatus = (req, res, next) => {
  const result = updateCustomizationStatusSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

export const validateUpdatePreferences = (req, res, next) => {
  const result = updatePreferencesSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};
