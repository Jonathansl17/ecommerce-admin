import { HTTP_STATUS } from '../constants/http.constants.js';

export const responderErrores = (res, error) => {
  const issues = error.issues ?? error.errors ?? [];
  const errores = issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errores });
};
