import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

const API_KEY_HEADER = 'x-api-key';

const API_KEY_ERRORS = {
  MISSING: 'API key requerida',
  INVALID: 'API key inválida',
  NOT_CONFIGURED: 'El servidor no tiene configurada la ADMIN_API_KEY',
};

/**
 * Middleware that validates the `x-api-key` request header against
 * the `ADMIN_API_KEY` environment variable.
 *
 * Use this on webhook-style endpoints that are called by machine clients
 * (e.g. the external client app) and cannot use cookie-based JWT auth.
 *
 * Fails fast at startup if the env var is absent so misconfiguration is
 * caught immediately rather than silently accepting all requests.
 */
export const requireAdminApiKey = (req, _res, next) => {
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey) {
    // Misconfiguration — treat as an internal server error so the operator
    // is alerted; do not reveal configuration details to the caller.
    console.error('[requireAdminApiKey] ADMIN_API_KEY env var is not set');
    return next(crearError(API_KEY_ERRORS.NOT_CONFIGURED, HTTP_STATUS.INTERNAL_ERROR));
  }

  const providedKey = req.headers[API_KEY_HEADER];

  if (!providedKey) {
    return next(crearError(API_KEY_ERRORS.MISSING, HTTP_STATUS.UNAUTHORIZED));
  }

  if (providedKey !== expectedKey) {
    return next(crearError(API_KEY_ERRORS.INVALID, HTTP_STATUS.UNAUTHORIZED));
  }

  next();
};
