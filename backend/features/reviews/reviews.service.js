import nodemailer from 'nodemailer';
import prisma from '../../shared/db/prisma.js';
import { broadcast } from '../../shared/sse/sseManager.js';
import { createReviewNotification as persistReviewNotifications } from '../notifications/notifications.service.js';
import { NOTIFICATION_EVENTS, NOTIFICATION_CONFIG } from '../notifications/notifications.constants.js';
import {
  listReviews as listReviewsClient,
  getReview as getReviewClient,
  updateReviewStatus as updateReviewStatusClient,
  getReviewStats as getReviewStatsClient,
} from '../../shared/clientApi/reviews.client.js';
import { ClientApiError } from '../../shared/clientApi/client-api.errors.js';
import { CLIENT_API_ERROR_CODES } from '../../shared/clientApi/client-api.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { REVIEW_BAD_RESPONSE_FIELDS, REVIEW_MESSAGES } from './reviews.constants.js';

/**
 * Create notifications for all admins that have review notifications enabled
 * (or have no preference row yet, which defaults to true).
 * Also persists a Review record in the local DB.
 * Broadcasts an SSE new_review event to every notified admin's open connections.
 *
 * @param {{ reviewId: string, productName: string, productId: string, clientName: string, clientId?: string, clientEmail?: string, rating: number, reviewText: string }} reviewData
 * @returns {{ notifiedCount: number }}
 */
export const createReviewNotification = async (reviewData) => {
  const isPriority = reviewData.rating <= NOTIFICATION_CONFIG.LOW_RATING_THRESHOLD;

  // Persist the review in the local DB so it can be moderated and responded to.
  const review = await prisma.review.create({
    data: {
      externalId: reviewData.reviewId,
      productId: reviewData.productId,
      productName: reviewData.productName,
      clientId: reviewData.clientId ?? null,
      clientName: reviewData.clientName,
      clientEmail: reviewData.clientEmail ?? null,
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
      isPriority,
      status: 'pending',
    },
  });

  // Fetch AdminUsers that have receiveReviewNotifications = true
  // OR have no preference row at all (default = true).
  // Only target AdminUsers that have an Admin row (linked to a role).
  const adminUsers = await prisma.adminUser.findMany({
    where: {
      accountStatus: 'active',
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

  const notifications = await persistReviewNotifications(
    { ...reviewData, isPriority, internalReviewId: review.id },
    targetAdminIds
  );

  // Broadcast real-time SSE to each notified admin
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
 * Reject a review via the client backend. Reason/notes from the admin are
 * accepted but not forwarded — the client backend only stores status.
 * If the review carries a client email, a rejection email is fired off.
 *
 * @param {string} id
 * @param {string} _adminId
 * @param {{ reason: string, notes?: string }} _body
 */
export const rejectReview = async (id, _adminId, _body = {}) => {
  let updated;
  try {
    updated = await updateReviewStatusClient(id, { status: 'rejected' });
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: REVIEW_MESSAGES.NO_ENCONTRADA });
  }

  const clientEmail = updated?.clientUser?.email;
  const clientName = updated?.clientUser?.fullName;
  const productName = updated?.product?.name;
  if (clientEmail) {
    sendRejectionEmail({ clientEmail, clientName, productName }).catch((err) =>
      console.error('[Reviews] Error sending rejection email:', err.message)
    );
  }

  return updated;
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

/**
 * Add an admin response to a review that has not yet been responded to.
 * Cannot respond to rejected reviews.
 *
 * Note: this still operates against the LOCAL Review table while the
 * AdminResponse/ModerationRecord migration is pending.
 *
 * @param {string} reviewId
 * @param {string} adminId
 * @param {{ text: string }} body
 * @returns {object}
 */
export const respondToReview = async (reviewId, adminId, { text }) => {
  const review = await prisma.review.findUnique({
    where: { id: BigInt(reviewId) },
    include: { adminResponse: true },
  });
  if (!review) throw crearError('Reseña no encontrada', HTTP_STATUS.NOT_FOUND);
  if (review.adminResponse) throw crearError('Esta reseña ya tiene una respuesta', HTTP_STATUS.CONFLICT);
  if (review.status === 'rejected') {
    throw crearError('No se puede responder a una reseña rechazada', HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  await prisma.adminResponse.create({
    data: { reviewId: BigInt(reviewId), adminId: BigInt(adminId), text },
  });

  const updated = await prisma.review.findUnique({
    where: { id: BigInt(reviewId) },
    include: {
      adminResponse: { include: { admin: { include: { adminUser: true } } } },
      moderationRecord: true,
    },
  });
  return serializeLocalReview(updated);
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Send a rejection email to the client whose review was not approved.
 * Uses the same SMTP transporter configuration as the rest of the application.
 *
 * @param {{ clientEmail: string, clientName?: string|null, productName?: string|null }} review
 */
async function sendRejectionEmail(review) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const subject = 'Tu reseña no fue aprobada';
  const clientName = review.clientName ?? 'cliente';
  const productName = review.productName ?? 'el producto';
  const html = `
    <h2>Hola, ${clientName}</h2>
    <p>Gracias por tomarte el tiempo de dejar una reseña sobre <strong>${productName}</strong>.</p>
    <p>Lamentablemente, tu reseña no pudo ser publicada porque no cumplió con nuestras pautas comunitarias.</p>
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    <p>Saludos,<br>El equipo de atención al cliente</p>
  `;

  await transporter.sendMail({ from, to: review.clientEmail, subject, html });
}

/**
 * Serialize a local Review Prisma record. Used only by respondToReview while
 * the AdminResponse/ModerationRecord migration is pending.
 *
 * @param {object} r
 * @returns {object}
 */
function serializeLocalReview(r) {
  return {
    id: r.id.toString(),
    externalId: r.externalId,
    productId: r.productId,
    productName: r.productName,
    clientId: r.clientId ?? null,
    clientName: r.clientName,
    clientEmail: r.clientEmail ?? null,
    rating: r.rating,
    reviewText: r.reviewText,
    isPriority: r.isPriority,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    adminResponse: r.adminResponse
      ? {
          id: r.adminResponse.id.toString(),
          text: r.adminResponse.text,
          adminName: r.adminResponse.admin?.adminUser?.fullName ?? null,
          createdAt: r.adminResponse.createdAt.toISOString(),
        }
      : null,
    moderationRecord: r.moderationRecord
      ? {
          id: r.moderationRecord.id.toString(),
          reason: r.moderationRecord.reason,
          notes: r.moderationRecord.notes ?? null,
          createdAt: r.moderationRecord.createdAt.toISOString(),
        }
      : null,
  };
}
