import { HTTP_METHODS } from './client-api.constants.js';
import { clientApiFetch } from './client-api.fetch.js';

const REVIEWS_PATH = '/reviews';
const REVIEWS_STATS_PATH = '/reviews/stats';

const reviewPath = (id) => `${REVIEWS_PATH}/${encodeURIComponent(id)}`;

export const listReviews = ({ status, productId, clientUserId, rating, limit, offset, signal } = {}) =>
  clientApiFetch(REVIEWS_PATH, {
    method: HTTP_METHODS.GET,
    query: { status, productId, clientUserId, rating, limit, offset },
    signal,
  });

export const getReview = (id, { signal } = {}) =>
  clientApiFetch(reviewPath(id), { method: HTTP_METHODS.GET, signal });

export const updateReviewStatus = (id, { status, reason, notes }, { signal } = {}) =>
  clientApiFetch(`${reviewPath(id)}/status`, {
    method: HTTP_METHODS.PATCH,
    body: { status, ...(reason && { reason }), ...(notes && { notes }) },
    signal,
  });

export const respondToReview = (id, { responseText }, { signal } = {}) =>
  clientApiFetch(`${reviewPath(id)}/respond`, {
    method: HTTP_METHODS.POST,
    body: { responseText },
    signal,
  });

export const getReviewStats = ({ signal } = {}) =>
  clientApiFetch(REVIEWS_STATS_PATH, { method: HTTP_METHODS.GET, signal });
