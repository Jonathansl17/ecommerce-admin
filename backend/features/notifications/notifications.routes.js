import { Router } from 'express';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';

const ADMIN_ROLES = ['administrador'];
import {
  validateUpdatePreferences,
  validateUpdateCustomizationStatus,
} from './notifications.validator.js';
import {
  stream,
  getAll,
  getUnreadCount,
  markRead,
  markAllRead,
  getPreferences,
  updatePreferences,
  updateCustomizationStatus,
  remove,
  removeAll,
} from './notifications.controller.js';

const router = Router();

// SSE — EventSource cannot set custom headers, so this route is
// intentionally exempt from the requireFetchHeader CSRF check.
// The route is still protected by requireAuth (JWT cookie).
router.get('/stream', requireAuth, stream);

router.get('/', requireAuth, getAll);
router.get('/unread-count', requireAuth, getUnreadCount);
router.patch('/read-all', requireAuth, markAllRead);
router.patch('/:id/read', requireAuth, markRead);
router.patch('/:id/customization-status', requireAuth, requireRole(ADMIN_ROLES), validateUpdateCustomizationStatus, updateCustomizationStatus);
router.get('/preferences', requireAuth, getPreferences);
router.put('/preferences', requireAuth, validateUpdatePreferences, updatePreferences);
router.delete('/', requireAuth, removeAll);
router.delete('/:id', requireAuth, remove);

export default router;
