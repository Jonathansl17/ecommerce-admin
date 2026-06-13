import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import {
  NOTIFICATION_MESSAGES,
  NOTIFICATION_CONFIG,
  CUSTOMIZATION_STATUS,
  CONTENT_KEYS,
} from './notifications.constants.js';
import { serializeNotification, serializePreferences } from './notifications.serializers.js';

async function findAndAssertOwnership(notificationId, adminId) {
  if (!/^\d+$/.test(String(notificationId))) {
    throw crearError(NOTIFICATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  const id = BigInt(notificationId);
  const ownerAdminId = BigInt(adminId);
  const notification = await prisma.adminNotification.findUnique({ where: { id } });
  if (!notification) throw crearError(NOTIFICATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  if (notification.adminId !== ownerAdminId) throw crearError(NOTIFICATION_MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
  return { notification, id };
}

function applyCustomizationStatus(content, status, rejectionReason) {
  let parsed;
  try {
    parsed = content ? JSON.parse(content) : {};
  } catch {
    throw crearError(NOTIFICATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (parsed[CONTENT_KEYS.CUSTOMIZATION_STATUS]) {
    throw crearError(NOTIFICATION_MESSAGES.ALREADY_PROCESSED, HTTP_STATUS.CONFLICT);
  }
  parsed[CONTENT_KEYS.CUSTOMIZATION_STATUS] = status;
  if (status === CUSTOMIZATION_STATUS.REJECTED && rejectionReason) {
    parsed[CONTENT_KEYS.CUSTOMIZATION_REJECTION_REASON] = rejectionReason;
  } else {
    delete parsed[CONTENT_KEYS.CUSTOMIZATION_REJECTION_REASON];
  }
  return JSON.stringify(parsed);
}

export const getNotifications = async (adminId) => {
  const notifications = await prisma.adminNotification.findMany({
    where: { adminId: BigInt(adminId) },
    orderBy: { createdAt: 'desc' },
    take: NOTIFICATION_CONFIG.FETCH_LIMIT,
  });

  return notifications.map(serializeNotification);
};

export const markAsRead = async (notificationId, adminId) => {
  const { id } = await findAndAssertOwnership(notificationId, adminId);

  const updated = await prisma.adminNotification.update({
    where: { id },
    data: { read: true },
  });

  return serializeNotification(updated);
};

export const markAllAsRead = async (adminId) => {
  const result = await prisma.adminNotification.updateMany({
    where: { adminId: BigInt(adminId), read: false },
    data: { read: true },
  });

  return { updated: result.count };
};

export const getUnreadCount = async (adminId) => {
  const count = await prisma.adminNotification.count({
    where: { adminId: BigInt(adminId), read: false },
  });

  return { count };
};

export const deleteNotification = async (notificationId, adminId) => {
  const { id } = await findAndAssertOwnership(notificationId, adminId);

  await prisma.adminNotification.delete({ where: { id } });

  return { deleted: 1 };
};

export const deleteAllNotifications = async (adminId) => {
  const result = await prisma.adminNotification.deleteMany({
    where: { adminId: BigInt(adminId) },
  });

  return { deleted: result.count };
};

export const updateCustomizationStatus = async (notificationId, adminId, status, rejectionReason) => {
  const { notification, id } = await findAndAssertOwnership(notificationId, adminId);

  if (notification.entityType !== NOTIFICATION_CONFIG.DEFAULT_ORDER_ENTITY_TYPE) {
    throw crearError(NOTIFICATION_MESSAGES.WRONG_TYPE, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  const updatedContent = applyCustomizationStatus(notification.content, status, rejectionReason);

  const updated = await prisma.adminNotification.update({
    where: { id },
    data: { content: updatedContent, read: true },
  });

  return serializeNotification(updated);
};

export const getPreferences = async (adminId) => {
  const id = BigInt(adminId);
  const prefs = await prisma.notificationPreference.upsert({
    where: { adminUserId: id },
    create: {
      adminUserId: id,
      receiveOrderNotifications: true,
      receiveReviewNotifications: true,
    },
    update: {},
  });

  return serializePreferences(prefs);
};

export const updatePreferences = async (adminId, data) => {
  const id = BigInt(adminId);
  const updatePayload = {};
  if (data.receiveOrderNotifications !== undefined) {
    updatePayload.receiveOrderNotifications = data.receiveOrderNotifications;
  }
  if (data.receiveReviewNotifications !== undefined) {
    updatePayload.receiveReviewNotifications = data.receiveReviewNotifications;
  }

  const prefs = await prisma.notificationPreference.upsert({
    where: { adminUserId: id },
    create: {
      adminUserId: id,
      receiveOrderNotifications: data.receiveOrderNotifications ?? true,
      receiveReviewNotifications: data.receiveReviewNotifications ?? true,
    },
    update: updatePayload,
  });

  return serializePreferences(prefs);
};
