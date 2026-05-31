import { HTTP_STATUS } from '../constants/http.constants.js';

export const responderErrores = (res, error) => {
  const errores = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errores });
};
