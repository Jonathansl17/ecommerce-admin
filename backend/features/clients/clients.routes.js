import { Router } from 'express';
import { getAll, getById, create, update, remove, changeStatus } from './clients.controller.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id/status', changeStatus);
router.delete('/:id', remove);

export default router;
