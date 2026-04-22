import { Router } from 'express';
import { getAll, getById, create, update, remove, adjustStock, getMovements } from './products.controller.js';
import { validateAdjustStock } from './products.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.get('/', getAll);
router.get('/:id/movements', requireAuth, getMovements);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/:id/adjust-stock', requireAuth, validateAdjustStock, adjustStock);

export default router;
