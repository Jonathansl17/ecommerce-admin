import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type {
  Review,
  ReviewListResponse,
  ReviewStatus,
  ReviewStats,
  RejectReviewPayload,
  RespondReviewPayload,
} from '../types/reviews.types';

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

export async function getReviews(status?: ReviewStatus): Promise<Review[]> {
  const params = status ? `?status=${status}` : '';
  try {
    const result = await unwrap(
      apiFetch<{ data: ReviewListResponse }>(`/reviews${params}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
    return result.items;
  } catch {
    throw new Error('fetch_error');
  }
}

export async function getReviewStats(): Promise<ReviewStats> {
  try {
    return await unwrap(
      apiFetch<{ data: ReviewStats }>(`/reviews/stats`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error('fetch_error');
  }
}

export async function getReview(id: string): Promise<Review> {
  try {
    return await unwrap(
      apiFetch<{ data: Review }>(`/reviews/${id}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error('fetch_error');
  }
}

export async function approveReview(id: string): Promise<Review> {
  try {
    return await unwrap(
      apiFetch<{ data: Review }>(`/reviews/${id}/approve`, {
        method: 'PATCH',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function rejectReview(id: string, data: RejectReviewPayload): Promise<Review> {
  try {
    return await unwrap(
      apiFetch<{ data: Review }>(`/reviews/${id}/reject`, {
        method: 'POST',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function respondToReview(id: string, data: RespondReviewPayload): Promise<Review> {
  try {
    return await unwrap(
      apiFetch<{ data: Review }>(`/reviews/${id}/respond`, {
        method: 'POST',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}
