export const DEFAULT_CLIENT_API_URL = 'http://localhost:3001/api/internal';
export const API_KEY_HEADER = 'X-Admin-Api-Key';
export const DEFAULT_TIMEOUT_MS = 10_000;

export const CLIENT_API_ERROR_CODES = {
  UNREACHABLE: 'CLIENT_API_UNREACHABLE',
  BAD_RESPONSE: 'CLIENT_API_BAD_RESPONSE',
  TIMEOUT: 'CLIENT_API_TIMEOUT',
  MISSING_CONFIG: 'CLIENT_API_MISSING_CONFIG',
};

export const CLIENT_API_ENV = {
  URL: 'CLIENT_API_URL',
  KEY: 'CLIENT_API_KEY',
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
};

export const HTTP_NO_CONTENT_STATUS = 204;
export const HTTP_OK_MIN = 200;
export const HTTP_OK_MAX = 299;

export const CONTENT_TYPE_HEADER = 'Content-Type';
export const JSON_CONTENT_TYPE = 'application/json';
