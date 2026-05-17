import nodemailer from 'nodemailer';
import prisma from '../../shared/db/prisma.js';
import { broadcast } from '../../shared/sse/sseManager.js';
import { createReviewNotification as persistReviewNotifications } from '../notifications/notifications.service.js';
import { NOTIFICATION_EVENTS, NOTIFICATION_CONFIG } from '../notifications/notifications.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

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

/**
 * Get a list of reviews, optionally filtered by status.
 * Ordered by priority (desc) then creation date (desc).
 *
 * @param {{ status?: string }} options
 * @returns {object[]}
 */
export const getReviews = async ({ status } = {}) => {
  const reviews = await prisma.review.findMany({
    where: status ? { status } : undefined,
    include: {
      adminResponse: { include: { admin: { include: { adminUser: true } } } },
      moderationRecord: true,
    },
    orderBy: [{ isPriority: 'desc' }, { createdAt: 'desc' }],
  });
  return reviews.map(serializeReview);
};

/**
 * Get a single review by its internal ID.
 *
 * @param {string} id
 * @returns {object}
 */
export const getReview = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id: BigInt(id) },
    include: {
      adminResponse: { include: { admin: { include: { adminUser: true } } } },
      moderationRecord: true,
    },
  });
  if (!review) throw crearError('Reseña no encontrada', HTTP_STATUS.NOT_FOUND);
  return serializeReview(review);
};

/**
 * Approve a pending review.
 *
 * @param {string} reviewId
 * @returns {object}
 */
export const approveReview = async (reviewId) => {
  const review = await prisma.review.findUnique({ where: { id: BigInt(reviewId) } });
  if (!review) throw crearError('Reseña no encontrada', HTTP_STATUS.NOT_FOUND);
  if (review.status !== 'pending') throw crearError('La reseña ya fue procesada', HTTP_STATUS.CONFLICT);

  const updated = await prisma.review.update({
    where: { id: BigInt(reviewId) },
    data: { status: 'approved' },
    include: { adminResponse: true, moderationRecord: true },
  });
  return serializeReview(updated);
};

/**
 * Reject a pending review and create a moderation record.
 * If the review has a clientEmail, a rejection email is sent fire-and-forget.
 *
 * @param {string} reviewId
 * @param {string} adminId
 * @param {{ reason: string, notes?: string }} body
 * @returns {object}
 */
export const rejectReview = async (reviewId, adminId, { reason, notes }) => {
  const review = await prisma.review.findUnique({ where: { id: BigInt(reviewId) } });
  if (!review) throw crearError('Reseña no encontrada', HTTP_STATUS.NOT_FOUND);
  if (review.status !== 'pending') throw crearError('La reseña ya fue procesada', HTTP_STATUS.CONFLICT);

  const [updated] = await prisma.$transaction([
    prisma.review.update({
      where: { id: BigInt(reviewId) },
      data: { status: 'rejected' },
      include: { adminResponse: true, moderationRecord: true },
    }),
    prisma.moderationRecord.create({
      data: {
        reviewId: BigInt(reviewId),
        adminId: BigInt(adminId),
        reason,
        notes: notes ?? null,
      },
    }),
  ]);

  if (review.clientEmail) {
    sendRejectionEmail(review).catch((err) =>
      console.error('[Reviews] Error sending rejection email:', err.message)
    );
  }

  return serializeReview(updated);
};

/**
 * Add an admin response to a review that has not yet been responded to.
 * Cannot respond to rejected reviews.
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
  return serializeReview(updated);
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Send a rejection email to the client whose review was not approved.
 * Uses the same SMTP transporter configuration as the rest of the application.
 *
 * @param {{ clientEmail: string, clientName: string, productName: string }} review
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
  const html = `
    <h2>Hola, ${review.clientName}</h2>
    <p>Gracias por tomarte el tiempo de dejar una reseña sobre <strong>${review.productName}</strong>.</p>
    <p>Lamentablemente, tu reseña no pudo ser publicada porque no cumplió con nuestras pautas comunitarias.</p>
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    <p>Saludos,<br>El equipo de atención al cliente</p>
  `;

  await transporter.sendMail({ from, to: review.clientEmail, subject, html });
}

/**
 * Serialize a Review Prisma record to a safe JSON-serializable object.
 * Converts BigInt fields to strings.
 *
 * @param {object} r
 * @returns {object}
 */
function serializeReview(r) {
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
