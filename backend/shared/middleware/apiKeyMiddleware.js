import { timingSafeEqual, createHash } from 'node:crypto';
import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

if (!process.env.ADMIN_API_KEY) {
  throw new Error('ADMIN_API_KEY environment variable is not set');
}

const API_KEY_ERRORS = {
  MISSING: 'API key requerida',
  INVALID: 'API key inválida',
};

const digest = (s) => createHash('sha256').update(s).digest();
const expectedDigest = digest(process.env.ADMIN_API_KEY);

export const requireApiKey = (req, _res, next) => {
  const raw = req.headers['x-api-key'];
  const provided = Array.isArray(raw) ? raw[0] : raw;

  if (!provided || typeof provided !== 'string') {
    return next(crearError(API_KEY_ERRORS.MISSING, HTTP_STATUS.UNAUTHORIZED));
  }

  if (!timingSafeEqual(digest(provided), expectedDigest)) {
    return next(crearError(API_KEY_ERRORS.INVALID, HTTP_STATUS.UNAUTHORIZED));
  }

  next();
};
