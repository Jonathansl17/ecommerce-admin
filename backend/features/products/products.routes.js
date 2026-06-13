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
import { uploadImage, uploadImageMiddleware, serveImage } from './products.image.controller.js';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';
import { inventoryWriteRateLimit } from '../../shared/middleware/rateLimitMiddleware.js';

const ADMIN_ROLES = ['administrador'];

export const productImagesPublicRouter = Router();
productImagesPublicRouter.get('/image/:imageId', validateProductId('imageId'), serveImage);

const router = Router();
router.use(requireAuth, requireRole(ADMIN_ROLES));

router.post('/upload-image', uploadImageMiddleware, uploadImage);

// Rutas de ajuste masivo y por producto (antes de /:id para evitar conflictos)
router.post('/bulk-adjust', inventoryWriteRateLimit, validateBulkAdjustStock, bulkAdjustProductStock);
router.post('/:productId/adjust-stock', inventoryWriteRateLimit, validateProductId('productId'), validateAdjustStock, adjustProductStock);
router.get('/:productId/movements', validateProductId('productId'), validateMovementsQuery, getProductMovements);

// Rutas CRUD de producto
router.get('/', getAll);
router.post('/', inventoryWriteRateLimit, validateCreateProduct, create);
router.get('/:id', validateProductId('id'), getById);
router.put('/:id', inventoryWriteRateLimit, validateProductId('id'), validateUpdateProduct, update);
router.delete('/:id', inventoryWriteRateLimit, validateProductId('id'), remove);

export default router;
