import { API_BASE_URL } from '@/lib/constants/api.constants';
import { ApiError } from './apiError';
import {
  refreshSession,
  dispatchAuthExpired,
  CSRF_HEADER_NAME,
  CSRF_HEADER_VALUE,
} from './authRefresh';

export { ApiError } from './apiError';
export { AUTH_EXPIRED_EVENT } from './authRefresh';

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | Record<string, unknown> | null;
  skipAuthRetry?: boolean;
}

function buildBody(body: ApiFetchOptions['body']): { body?: BodyInit; headers: HeadersInit } {
  if (body == null) return { headers: {} };
  if (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer
  ) {
    return { body: body as BodyInit, headers: {} };
  }
  return {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  };
}

async function parseResponse(res: Response): Promise<unknown> {
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return res.json().catch(() => null);
  }
  return res.text().catch(() => null);
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, skipAuthRetry, headers: callerHeaders, ...rest } = options;
  const { body: serializedBody, headers: bodyHeaders } = buildBody(body);
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const doRequest = () =>
    fetch(url, {
      ...rest,
      credentials: 'include',
      body: serializedBody,
      headers: {
        [CSRF_HEADER_NAME]: CSRF_HEADER_VALUE,
        ...bodyHeaders,
        ...callerHeaders,
      },
    });

  let res = await doRequest();

  if (res.status === 401 && !skipAuthRetry) {
    const refreshed = await refreshSession();
    if (refreshed) {
      res = await doRequest();
    } else {
      dispatchAuthExpired();
    }
  }

  const payload = await parseResponse(res);

  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }

  return (payload as T) ?? (undefined as T);
}
