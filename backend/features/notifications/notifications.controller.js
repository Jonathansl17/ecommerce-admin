import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { addClient, removeClient } from '../../shared/sse/sseManager.js';
import {
  getNotifications as getNotificationsService,
  markAsRead as markAsReadService,
  markAllAsRead as markAllAsReadService,
  getUnreadCount as getUnreadCountService,
  getPreferences as getPreferencesService,
  updatePreferences as updatePreferencesService,
  updateCustomizationStatus as updateCustomizationStatusService,
  deleteNotification as deleteNotificationService,
  deleteAllNotifications as deleteAllNotificationsService,
} from './notifications.crud.service.js';
import { NOTIFICATION_CONFIG, SSE_CONFIG } from './notifications.constants.js';
import { toPublicNotification } from './notifications.serializers.js';

const ok = (res, data) => res.status(HTTP_STATUS.OK).json({ data, error: null, meta: null });

export const stream = (req, res) => {
  res.setHeader('Content-Type', SSE_CONFIG.CONTENT_TYPE);
  res.setHeader('Cache-Control', SSE_CONFIG.CACHE_CONTROL);
  res.setHeader('Connection', SSE_CONFIG.CONNECTION);
  res.flushHeaders();

  const adminId = String(req.user.id);
  addClient(adminId, res);

  res.write(SSE_CONFIG.CONNECTED_MSG);

  const keepaliveTimer = setInterval(() => {
    try {
      res.write(SSE_CONFIG.KEEPALIVE_MSG);
    } catch {
      clearInterval(keepaliveTimer);
    }
  }, NOTIFICATION_CONFIG.KEEPALIVE_INTERVAL_MS);

  req.on('close', () => {
    clearInterval(keepaliveTimer);
    removeClient(adminId, res);
  });
};

export const getAll = async (req, res, next) => {
  try {
    const notifications = await getNotificationsService(req.user.id);
    return ok(res, notifications.map(toPublicNotification));
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const result = await getUnreadCountService(req.user.id);
    return ok(res, result);
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const notification = await markAsReadService(req.params.id, req.user.id);
    return ok(res, toPublicNotification(notification));
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    const result = await markAllAsReadService(req.user.id);
    return ok(res, result);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await deleteNotificationService(req.params.id, req.user.id);
    return ok(res, result);
  } catch (error) {
    next(error);
  }
};

export const removeAll = async (req, res, next) => {
  try {
    const result = await deleteAllNotificationsService(req.user.id);
    return ok(res, result);
  } catch (error) {
    next(error);
  }
};

export const updateCustomizationStatus = async (req, res, next) => {
  try {
    const notification = await updateCustomizationStatusService(
      req.params.id,
      req.user.id,
      req.body.status,
      req.body.rejectionReason,
    );
    return ok(res, toPublicNotification(notification));
  } catch (error) {
    next(error);
  }
};

export const getPreferences = async (req, res, next) => {
  try {
    const prefs = await getPreferencesService(req.user.id);
    return ok(res, prefs);
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const prefs = await updatePreferencesService(req.user.id, req.body);
    return ok(res, prefs);
  } catch (error) {
    next(error);
  }
};
