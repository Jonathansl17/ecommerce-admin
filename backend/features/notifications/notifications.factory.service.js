import prisma from '../../shared/db/prisma.js';
import {
  NOTIFICATION_CONFIG,
  NOTIFICATION_TYPE,
  NOTIFICATION_REVIEW_TITLES,
} from './notifications.constants.js';
import { serializeNotification } from './notifications.serializers.js';

export const createOrderNotification = async (orderData, targetAdminIds) => {
  if (targetAdminIds.length === 0) return [];

  const now = new Date();

  const created = await prisma.$transaction(
    targetAdminIds.map((adminId) =>
      prisma.adminNotification.create({
        data: {
          adminId,
          type: NOTIFICATION_TYPE.INTERNAL,
          title: NOTIFICATION_CONFIG.DEFAULT_ORDER_TITLE,
          content: JSON.stringify({
            products: orderData.products,
            total: orderData.total,
            shippingAddress: orderData.shippingAddress,
            hasCustomization: orderData.hasCustomization,
            clientName: orderData.clientName,
            orderId: orderData.orderId,
          }),
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

  const now = new Date();
  const title = reviewData.isPriority
    ? NOTIFICATION_REVIEW_TITLES.PRIORITY
    : NOTIFICATION_REVIEW_TITLES.STANDARD;

  const entityId = reviewData.internalReviewId
    ? BigInt(reviewData.internalReviewId)
    : reviewData.reviewId && !Number.isNaN(Number(reviewData.reviewId))
      ? BigInt(reviewData.reviewId)
      : null;

  const created = await prisma.$transaction(
    targetAdminIds.map((adminId) =>
      prisma.adminNotification.create({
        data: {
          adminId,
          type: NOTIFICATION_TYPE.INTERNAL,
          title,
          content: JSON.stringify({
            productName: reviewData.productName,
            productId: reviewData.productId,
            clientName: reviewData.clientName,
            rating: reviewData.rating,
            reviewText: reviewData.reviewText,
            isPriority: reviewData.isPriority,
          }),
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
