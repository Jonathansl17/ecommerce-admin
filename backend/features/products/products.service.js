import prisma from '../../shared/db/prisma.js';
import { PRODUCTS_MESSAGES, PRODUCTS_CONFIG } from './products.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const serializeVariant = (variant) => ({
  id: variant.id.toString(),
  productId: variant.productId.toString(),
  name: variant.name,
  priceOverride: variant.priceOverride !== null ? Number(variant.priceOverride) : null,
});

const DAILY_SALES_WINDOW_DAYS = 30;

const serializeProduct = (product, avgDailySales = null, daysRemaining = null) => ({
  id: product.id.toString(),
  name: product.name,
  description: product.description ?? null,
  price: Number(product.price),
  status: product.status,
  currentStock: product.currentStock,
  minThreshold: product.minThreshold ?? null,
  isCustomizable: product.isCustomizable,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
  variants: (product.variants ?? []).map(serializeVariant),
  avgDailySales,
  daysRemaining,
});

async function calcProductAvgDailySales(productId) {
  const since = new Date();
  since.setDate(since.getDate() - DAILY_SALES_WINDOW_DAYS);
  since.setHours(0, 0, 0, 0);

  const movements = await prisma.productStockMovement.findMany({
    where: { productId, type: 'sale', createdAt: { gte: since } },
    select: { previousQuantity: true, newQuantity: true },
  });

  if (movements.length === 0) return 0;

  const totalSold = movements.reduce(
    (sum, m) => sum + (m.previousQuantity - m.newQuantity),
    0,
  );
  return totalSold / DAILY_SALES_WINDOW_DAYS;
}

export const getAll = async () => {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { variants: true },
    orderBy: { name: 'asc' },
  });

  return Promise.all(
    products.map(async (product) => {
      const threshold = product.minThreshold;
      const isLowStock =
        threshold !== null && threshold > 0 && product.currentStock <= threshold;

      if (!isLowStock) return serializeProduct(product);

      const avg = await calcProductAvgDailySales(product.id);
      const avgRounded = Math.round(avg * 100) / 100;
      const daysRemaining =
        avg > 0 ? Math.floor(product.currentStock / avg) : null;

      return serializeProduct(product, avgRounded, daysRemaining);
    }),
  );
};

export const getById = async (id) => {
  const product = await prisma.product.findFirst({
    where: { id: BigInt(id), deletedAt: null },
    include: { variants: true },
  });
  if (!product) throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  return serializeProduct(product);
};

export const create = async ({ name, description, price, status }) => {
  const product = await prisma.product.create({
    data: {
      name,
      description: description ?? null,
      price,
      status: status ?? PRODUCTS_CONFIG.ESTADO_POR_DEFECTO,
    },
    include: { variants: true },
  });
  return serializeProduct(product);
};

export const update = async (id, data) => {
  const bigId = BigInt(id);
  const existing = await prisma.product.findFirst({ where: { id: bigId, deletedAt: null } });
  if (!existing) throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);

  const { name, description, price, status, minThreshold } = data;
  const product = await prisma.product.update({
    where: { id: bigId },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(status !== undefined && { status }),
      ...('minThreshold' in data && { minThreshold: minThreshold ?? null }),
    },
    include: { variants: true },
  });
  return serializeProduct(product);
};

export const remove = async (id) => {
  const bigId = BigInt(id);

  const product = await prisma.product.findFirst({
    where: { id: bigId, deletedAt: null },
    include: { variants: true },
  });
  if (!product) throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);

  await prisma.product.update({
    where: { id: bigId },
    data: { deletedAt: new Date() },
  });

  return serializeProduct(product);
};

export const adjustProductStock = async (productId, { newStock, reason, note }, adminId) => {
  const id = BigInt(productId);

  // Read and write inside the same Serializable transaction to prevent TOCTOU:
  // two concurrent adjustments on the same product would otherwise both capture
  // the same previousQuantity and produce a corrupted audit trail.
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findFirst({ where: { id, deletedAt: null } });
    if (!product) throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);

    const previousQuantity = product.currentStock;
    if (previousQuantity === newStock) {
      throw crearError(PRODUCTS_MESSAGES.MISMO_STOCK, HTTP_STATUS.CONFLICT);
    }

    await tx.productStockMovement.create({
      data: {
        productId: id,
        adminId: BigInt(adminId),
        type: 'manual_adjustment',
        previousQuantity,
        newQuantity: newStock,
        reason: reason ?? null,
        note: note ?? null,
      },
    });

    const updated = await tx.product.update({
      where: { id },
      data: { currentStock: newStock },
      include: { variants: true },
    });

    return serializeProduct(updated);
  }, { isolationLevel: 'Serializable' });
};

export const getProductMovements = async (productId, { reason, startDate, endDate, page = 1, limit = 20 }) => {
  const id = BigInt(productId);

  const product = await prisma.product.findFirst({ where: { id, deletedAt: null } });
  if (!product) throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);

  const where = { productId: id };
  if (reason) where.reason = reason;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [total, movements] = await Promise.all([
    prisma.productStockMovement.count({ where }),
    prisma.productStockMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
  ]);

  const adminIds = [...new Set(movements.map((m) => m.adminId))];
  const admins =
    adminIds.length > 0
      ? await prisma.admin.findMany({
          where: { adminUserId: { in: adminIds } },
          include: { adminUser: true },
        })
      : [];
  const adminMap = new Map(admins.map((a) => [a.adminUserId.toString(), a.adminUser.fullName]));

  return {
    data: movements.map((m) => ({
      id: m.id.toString(),
      previousQuantity: m.previousQuantity,
      newQuantity: m.newQuantity,
      reason: m.reason,
      note: m.note,
      type: m.type,
      createdAt: m.createdAt.toISOString(),
      admin: { adminUser: { fullName: adminMap.get(m.adminId.toString()) ?? 'Administrador' } },
    })),
    pagination: { page: pageNum, limit: limitNum, total },
  };
};

export const bulkAdjustProductStock = async (adjustments, reason, note, adminId) => {
  const adminBigId = BigInt(adminId);

  // Single Serializable transaction: all-or-nothing atomicity + prevents TOCTOU
  // on concurrent bulk adjustments touching the same products.
  const updatedItems = await prisma.$transaction(async (tx) => {
    const results = [];

    for (const { productId, newStock } of adjustments) {
      const id = BigInt(productId);

      const product = await tx.product.findFirst({ where: { id, deletedAt: null } });
      if (!product) throw crearError(`Producto no encontrado`, HTTP_STATUS.NOT_FOUND);

      const previousQuantity = product.currentStock;

      await tx.productStockMovement.create({
        data: {
          productId: id,
          adminId: adminBigId,
          type: 'manual_adjustment',
          previousQuantity,
          newQuantity: newStock,
          reason,
          note: note ?? null,
        },
      });

      await tx.product.update({
        where: { id },
        data: { currentStock: newStock },
      });

      results.push({ productId, newStock });
    }

    return results;
  }, { isolationLevel: 'Serializable' });

  return {
    results: updatedItems.map((r) => ({ ...r, success: true })),
    summary: { total: adjustments.length, successful: adjustments.length, failed: 0 },
  };
};
