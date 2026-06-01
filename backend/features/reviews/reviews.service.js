import prisma from '../../shared/db/prisma.js';
import { broadcast } from '../../shared/sse/sseManager.js';
import { createReviewNotification as persistReviewNotifications } from '../notifications/notifications.factory.service.js';
import { NOTIFICATION_EVENTS, NOTIFICATION_CONFIG } from '../notifications/notifications.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { ACCOUNT_STATUS } from '../../shared/constants/app.constants.js';
import { MODERATION_DEFAULT_REASON, REVIEW_MESSAGES } from './reviews.constants.js';

const reviewInclude = { adminResponse: true };

/**
 * Serialize a Review Prisma record into the shape the admin frontend consumes.
 * Converts BigInt ids to strings and flattens the denormalized client/product
 * fields into nested objects.
 *
 * @param {object} r - Review row including `adminResponse`.
 * @returns {object}
 */
const serializeReview = (r) => ({
  id: r.id.toString(),
  productId: r.productId,
  clientUserId: r.clientId ?? '',
  rating: r.rating,
  comment: r.comment,
  status: r.status,
  edited: r.edited,
  helpfulVotes: r.helpfulVotes,
  unhelpfulVotes: r.unhelpfulVotes,
  adminResponse: r.adminResponse?.text ?? null,
  createdAt: r.createdAt.toISOString(),
  updatedAt: r.updatedAt.toISOString(),
  clientUser: {
    id: r.clientId ?? '',
    fullName: r.clientName,
    email: r.clientEmail ?? '',
  },
  product: {
    itemId: r.productId,
    name: r.productName,
    imageUrl: null,
  },
});

/**
 * Persist a review pushed by the storefront webhook, then notify all admins
 * that have review notifications enabled (or no preference row yet).
 * Broadcasts an SSE `new_review` event to every notified admin.
 *
 * @param {{ reviewId: string, productName: string, productId: string, clientName: string, clientId?: string, clientEmail?: string, rating: number, reviewText: string }} reviewData
 * @returns {{ notifiedCount: number }}
 */
export const createReviewNotification = async (reviewData) => {
  const isPriority = reviewData.rating <= NOTIFICATION_CONFIG.LOW_RATING_THRESHOLD;

  const review = await prisma.review.create({
    data: {
      externalId: reviewData.reviewId,
      productId: reviewData.productId,
      productName: reviewData.productName,
      clientId: reviewData.clientId ?? null,
      clientName: reviewData.clientName,
      clientEmail: reviewData.clientEmail ?? null,
      rating: reviewData.rating,
      comment: reviewData.reviewText,
      isPriority,
      status: 'pending',
    },
  });

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
  const payload = { ...reviewData, isPriority, internalReviewId: review.id };

  const notifications = await persistReviewNotifications(payload, targetAdminIds);

  notifications.forEach((notification, i) => {
    broadcast([String(targetAdminIds[i])], NOTIFICATION_EVENTS.NEW_REVIEW, { notification });
  });

  return { notifiedCount: notifications.length };
};

/**
 * List reviews, optionally filtered by status / rating, ordered by priority
 * then recency. Returns the `{ total, items }` shape the frontend expects.
 *
 * @param {{ status?: string, rating?: number, limit?: number, offset?: number }} filters
 */
export const getReviews = async ({ status, rating, limit, offset } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (rating) where.rating = rating;

  const [total, rows] = await prisma.$transaction([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      include: reviewInclude,
      orderBy: [{ isPriority: 'desc' }, { createdAt: 'desc' }],
      skip: offset,
      take: limit,
    }),
  ]);

  return { total, items: rows.map(serializeReview) };
};

/**
 * Fetch a single review by its internal id.
 *
 * @param {string} id
 */
export const getReview = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id: BigInt(id) },
    include: reviewInclude,
  });
  if (!review) throw crearError(REVIEW_MESSAGES.NO_ENCONTRADA, HTTP_STATUS.NOT_FOUND);
  return serializeReview(review);
};

/**
 * Approve a pending review.
 *
 * @param {string} id
 */
