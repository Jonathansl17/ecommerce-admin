import prisma from '../../shared/db/prisma.js';
import { broadcast } from '../../shared/sse/sseManager.js';
import { createReviewNotification as persistReviewNotifications } from '../notifications/notifications.factory.service.js';
import { NOTIFICATION_EVENTS, NOTIFICATION_CONFIG } from '../notifications/notifications.constants.js';
import {
  listReviews as listReviewsClient,
  getReview as getReviewClient,
  updateReviewStatus as updateReviewStatusClient,
  respondToReview as respondToReviewClient,
  getReviewStats as getReviewStatsClient,
} from '../../shared/clientApi/reviews.client.js';
import { ClientApiError } from '../../shared/clientApi/client-api.errors.js';
import { CLIENT_API_ERROR_CODES } from '../../shared/clientApi/client-api.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { REVIEW_BAD_RESPONSE_FIELDS, REVIEW_MESSAGES } from './reviews.constants.js';
import { ACCOUNT_STATUS } from '../../shared/constants/app.constants.js';

export const createReviewNotification = async (reviewData) => {
  const adminUsers = await prisma.adminUser.findMany({
    where: {
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      admin: { isNot: null },
      OR: [
        { notificationPreference: { receiveReviewNotifications: true } },
        { notificationPreference: null },
      ],
    },
    select: { id: true },
  });

  if (adminUsers.length === 0) {
    return { notifiedCount: 0 };
  }

  const targetAdminIds = adminUsers.map((u) => u.id);

  const isPriority = reviewData.rating <= NOTIFICATION_CONFIG.LOW_RATING_THRESHOLD;
  const payload = { ...reviewData, isPriority };

  const notifications = await persistReviewNotifications(payload, targetAdminIds);

  for (let i = 0; i < targetAdminIds.length; i++) {
    const adminId = String(targetAdminIds[i]);
    const notification = notifications[i];
    broadcast([adminId], NOTIFICATION_EVENTS.NEW_REVIEW, { notification });
  }

  return { notifiedCount: notifications.length };
};

const extractBadResponseMessage = (body, fallback) => {
  if (body && typeof body === 'object' && typeof body[REVIEW_BAD_RESPONSE_FIELDS.ERROR] === 'string') {
    return body[REVIEW_BAD_RESPONSE_FIELDS.ERROR];
  }
  return fallback;
};

/**
 * Maps a ClientApiError raised by the client backend wrapper into an HTTP error
 * suitable for the admin error handler. Non-ClientApiError errors are re-thrown
 * untouched so they bubble up as 500s through the default handler.
 */
const mapClientApiError = (error, { notFoundMessage } = {}) => {
  if (!(error instanceof ClientApiError)) return error;

  if (error.code === CLIENT_API_ERROR_CODES.BAD_RESPONSE) {
    const status = error.status ?? HTTP_STATUS.INTERNAL_ERROR;
    if (status === HTTP_STATUS.NOT_FOUND) {
      return crearError(
        notFoundMessage ?? extractBadResponseMessage(error.body, REVIEW_MESSAGES.NO_ENCONTRADA),
        HTTP_STATUS.NOT_FOUND,
      );
    }
    const message = extractBadResponseMessage(error.body, REVIEW_MESSAGES.ERROR_DESCONOCIDO);
    return crearError(message, status);
  }

  if (
    error.code === CLIENT_API_ERROR_CODES.UNREACHABLE ||
    error.code === CLIENT_API_ERROR_CODES.TIMEOUT
  ) {
    return crearError(REVIEW_MESSAGES.SERVICIO_EXTERNO_NO_DISPONIBLE, HTTP_STATUS.BAD_GATEWAY);
  }

  if (error.code === CLIENT_API_ERROR_CODES.MISSING_CONFIG) {
    return crearError(REVIEW_MESSAGES.CONFIGURACION_CLIENTE_FALTANTE, HTTP_STATUS.INTERNAL_ERROR);
  }

  return crearError(REVIEW_MESSAGES.ERROR_DESCONOCIDO, HTTP_STATUS.INTERNAL_ERROR);
};

/**
 * List reviews via the client backend. Returns the raw `{ total, items }` shape
 * from the client API.
 *
 * @param {{ status?: string, productId?: string, clientUserId?: string, rating?: number, limit?: number, offset?: number }} filters
 */
export const getReviews = async (filters = {}) => {
  try {
    return await listReviewsClient(filters);
  } catch (error) {
    throw mapClientApiError(error);
  }
};

/**
 * Fetch a single review by its id from the client backend.
 *
 * @param {string} id
 */
export const getReview = async (id) => {
  try {
    return await getReviewClient(id);
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: REVIEW_MESSAGES.NO_ENCONTRADA });
  }
};

/**
 * Approve a review via the client backend.
 *
 * @param {string} id
 */
export const approveReview = async (id) => {
  try {
    return await updateReviewStatusClient(id, { status: 'approved' });
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: REVIEW_MESSAGES.NO_ENCONTRADA });
  }
};

/**
 * Reject a review via the client backend, then notify the customer by email.
 *
 * @param {string} id
 * @param {{ reason?: string, notes?: string }} options
 */
export const rejectReview = async (id, { reason, notes } = {}) => {
  try {
    return await updateReviewStatusClient(id, { status: 'rejected', reason, notes });
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: REVIEW_MESSAGES.NO_ENCONTRADA });
  }
};

/**
 * Post an admin response to a review via the client backend.
 *
 * @param {string} id
 * @param {{ responseText: string }} data
 */
export const respondToReview = async (id, { responseText }) => {
  try {
    return await respondToReviewClient(id, { responseText });
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: REVIEW_MESSAGES.NO_ENCONTRADA });
  }
};

/**
 * Fetch aggregated review stats from the client backend.
 */
export const stats = async () => {
  try {
    return await getReviewStatsClient();
  } catch (error) {
    throw mapClientApiError(error);
  }
};
