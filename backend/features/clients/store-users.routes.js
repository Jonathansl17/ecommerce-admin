import { Router } from 'express';
import { getAll, changeStatus } from './store-users.controller.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);
router.patch('/:id/status', changeStatus);

export default router;
