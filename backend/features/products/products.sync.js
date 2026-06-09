import prisma from '../../shared/db/prisma.js';
import { createProduct, updateProduct, deleteProduct } from '../../shared/clientApi/index.js';
import { PRODUCTS_CONFIG, PRODUCTS_SYNC } from './products.constants.js';

const buildClientPayload = (product) => ({
  name: product.name,
  description: product.description ?? '',
  imageUrl: product.imageUrl ?? PRODUCTS_CONFIG.IMAGEN_POR_DEFECTO,
  category: product.category ?? PRODUCTS_CONFIG.CATEGORIA_POR_DEFECTO,
  type: product.isCustomizable ? 'custom' : 'standard',
  status: product.status,
  variant: {
    color: PRODUCTS_SYNC.VARIANTE_COLOR_POR_DEFECTO,
    size: PRODUCTS_SYNC.VARIANTE_TALLA_POR_DEFECTO,
    price: Number(product.price),
    currentStock: product.currentStock,
    minThreshold: product.minThreshold ?? 0,
    reservedStock: 0,
  },
});

const logSyncError = (action, productId, error) => {
  console.error(
    `[products.sync] ${action} del producto ${productId} hacia client falló:`,
    error?.message ?? error,
  );
};

export const syncProductCreated = async (product) => {
  try {
    const result = await createProduct(buildClientPayload(product));
    const itemId = result?.itemId ?? result?.id ?? null;
    if (itemId != null) {
      await prisma.product.update({
        where: { id: product.id },
        data: { clientItemId: BigInt(itemId) },
      });
    }
  } catch (error) {
    logSyncError('creación', product.id, error);
  }
};

export const syncProductUpdated = async (product) => {
  try {
    if (product.clientItemId == null) {
      await syncProductCreated(product);
      return;
    }
    await updateProduct(product.clientItemId.toString(), buildClientPayload(product));
  } catch (error) {
    logSyncError('actualización', product.id, error);
  }
};

export const syncProductDeleted = async (product) => {
  try {
    if (product.clientItemId == null) return;
    await deleteProduct(product.clientItemId.toString());
  } catch (error) {
    logSyncError('eliminación', product.id, error);
  }
};
