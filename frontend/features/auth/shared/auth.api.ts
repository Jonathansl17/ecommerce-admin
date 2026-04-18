import { API_BASE_URL, HTTP_STATUS, REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type {
  ApiErrorResponse,
  LoginFormData,
  LoginResponse,
  RegisterFormData,
} from '@/features/auth/types/auth.types';

export async function registerUser(data: RegisterFormData): Promise<ApiErrorResponse | null> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (res.status === HTTP_STATUS.BAD_REQUEST) {
    const body: ApiErrorResponse = await res.json();
    return body;
  }

  if (!res.ok) {
    const body: ApiErrorResponse = await res.json().catch(() => ({}));
    return { error: body.error };
  }

  return null;
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body: ApiErrorResponse = await res.json().catch(() => ({}));
    throw body;
  }

  const body: LoginResponse = await res.json();
  return body;
}

export async function logoutUser(token: string): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}
