import prisma from '../../shared/db/prisma.js';
import {
  NOTIFICATION_CONFIG,
  NOTIFICATION_TYPE,
  NOTIFICATION_REVIEW_TITLES,
} from './notifications.constants.js';
import { serializeNotification } from './notifications.serializers.js';

async function filterAlreadyNotified(adminIds, entityType, idempotencyPattern) {
  const existing = await prisma.adminNotification.findMany({
    where: {
      adminId: { in: adminIds },
      entityType,
      content: { contains: idempotencyPattern },
    },
    select: { adminId: true },
  });

  const notifiedSet = new Set(existing.map((n) => n.adminId));
  return adminIds.filter((id) => !notifiedSet.has(id));
}

function resolveReviewEntityId(reviewData) {
  if (reviewData.internalReviewId) return BigInt(reviewData.internalReviewId);
  if (reviewData.reviewId && !Number.isNaN(Number(reviewData.reviewId))) {
    return BigInt(reviewData.reviewId);
  }
  return null;
}

export const createOrderNotification = async (orderData, targetAdminIds) => {
  if (targetAdminIds.length === 0) return [];

  const pendingAdminIds = await filterAlreadyNotified(
    targetAdminIds,
    NOTIFICATION_CONFIG.DEFAULT_ORDER_ENTITY_TYPE,
    `"orderId":"${orderData.orderId}"`,
  );

  if (pendingAdminIds.length === 0) return [];

  const now = new Date();
  const content = JSON.stringify({
    products: orderData.products,
    total: orderData.total,
    shippingAddress: orderData.shippingAddress,
    hasCustomization: orderData.hasCustomization,
    clientName: orderData.clientName,
    orderId: orderData.orderId,
  });

  const created = await prisma.$transaction(
    pendingAdminIds.map((adminId) =>
      prisma.adminNotification.create({
        data: {
          adminId,
          type: NOTIFICATION_TYPE.INTERNAL,
          title: NOTIFICATION_CONFIG.DEFAULT_ORDER_TITLE,
          content,
          entityType: NOTIFICATION_CONFIG.DEFAULT_ORDER_ENTITY_TYPE,
          entityId: null,
          read: false,
          sentAt: now,
        },
      })
    )
  );

  return created.map(serializeNotification);
};

export const createReviewNotification = async (reviewData, targetAdminIds) => {
  if (targetAdminIds.length === 0) return [];

  const pendingAdminIds = await filterAlreadyNotified(
    targetAdminIds,
    NOTIFICATION_CONFIG.DEFAULT_REVIEW_ENTITY_TYPE,
    `"reviewId":"${reviewData.reviewId}"`,
  );

  if (pendingAdminIds.length === 0) return [];

  const now = new Date();
  const title = reviewData.isPriority
    ? NOTIFICATION_REVIEW_TITLES.PRIORITY
    : NOTIFICATION_REVIEW_TITLES.STANDARD;

  const entityId = resolveReviewEntityId(reviewData);
  const content = JSON.stringify({
    reviewId: reviewData.reviewId,
    productName: reviewData.productName,
    productId: reviewData.productId,
    clientName: reviewData.clientName,
    rating: reviewData.rating,
    reviewText: reviewData.reviewText,
    isPriority: reviewData.isPriority,
  });

  const created = await prisma.$transaction(
    pendingAdminIds.map((adminId) =>
      prisma.adminNotification.create({
        data: {
          adminId,
          type: NOTIFICATION_TYPE.INTERNAL,
          title,
          content,
          entityType: NOTIFICATION_CONFIG.DEFAULT_REVIEW_ENTITY_TYPE,
          entityId,
          read: false,
          sentAt: now,
        },
      })
    )
  );

  return created.map(serializeNotification);
};
