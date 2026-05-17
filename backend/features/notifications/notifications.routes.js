import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { validateUpdatePreferences } from './notifications.validator.js';
import {
  stream,
  getAll,
  getUnreadCount,
  markRead,
  markAllRead,
  getPreferences,
  updatePreferences,
} from './notifications.controller.js';

const router = Router();

// SSE — EventSource cannot set custom headers, so this route is
// intentionally exempt from the requireFetchHeader CSRF check.
// The route is still protected by requireAuth (JWT cookie).
router.get('/stream', requireAuth, stream);

router.get('/', requireAuth, getAll);
router.get('/unread-count', requireAuth, getUnreadCount);
router.patch('/:id/read', requireAuth, markRead);
router.patch('/read-all', requireAuth, markAllRead);
router.get('/preferences', requireAuth, getPreferences);
router.put('/preferences', requireAuth, validateUpdatePreferences, updatePreferences);

export default router;
