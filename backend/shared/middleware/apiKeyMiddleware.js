import { timingSafeEqual } from 'node:crypto';
import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

if (!process.env.ADMIN_API_KEY) {
  throw new Error('ADMIN_API_KEY environment variable is not set');
}

const API_KEY_ERRORS = {
  MISSING: 'API key requerida',
  INVALID: 'API key inválida',
};

export const requireApiKey = (req, _res, next) => {
  const raw = req.headers['x-api-key'];
  const provided = Array.isArray(raw) ? null : raw;

  if (!provided || typeof provided !== 'string') {
    return next(crearError(API_KEY_ERRORS.MISSING, HTTP_STATUS.UNAUTHORIZED));
  }

  const expected = process.env.ADMIN_API_KEY;

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
  ) {
    return next(crearError(API_KEY_ERRORS.INVALID, HTTP_STATUS.UNAUTHORIZED));
  }

  next();
};
