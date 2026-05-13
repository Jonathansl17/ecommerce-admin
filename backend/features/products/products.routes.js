import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  adjustProductStock,
  getProductMovements,
  bulkAdjustProductStock,
} from './products.controller.js';
import { validateAdjustStock, validateBulkAdjustStock, validateUpdateProduct } from './products.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// Rutas de ajuste masivo y por producto (antes de /:id para evitar conflictos)
router.post('/bulk-adjust', requireAuth, validateBulkAdjustStock, bulkAdjustProductStock);
router.post('/:productId/adjust-stock', requireAuth, validateAdjustStock, adjustProductStock);
router.get('/:productId/movements', requireAuth, getProductMovements);

// Rutas CRUD de producto
router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id', validateUpdateProduct, update);
router.delete('/:id', remove);

export default router;
