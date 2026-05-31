import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { addClient, removeClient } from '../../shared/sse/sseManager.js';
import {
  getNotifications as getNotificationsService,
  markAsRead as markAsReadService,
  markAllAsRead as markAllAsReadService,
  getUnreadCount as getUnreadCountService,
  getPreferences as getPreferencesService,
  updatePreferences as updatePreferencesService,
} from './notifications.crud.service.js';
import { NOTIFICATION_CONFIG } from './notifications.constants.js';

export const stream = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const adminId = String(req.user.id);
  addClient(adminId, res);

  res.write(': connected\n\n');

  const keepaliveTimer = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
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
    return res.status(HTTP_STATUS.OK).json({ data: notifications, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const result = await getUnreadCountService(req.user.id);
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const notification = await markAsReadService(req.params.id, req.user.id);
    return res.status(HTTP_STATUS.OK).json({ data: notification, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    const result = await markAllAsReadService(req.user.id);
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getPreferences = async (req, res, next) => {
  try {
    const prefs = await getPreferencesService(req.user.id);
    return res.status(HTTP_STATUS.OK).json({ data: prefs, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const prefs = await updatePreferencesService(req.user.id, req.body);
    return res.status(HTTP_STATUS.OK).json({ data: prefs, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};
