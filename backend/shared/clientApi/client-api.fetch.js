import {
  API_KEY_HEADER,
  CLIENT_API_ENV,
  CLIENT_API_ERROR_CODES,
  CONTENT_TYPE_HEADER,
  DEFAULT_CLIENT_API_URL,
  DEFAULT_TIMEOUT_MS,
  HTTP_METHODS,
  HTTP_NO_CONTENT_STATUS,
  HTTP_OK_MAX,
  HTTP_OK_MIN,
  JSON_CONTENT_TYPE,
} from './client-api.constants.js';
import { ClientApiError } from './client-api.errors.js';

const isOkStatus = (status) => status >= HTTP_OK_MIN && status <= HTTP_OK_MAX;

const buildBaseUrl = () => process.env[CLIENT_API_ENV.URL] || DEFAULT_CLIENT_API_URL;

const buildQueryString = (query) => {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    params.append(key, String(value));
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
};

const buildUrl = (path, query) => {
  const base = buildBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}${buildQueryString(query)}`;
};

const CSRF_HEADER = 'X-Requested-With';
const CSRF_VALUE = 'fetch';

const buildHeaders = (apiKey, hasBody) => {
  const headers = { [API_KEY_HEADER]: apiKey, [CSRF_HEADER]: CSRF_VALUE };
  if (hasBody) headers[CONTENT_TYPE_HEADER] = JSON_CONTENT_TYPE;
  return headers;
};

const parseResponseBody = async (response) => {
  if (response.status === HTTP_NO_CONTENT_STATUS) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const linkAbortSignal = (controller, externalSignal) => {
  if (!externalSignal) return;
  if (externalSignal.aborted) {
    controller.abort(externalSignal.reason);
    return;
  }
  externalSignal.addEventListener('abort', () => controller.abort(externalSignal.reason), { once: true });
};

/**
 * Thin HTTP client for the client backend's internal API.
 *
 * Reads admin-side env vars:
 *   - `CLIENT_API_URL`  (optional) base URL, defaults to DEFAULT_CLIENT_API_URL.
 *   - `CLIENT_API_KEY`  (required) sent in the `X-Admin-Api-Key` header.
 *
 * @param {string} path - Path relative to base URL (e.g. `/orders`).
 * @param {object} [options]
 * @param {string} [options.method='GET']
 * @param {unknown} [options.body] - JSON-serializable payload.
 * @param {Record<string, unknown>} [options.query] - Query params; null/undefined skipped.
 * @param {AbortSignal} [options.signal] - External cancel signal.
 * @param {number} [options.timeoutMs=DEFAULT_TIMEOUT_MS]
 * @returns {Promise<unknown>} Parsed JSON for 2xx, or `null` for 204.
 * @throws {ClientApiError}
 */
export const clientApiFetch = async (
  path,
  { method = HTTP_METHODS.GET, body, query, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) => {
  const apiKey = process.env[CLIENT_API_ENV.KEY];
  if (!apiKey) {
    throw new ClientApiError(`Missing ${CLIENT_API_ENV.KEY} env var`, {
      code: CLIENT_API_ERROR_CODES.MISSING_CONFIG,
    });
  }

  const url = buildUrl(path, query);
  const hasBody = body !== undefined && body !== null;
  const controller = new AbortController();
  linkAbortSignal(controller, signal);
  let timedOut = false;
  const timeoutHandle = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: buildHeaders(apiKey, hasBody),
      body: hasBody ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    const aborted = err?.name === 'AbortError' || controller.signal.aborted;
    if (aborted && signal?.aborted && !timedOut) {
      throw err;
    }
    if (timedOut) {
      throw new ClientApiError('Client API request timed out', {
        code: CLIENT_API_ERROR_CODES.TIMEOUT,
      });
    }
    throw new ClientApiError('Client API unreachable', {
      code: CLIENT_API_ERROR_CODES.UNREACHABLE,
    });
  } finally {
    clearTimeout(timeoutHandle);
  }

  const parsedBody = await parseResponseBody(response);
  if (!isOkStatus(response.status)) {
    throw new ClientApiError(`Client API bad response (${response.status})`, {
      code: CLIENT_API_ERROR_CODES.BAD_RESPONSE,
      status: response.status,
      body: parsedBody,
    });
  }
  return parsedBody;
};
