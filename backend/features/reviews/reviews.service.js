import prisma from '../../shared/db/prisma.js';
import { broadcast } from '../../shared/sse/sseManager.js';
import { createReviewNotification as persistReviewNotifications } from '../notifications/notifications.factory.service.js';
import { NOTIFICATION_EVENTS, NOTIFICATION_CONFIG } from '../notifications/notifications.constants.js';
import {
  listReviews as listReviewsClient,
  getReview as getReviewClient,
  updateReviewStatus as updateReviewStatusClient,
  getReviewStats as getReviewStatsClient,
  respondToReview as respondToReviewClient,
} from '../../shared/clientApi/reviews.client.js';
import { ClientApiError } from '../../shared/clientApi/client-api.errors.js';
import { CLIENT_API_ERROR_CODES } from '../../shared/clientApi/client-api.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { REVIEW_BAD_RESPONSE_FIELDS, REVIEW_MESSAGES } from './reviews.constants.js';
import { ACCOUNT_STATUS } from '../../shared/constants/app.constants.js';
import { sendReviewRejectedEmail } from '../../shared/services/email.service.js';

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
    broadcast([String(targetAdminIds[i])], NOTIFICATION_EVENTS.NEW_REVIEW, { notification: notifications[i] });
  }

  return { notifiedCount: notifications.length };
};

const extractBadResponseMessage = (body, fallback) => {
  if (body && typeof body === 'object' && typeof body[REVIEW_BAD_RESPONSE_FIELDS.ERROR] === 'string') {
    return body[REVIEW_BAD_RESPONSE_FIELDS.ERROR];
  }
  return fallback;
};

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
    return crearError(extractBadResponseMessage(error.body, REVIEW_MESSAGES.ERROR_DESCONOCIDO), status);
  }

  if (error.code === CLIENT_API_ERROR_CODES.UNREACHABLE || error.code === CLIENT_API_ERROR_CODES.TIMEOUT) {
    return crearError(REVIEW_MESSAGES.SERVICIO_EXTERNO_NO_DISPONIBLE, HTTP_STATUS.BAD_GATEWAY);
  }

  if (error.code === CLIENT_API_ERROR_CODES.MISSING_CONFIG) {
    return crearError(REVIEW_MESSAGES.CONFIGURACION_CLIENTE_FALTANTE, HTTP_STATUS.INTERNAL_ERROR);
  }

  return crearError(REVIEW_MESSAGES.ERROR_DESCONOCIDO, HTTP_STATUS.INTERNAL_ERROR);
};

export const getReviews = async (filters = {}) => {
  try {
    return await listReviewsClient(filters);
  } catch (error) {
    throw mapClientApiError(error);
  }
};

export const getReview = async (id) => {
  try {
    return await getReviewClient(id);
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: REVIEW_MESSAGES.NO_ENCONTRADA });
  }
};

export const approveReview = async (id) => {
  try {
    return await updateReviewStatusClient(id, { status: 'approved' });
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: REVIEW_MESSAGES.NO_ENCONTRADA });
  }
};

export const rejectReview = async (id) => {
  let result;
  try {
    result = await updateReviewStatusClient(id, { status: 'rejected' });
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: REVIEW_MESSAGES.NO_ENCONTRADA });
  }

  const customerEmail = result?.clientUser?.email;
  const productName = result?.product?.name;
  const reviewText = result?.comment ?? '';

  if (customerEmail && productName) {
    sendReviewRejectedEmail({ customerEmail, productName, reviewText }).catch(
      (err) => console.error('[reviews] Error al enviar email de rechazo:', err.message),
    );
  }

  return result;
};

export const respondToReview = async (id, responseText) => {
  try {
    return await respondToReviewClient(id, responseText);
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: REVIEW_MESSAGES.NO_ENCONTRADA });
  }
};

export const stats = async () => {
  try {
    return await getReviewStatsClient();
  } catch (error) {
    throw mapClientApiError(error);
  }
};
