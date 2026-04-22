import prisma from '../../shared/db/prisma.js';
import { PRODUCTS_MESSAGES, PRODUCTS_CONFIG } from './products.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const incluirSupply = {
  supply: true,
};

export const getAll = async () => {
  return prisma.item.findMany({
    include: incluirSupply,
  });
};

export const getById = async (id) => {
  const item = await prisma.item.findUnique({
    where: { id: BigInt(id) },
    include: incluirSupply,
  });

  if (!item) {
    throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }

  return item;
};

export const create = async ({ name, itemType, status }) => {
  try {
    return await prisma.item.create({
      data: {
        name,
        itemType: itemType ?? PRODUCTS_CONFIG.TIPO_POR_DEFECTO,
        status: status ?? PRODUCTS_CONFIG.ESTADO_POR_DEFECTO,
      },
      include: incluirSupply,
    });
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  const { name, itemType, status } = data;

  try {
    return await prisma.item.update({
      where: { id: BigInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(itemType !== undefined && { itemType }),
        ...(status !== undefined && { status }),
      },
      include: incluirSupply,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    }
    throw error;
  }
};

export const remove = async (id) => {
  try {
    return await prisma.item.delete({
      where: { id: BigInt(id) },
      include: incluirSupply,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    }
    throw error;
  }
};

export const getSupplyMovements = async (id, { reason, startDate, endDate, page = 1, limit = 20 }) => {
  const itemId = BigInt(id);

  const supply = await prisma.supply.findUnique({ where: { itemId } });
  if (!supply) {
    throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }

  const where = { variantId: itemId };
  if (reason) where.reason = reason;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [total, movements] = await Promise.all([
    prisma.stockMovement.count({ where }),
    prisma.stockMovement.findMany({
      where,
      include: { admin: { include: { adminUser: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
  ]);

  return {
    data: movements.map((m) => ({
      id: m.id.toString(),
      previousQuantity: m.previousQuantity,
      newQuantity: m.newQuantity,
      reason: m.reason,
      note: m.note,
      type: m.type,
      createdAt: m.createdAt.toISOString(),
      admin: { adminUser: { fullName: m.admin.adminUser.fullName } },
    })),
    pagination: { page: pageNum, limit: limitNum, total },
  };
};

export const adjustSupplyStock = async (id, { newStock, reason, note }, adminId) => {
  const itemId = BigInt(id);

  const supply = await prisma.supply.findUnique({
    where: { itemId },
    include: { item: true },
  });

  if (!supply) {
    throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }

  const previousQuantity = Math.round(Number(supply.currentStock));

  if (previousQuantity === newStock) {
    throw crearError(PRODUCTS_MESSAGES.MISMO_STOCK, HTTP_STATUS.CONFLICT);
  }

  return prisma.$transaction(async (tx) => {
    await tx.stockMovement.create({
      data: {
        variantId: itemId,
        adminId: BigInt(adminId),
        type: 'manual_adjustment',
        previousQuantity,
        newQuantity: newStock,
        reason,
        note: note || null,
      },
    });

    const updatedSupply = await tx.supply.update({
      where: { itemId },
      data: { currentStock: newStock },
      include: { item: true },
    });

    const minThreshold = Number(updatedSupply.minThreshold);
    const shouldAlert = newStock <= 0 || (minThreshold > 0 && newStock <= minThreshold);

    if (shouldAlert) {
      const alertType = newStock <= 0 ? 'out_of_stock' : 'low_stock';
      const existingAlert = await tx.supplyAlert.findFirst({ where: { supplyId: itemId } });
      if (existingAlert) {
        await tx.supplyAlert.update({
          where: { id: existingAlert.id },
          data: { type: alertType, threshold: updatedSupply.minThreshold, active: true },
        });
      } else {
        await tx.supplyAlert.create({
          data: { supplyId: itemId, type: alertType, threshold: updatedSupply.minThreshold, active: true },
        });
      }
    } else {
      await tx.supplyAlert.updateMany({ where: { supplyId: itemId, active: true }, data: { active: false } });
    }

    return {
      id: updatedSupply.item.id.toString(),
      name: updatedSupply.item.name,
      status: updatedSupply.item.status,
      unitOfMeasure: updatedSupply.unitOfMeasure,
      currentStock: updatedSupply.currentStock,
      minThreshold: updatedSupply.minThreshold,
    };
  });
};
