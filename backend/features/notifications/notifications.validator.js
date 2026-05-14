import { z } from 'zod/v4';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const responderErrores = (res, error) => {
  const errores = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errores });
};

const updatePreferencesSchema = z.object({
  receiveOrderNotifications: z.boolean({
    required_error: 'El campo receiveOrderNotifications es requerido',
    error: 'El campo receiveOrderNotifications debe ser un booleano',
  }),
});

export const validateUpdatePreferences = (req, res, next) => {
  const result = updatePreferencesSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};
