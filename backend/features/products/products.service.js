import prisma from '../../shared/db/prisma.js';
import { PRODUCTS_MESSAGES, PRODUCTS_CONFIG } from './products.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const { DAILY_SALES_WINDOW_DAYS, AVG_ROUNDING_FACTOR, STOCK_MOVEMENT_TYPE_SALE } = PRODUCTS_CONFIG;

const serializeVariant = (variant) => ({
  id: variant.id.toString(),
  productId: variant.productId.toString(),
  name: variant.name,
  priceOverride: variant.priceOverride !== null ? Number(variant.priceOverride) : null,
});

const serializeProduct = (product, avgDailySales = null, daysRemaining = null) => ({
  id: product.id.toString(),
  name: product.name,
  description: product.description ?? null,
  price: Number(product.price),
  status: product.status,
  currentStock: product.currentStock,
  minThreshold: product.minThreshold ?? null,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
  variants: (product.variants ?? []).map(serializeVariant),
  avgDailySales,
  daysRemaining,
});

function roundAvg(value) {
  return Math.round(value * AVG_ROUNDING_FACTOR) / AVG_ROUNDING_FACTOR;
}

function calcDaysRemaining(currentStock, avgDailySales) {
  if (avgDailySales <= 0) return null;
  return Math.floor(currentStock / avgDailySales);
}

function isProductLowStock(product) {
  const { minThreshold, currentStock } = product;
  return minThreshold !== null && minThreshold > 0 && currentStock <= minThreshold;
}

async function calcProductAvgDailySales(productId) {
  const since = new Date();
  since.setDate(since.getDate() - DAILY_SALES_WINDOW_DAYS);
  since.setHours(0, 0, 0, 0);

  const movements = await prisma.productStockMovement.findMany({
    where: { productId, type: STOCK_MOVEMENT_TYPE_SALE, createdAt: { gte: since } },
    select: { previousQuantity: true, newQuantity: true },
  });

  if (movements.length === 0) return 0;

  const totalSold = movements.reduce(
    (sum, m) => sum + (m.previousQuantity - m.newQuantity),
    0,
  );
  return totalSold / DAILY_SALES_WINDOW_DAYS;
}

async function buildProductStockMetrics(product) {
  const avg = await calcProductAvgDailySales(product.id);
  return {
    avgDailySales: roundAvg(avg),
    daysRemaining: calcDaysRemaining(product.currentStock, avg),
  };
}

export const getAll = async () => {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { name: 'asc' },
  });

  return Promise.all(
    products.map(async (product) => {
      if (!isProductLowStock(product)) return serializeProduct(product);
      const metrics = await buildProductStockMetrics(product);
      return serializeProduct(product, metrics.avgDailySales, metrics.daysRemaining);
    }),
  );
};

export const getById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: BigInt(id) },
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
  const { name, description, price, status, minThreshold } = data;
  try {
    const product = await prisma.product.update({
      where: { id: BigInt(id) },
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
  } catch (error) {
    if (error.code === 'P2025') throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    throw error;
  }
};

export const remove = async (id) => {
  const bigId = BigInt(id);

  const product = await prisma.product.findUnique({
    where: { id: bigId },
    include: { variants: true },
  });
  if (!product) throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);

  await prisma.$transaction(async (tx) => {
    await tx.productStockMovement.deleteMany({ where: { productId: bigId } });
    await tx.productVariant.deleteMany({ where: { productId: bigId } });
    await tx.product.delete({ where: { id: bigId } });
  });

  return serializeProduct(product);
};

export const adjustProductStock = async (productId, { newStock, reason, note }, adminId) => {
  const id = BigInt(productId);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);

  const previousQuantity = product.currentStock;
  if (previousQuantity === newStock) {
    throw crearError(PRODUCTS_MESSAGES.MISMO_STOCK, HTTP_STATUS.CONFLICT);
  }

  return prisma.$transaction(async (tx) => {
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
  });
};

export const getProductMovements = async (productId, { reason, startDate, endDate, page = 1, limit = 20 }) => {
  const id = BigInt(productId);

  const product = await prisma.product.findUnique({ where: { id } });
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
  const results = await Promise.allSettled(
    adjustments.map(async ({ productId, newStock }) => {
      const id = BigInt(productId);

      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) throw new Error(`Producto ${productId} no encontrado`);

      const previousQuantity = product.currentStock;

      await prisma.$transaction(async (tx) => {
        await tx.productStockMovement.create({
          data: {
            productId: id,
            adminId: BigInt(adminId),
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
      });

      return { productId, success: true, newStock };
    })
  );

  const processedResults = results.map((result, index) => {
    if (result.status === 'fulfilled') return result.value;
    return {
      productId: adjustments[index].productId,
      success: false,
      error: result.reason?.message ?? 'Error desconocido',
    };
  });

  const successful = processedResults.filter((r) => r.success).length;
  const failed = processedResults.filter((r) => !r.success).length;

  return {
    results: processedResults,
    summary: { total: adjustments.length, successful, failed },
  };
};