export const approveReview = async (id) => {
  const review = await prisma.review.findUnique({ where: { id: BigInt(id) } });
  if (!review) throw crearError(REVIEW_MESSAGES.NO_ENCONTRADA, HTTP_STATUS.NOT_FOUND);
  if (review.status !== 'pending') {
    throw crearError(REVIEW_MESSAGES.YA_PROCESADA, HTTP_STATUS.CONFLICT);
  }

  const updated = await prisma.review.update({
    where: { id: BigInt(id) },
    data: { status: 'approved' },
    include: reviewInclude,
  });
  return serializeReview(updated);
};

/**
 * Reject a pending review and append a moderation record (audit log).
 *
 * @param {string} id
 * @param {string} adminId
 * @param {{ reason?: string, notes?: string }} body
 */
export const rejectReview = async (id, adminId, { reason, notes } = {}) => {
  const review = await prisma.review.findUnique({ where: { id: BigInt(id) } });
  if (!review) throw crearError(REVIEW_MESSAGES.NO_ENCONTRADA, HTTP_STATUS.NOT_FOUND);
  if (review.status !== 'pending') {
    throw crearError(REVIEW_MESSAGES.YA_PROCESADA, HTTP_STATUS.CONFLICT);
  }

  const [updated] = await prisma.$transaction([
    prisma.review.update({
      where: { id: BigInt(id) },
      data: { status: 'rejected' },
      include: reviewInclude,
    }),
    prisma.moderationRecord.create({
      data: {
        reviewId: BigInt(id),
        adminId: BigInt(adminId),
        action: 'rejected',
        reason: reason ?? MODERATION_DEFAULT_REASON,
        notes: notes ?? null,
        productName: review.productName,
        clientName: review.clientName,
      },
    }),
  ]);

  return serializeReview(updated);
};

/**
 * Add an admin response to a review. One response per review; rejected reviews
 * cannot be responded to.
 *
 * @param {string} id
 * @param {string} adminId
 * @param {{ responseText: string }} body
 */
export const respondToReview = async (id, adminId, { responseText }) => {
  const review = await prisma.review.findUnique({
    where: { id: BigInt(id) },
    include: { adminResponse: true },
  });
  if (!review) throw crearError(REVIEW_MESSAGES.NO_ENCONTRADA, HTTP_STATUS.NOT_FOUND);
  if (review.adminResponse) {
    throw crearError(REVIEW_MESSAGES.YA_TIENE_RESPUESTA, HTTP_STATUS.CONFLICT);
  }
  if (review.status === 'rejected') {
    throw crearError(REVIEW_MESSAGES.NO_RESPONDER_RECHAZADA, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  await prisma.adminResponse.create({
    data: { reviewId: BigInt(id), adminId: BigInt(adminId), text: responseText },
  });

  const updated = await prisma.review.findUnique({
    where: { id: BigInt(id) },
    include: reviewInclude,
  });
  return serializeReview(updated);
};

/**
 * Delete a review as a moderator: appends an immutable moderation record and
 * removes the review. Its admin response is removed via onDelete cascade.
 *
 * @param {string} id
 * @param {string} adminId
 * @param {{ reason: string, detail?: string }} body
 */
export const deleteReview = async (id, adminId, { reason, detail } = {}) => {
  const review = await prisma.review.findUnique({ where: { id: BigInt(id) } });
  if (!review) throw crearError(REVIEW_MESSAGES.NO_ENCONTRADA, HTTP_STATUS.NOT_FOUND);

  await prisma.$transaction([
    prisma.moderationRecord.create({
      data: {
        reviewId: BigInt(id),
        adminId: BigInt(adminId),
        action: 'deleted',
        reason,
        notes: detail ?? null,
        productName: review.productName,
        clientName: review.clientName,
      },
    }),
    prisma.review.delete({ where: { id: BigInt(id) } }),
  ]);

  return { id, deleted: true };
};

/**
 * Aggregate review counts by status.
 */
export const stats = async () => {
  const [pending, approved, rejected] = await Promise.all([
    prisma.review.count({ where: { status: 'pending' } }),
    prisma.review.count({ where: { status: 'approved' } }),
    prisma.review.count({ where: { status: 'rejected' } }),
  ]);
  return { pending, approved, rejected, total: pending + approved + rejected };
};
