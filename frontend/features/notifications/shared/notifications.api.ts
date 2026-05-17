import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type { Notification, NotificationPreference } from '../types/notifications.types';

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
      apiFetch<{ data: Notification[] }>('/notifications', {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error('fetch_error');
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const body = await apiFetch<{ data: { count: number } }>('/notifications/unread-count', {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return body.data.count;
  } catch {
    throw new Error('fetch_error');
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await apiFetch<unknown>(`/notifications/${id}/read`, {
      method: 'PATCH',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function markAllRead(): Promise<void> {
  try {
    await apiFetch<unknown>('/notifications/read-all', {
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
      apiFetch<{ data: NotificationPreference }>('/notifications/preferences', {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error('fetch_error');
  }
}

export async function updatePreferences(data: {
  receiveOrderNotifications?: boolean;
  receiveReviewNotifications?: boolean;
}): Promise<NotificationPreference> {
  try {
    return await unwrap(
      apiFetch<{ data: NotificationPreference }>('/notifications/preferences', {
        method: 'PUT',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}
