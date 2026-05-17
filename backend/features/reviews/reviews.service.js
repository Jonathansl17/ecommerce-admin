import prisma from '../../shared/db/prisma.js';
import { broadcast } from '../../shared/sse/sseManager.js';
import { createReviewNotification as persistReviewNotifications } from '../notifications/notifications.service.js';
import { NOTIFICATION_EVENTS, NOTIFICATION_CONFIG } from '../notifications/notifications.constants.js';

/**
 * Create notifications for all admins that have review notifications enabled
 * (or have no preference row yet, which defaults to true).
 * Broadcasts an SSE new_review event to every notified admin's open connections.
 *
 * @param {{ reviewId: string, productName: string, productId: string, clientName: string, rating: number, reviewText: string }} reviewData
 * @returns {{ notifiedCount: number }}
 */
export const createReviewNotification = async (reviewData) => {
  const isPriority = reviewData.rating <= NOTIFICATION_CONFIG.LOW_RATING_THRESHOLD;

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
    { ...reviewData, isPriority },
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
