import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { NOTIFICATION_MESSAGES, NOTIFICATION_CONFIG } from './notifications.constants.js';

/**
 * Fetch up to 50 notifications for an admin, newest first.
 * @param {BigInt} adminId
 */
export const getNotifications = async (adminId) => {
  const notifications = await prisma.adminNotification.findMany({
    where: { adminId },
    orderBy: { createdAt: 'desc' },
    take: NOTIFICATION_CONFIG.FETCH_LIMIT,
  });

  return notifications.map(serializeNotification);
};

/**
 * Mark a single notification as read. Verifies ownership.
 * @param {string} notificationId
 * @param {BigInt} adminId
 */
export const markAsRead = async (notificationId, adminId) => {
  const id = BigInt(notificationId);

  const notification = await prisma.adminNotification.findUnique({
    where: { id },
  });

  if (!notification) {
    throw crearError(NOTIFICATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (notification.adminId !== adminId) {
    throw crearError(NOTIFICATION_MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
  }

  const updated = await prisma.adminNotification.update({
    where: { id },
    data: { read: true },
  });

  return serializeNotification(updated);
};

/**
 * Mark all notifications as read for an admin.
 * @param {BigInt} adminId
 */
export const markAllAsRead = async (adminId) => {
  const result = await prisma.adminNotification.updateMany({
    where: { adminId, read: false },
    data: { read: true },
  });

  return { updated: result.count };
};

/**
 * Get count of unread notifications for an admin.
 * @param {BigInt} adminId
 */
export const getUnreadCount = async (adminId) => {
  const count = await prisma.adminNotification.count({
    where: { adminId, read: false },
  });

  return { count };
};

/**
 * Get or create notification preferences for an admin (defaults to all enabled).
 * @param {BigInt} adminId
 */
export const getPreferences = async (adminId) => {
  const prefs = await prisma.notificationPreference.upsert({
    where: { adminUserId: adminId },
    create: {
      adminUserId: adminId,
      receiveOrderNotifications: true,
    },
    update: {},
  });

  return serializePreferences(prefs);
};

/**
 * Update notification preferences for an admin.
 * @param {BigInt} adminId
 * @param {{ receiveOrderNotifications: boolean }} data
 */
export const updatePreferences = async (adminId, data) => {
  const prefs = await prisma.notificationPreference.upsert({
    where: { adminUserId: adminId },
    create: {
      adminUserId: adminId,
      receiveOrderNotifications: data.receiveOrderNotifications,
    },
    update: {
      receiveOrderNotifications: data.receiveOrderNotifications,
    },
  });

  return serializePreferences(prefs);
};

/**
 * Create AdminNotification records for a set of admin IDs (order notification).
 * @param {{ orderId: string, clientName: string, products: object[], total: number, shippingAddress: string, hasCustomization: boolean }} orderData
 * @param {BigInt[]} targetAdminIds
 * @returns {import('@prisma/client').AdminNotification[]}
 */
export const createOrderNotification = async (orderData, targetAdminIds) => {
  if (targetAdminIds.length === 0) return [];

  const now = new Date();

  const created = await prisma.$transaction(
    targetAdminIds.map((adminId) =>
      prisma.adminNotification.create({
        data: {
          adminId,
          type: 'internal',
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

// ─── Serializers ──────────────────────────────────────────────────────────────

function serializeNotification(n) {
  return {
    id: n.id.toString(),
    adminId: n.adminId.toString(),
    type: n.type,
    title: n.title,
    content: n.content,
    entityType: n.entityType,
    entityId: n.entityId ? n.entityId.toString() : null,
    read: n.read,
    sentAt: n.sentAt ? n.sentAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  };
}

function serializePreferences(p) {
  return {
    adminUserId: p.adminUserId.toString(),
    receiveOrderNotifications: p.receiveOrderNotifications,
    updatedAt: p.updatedAt.toISOString(),
  };
}
