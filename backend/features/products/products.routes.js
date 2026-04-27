import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  adjustVariantStock,
  getVariantMovements,
  bulkAdjustVariantStock,
} from './products.controller.js';
import { validateAdjustStock, validateBulkAdjustStock } from './products.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// Rutas específicas de variantes (antes de /:id para evitar conflictos de matching)
router.post('/variants/bulk-adjust', requireAuth, validateBulkAdjustStock, bulkAdjustVariantStock);
router.post('/variants/:variantId/adjust-stock', requireAuth, validateAdjustStock, adjustVariantStock);
router.get('/variants/:variantId/movements', requireAuth, getVariantMovements);

// Rutas de producto
router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
