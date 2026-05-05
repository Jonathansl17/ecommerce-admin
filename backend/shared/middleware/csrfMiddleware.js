import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const REQUIRED_HEADER = 'x-requested-with';
const REQUIRED_VALUE = 'fetch';

export const requireFetchHeader = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  if (req.headers[REQUIRED_HEADER] !== REQUIRED_VALUE) {
    return next(crearError('Solicitud no permitida', HTTP_STATUS.FORBIDDEN));
  }
  return next();
};
