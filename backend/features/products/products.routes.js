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
import { validateAdjustStock, validateBulkAdjustStock, validateUpdateProduct, validateCreateProduct, validateProductId, validateMovementsQuery } from './products.validator.js';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';

const ADMIN_ROLES = ['administrador'];

const router = Router();
router.use(requireAuth, requireRole(ADMIN_ROLES));

// Rutas de ajuste masivo y por producto (antes de /:id para evitar conflictos)
router.post('/bulk-adjust', validateBulkAdjustStock, bulkAdjustProductStock);
router.post('/:productId/adjust-stock', validateProductId('productId'), validateAdjustStock, adjustProductStock);
router.get('/:productId/movements', validateProductId('productId'), validateMovementsQuery, getProductMovements);

// Rutas CRUD de producto
router.get('/', getAll);
router.post('/', validateCreateProduct, create);
router.get('/:id', validateProductId('id'), getById);
router.put('/:id', validateProductId('id'), validateUpdateProduct, update);
router.delete('/:id', validateProductId('id'), remove);

export default router;
