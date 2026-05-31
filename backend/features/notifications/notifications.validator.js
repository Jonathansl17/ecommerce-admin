import { z } from 'zod/v4';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const updatePreferencesSchema = z
  .object({
    receiveOrderNotifications: z
      .boolean({ error: 'El campo receiveOrderNotifications debe ser un booleano' })
      .optional(),
    receiveReviewNotifications: z
      .boolean({ error: 'El campo receiveReviewNotifications debe ser un booleano' })
      .optional(),
  })
  .refine(
    (data) =>
      data.receiveOrderNotifications !== undefined ||
      data.receiveReviewNotifications !== undefined,
    { message: 'Debe incluir al menos un campo de preferencia para actualizar' },
  );

export const validateUpdatePreferences = (req, res, next) => {
  const result = updatePreferencesSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};
