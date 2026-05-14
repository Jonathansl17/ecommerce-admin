import prisma from '../../shared/db/prisma.js';
import { broadcast } from '../../shared/sse/sseManager.js';
import { createOrderNotification as persistOrderNotifications } from '../notifications/notifications.service.js';
import { NOTIFICATION_EVENTS } from '../notifications/notifications.constants.js';

/**
 * Create notifications for all admins that have order notifications enabled
 * (or have no preference row yet, which defaults to true).
 * Broadcasts an SSE event to every notified admin's open connections.
 *
 * @param {{ orderId: string, clientName: string, products: object[], total: number, shippingAddress: string, hasCustomization: boolean }} orderData
 * @returns {{ notifiedCount: number }}
 */
export const createOrderNotification = async (orderData) => {
  // Fetch AdminUsers that have receiveOrderNotifications = true
  // OR have no preference row at all (default = true).
  // Only target AdminUsers that have an Admin row (linked to a role)
  // AND have order notifications enabled (or no preference row = default true).
  const adminUsers = await prisma.adminUser.findMany({
    where: {
      accountStatus: 'active',
      admin: { isNot: null },
      OR: [
        { notificationPreference: { receiveOrderNotifications: true } },
        { notificationPreference: null },
      ],
    },
    select: { id: true },
  });

  if (adminUsers.length === 0) {
    return { notifiedCount: 0 };
  }

  const targetAdminIds = adminUsers.map((u) => u.id);

  const notifications = await persistOrderNotifications(orderData, targetAdminIds);

  // Broadcast real-time SSE to each notified admin
  for (let i = 0; i < targetAdminIds.length; i++) {
    const adminId = String(targetAdminIds[i]);
    const notification = notifications[i];
    broadcast([adminId], NOTIFICATION_EVENTS.NEW_ORDER, { notification });
  }

  return { notifiedCount: notifications.length };
};
