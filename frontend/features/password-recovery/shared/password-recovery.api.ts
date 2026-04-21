import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type {
  ForgotPasswordFormData,
  ForgotPasswordResponse,
  PasswordRecoveryApiErrorResponse,
  ResetPasswordFormData,
  ResetPasswordResponse,
} from '@/features/password-recovery/types/password-recovery.types';

const PASSWORD_RECOVERY_TIMEOUT_MS = 30_000;

async function extractApiError(res: Response): Promise<PasswordRecoveryApiErrorResponse> {
  const body = await res.json().catch(() => ({}));
  return body as PasswordRecoveryApiErrorResponse;
}

export async function requestPasswordRecovery(
  data: ForgotPasswordFormData
): Promise<ForgotPasswordResponse> {
  const res = await fetch(`${API_BASE_URL}/password-recovery/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(PASSWORD_RECOVERY_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await extractApiError(res);
    throw body;
  }

  return res.json() as Promise<ForgotPasswordResponse>;
}

export async function validatePasswordRecoveryToken(token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/password-recovery/validate-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await extractApiError(res);
    throw body;
  }
}

export async function resetPassword(
  data: ResetPasswordFormData & { token: string }
): Promise<ResetPasswordResponse> {
  const res = await fetch(`${API_BASE_URL}/password-recovery/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await extractApiError(res);
    throw body;
  }

  return res.json() as Promise<ResetPasswordResponse>;
}
