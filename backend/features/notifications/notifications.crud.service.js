import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { NOTIFICATION_MESSAGES, NOTIFICATION_CONFIG } from './notifications.constants.js';
import { serializeNotification, serializePreferences } from './notifications.serializers.js';

export const getNotifications = async (adminId) => {
  const notifications = await prisma.adminNotification.findMany({
    where: { adminId },
    orderBy: { createdAt: 'desc' },
    take: NOTIFICATION_CONFIG.FETCH_LIMIT,
  });

  return notifications.map(serializeNotification);
};

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

export const markAllAsRead = async (adminId) => {
  const result = await prisma.adminNotification.updateMany({
    where: { adminId, read: false },
    data: { read: true },
  });

  return { updated: result.count };
};

export const getUnreadCount = async (adminId) => {
  const count = await prisma.adminNotification.count({
    where: { adminId, read: false },
  });

  return { count };
};

export const getPreferences = async (adminId) => {
  const prefs = await prisma.notificationPreference.upsert({
    where: { adminUserId: adminId },
    create: {
      adminUserId: adminId,
      receiveOrderNotifications: true,
      receiveReviewNotifications: true,
    },
    update: {},
  });

  return serializePreferences(prefs);
};

export const updatePreferences = async (adminId, data) => {
  const updatePayload = {};
  if (data.receiveOrderNotifications !== undefined) {
    updatePayload.receiveOrderNotifications = data.receiveOrderNotifications;
  }
  if (data.receiveReviewNotifications !== undefined) {
    updatePayload.receiveReviewNotifications = data.receiveReviewNotifications;
  }

  const prefs = await prisma.notificationPreference.upsert({
    where: { adminUserId: adminId },
    create: {
      adminUserId: adminId,
      receiveOrderNotifications: data.receiveOrderNotifications ?? true,
      receiveReviewNotifications: data.receiveReviewNotifications ?? true,
    },
    update: updatePayload,
  });

  return serializePreferences(prefs);
};
