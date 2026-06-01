import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type { Notification, NotificationPreference } from '../types/notifications.types';

const FETCH_ERROR = 'fetch_error';

const ROUTES = {
  list: '/notifications',
  unreadCount: '/notifications/unread-count',
  read: (id: string) => `/notifications/${id}/read`,
  readAll: '/notifications/read-all',
  preferences: '/notifications/preferences',
  customizationStatus: (id: string) => `/notifications/${id}/customization-status`,
} as const;

const unwrap = async <T>(promise: Promise<{ data: T }>): Promise<T> => {
  const body = await promise;
  return body.data;
};

const rethrowErrorBody = (err: unknown): never => {
  if (err instanceof ApiError) {
    throw err.body ?? {};
  }
  throw err;
};

export async function getNotifications(): Promise<Notification[]> {
  try {
    return await unwrap(
      apiFetch<{ data: Notification[] }>(ROUTES.list, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error(FETCH_ERROR);
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const body = await apiFetch<{ data: { count: number } }>(ROUTES.unreadCount, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return body.data.count;
  } catch {
    throw new Error(FETCH_ERROR);
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await apiFetch<unknown>(ROUTES.read(id), {
      method: 'PATCH',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function markAllRead(): Promise<void> {
  try {
    await apiFetch<unknown>(ROUTES.readAll, {
      method: 'PATCH',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function getPreferences(): Promise<NotificationPreference> {
  try {
    return await unwrap(
      apiFetch<{ data: NotificationPreference }>(ROUTES.preferences, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error(FETCH_ERROR);
  }
}

export async function updateCustomizationStatus(
  id: string,
  status: 'accepted' | 'rejected',
  rejectionReason?: string,
): Promise<Notification> {
  try {
    return await unwrap(
      apiFetch<{ data: Notification }>(ROUTES.customizationStatus(id), {
        method: 'PATCH',
        body: { status, ...(rejectionReason ? { rejectionReason } : {}) } as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function updatePreferences(data: {
  receiveOrderNotifications?: boolean;
  receiveReviewNotifications?: boolean;
}): Promise<NotificationPreference> {
  try {
    return await unwrap(
      apiFetch<{ data: NotificationPreference }>(ROUTES.preferences, {
        method: 'PUT',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}
