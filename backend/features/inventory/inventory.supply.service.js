import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getAll = async () => {
  const items = await prisma.item.findMany({
    where: { itemType: INVENTORY_CONFIG.ITEM_TYPE },
    include: { supply: true },
    orderBy: { name: 'asc' },
  });

  return items.map((item) => ({
    id: item.id.toString(),
    name: item.name,
    status: item.status,
    unitOfMeasure: item.supply?.unitOfMeasure ?? null,
    currentStock: item.supply?.currentStock ?? null,
    minThreshold: item.supply?.minThreshold ?? null,
  }));
};

export const create = async ({ name, unitOfMeasure, initialStock }) => {
  const existing = await prisma.item.findFirst({
    where: { name: { equals: name, mode: 'insensitive' }, itemType: INVENTORY_CONFIG.ITEM_TYPE },
  });

  if (existing) {
    throw crearError(INVENTORY_MESSAGES.NOMBRE_DUPLICADO, HTTP_STATUS.CONFLICT);
  }

  return prisma.$transaction(async (tx) => {
    const item = await tx.item.create({
      data: {
        name,
        itemType: INVENTORY_CONFIG.ITEM_TYPE,
        status: INVENTORY_CONFIG.ESTADO_POR_DEFECTO,
      },
    });

    const supply = await tx.supply.create({
      data: {
        itemId: item.id,
        unitOfMeasure,
        currentStock: initialStock,
        minThreshold: 0,
      },
    });

    return {
      id: item.id.toString(),
      name: item.name,
      status: item.status,
      unitOfMeasure: supply.unitOfMeasure,
      currentStock: supply.currentStock,
      minThreshold: supply.minThreshold,
    };
  });
};

export const update = async (id, { name, unitOfMeasure, minThreshold = 0 }) => {
  const itemId = BigInt(id);

  const item = await prisma.item.findFirst({
    where: { id: itemId, itemType: INVENTORY_CONFIG.ITEM_TYPE },
  });

  if (!item) {
    throw crearError(INVENTORY_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }

  const duplicate = await prisma.item.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      itemType: INVENTORY_CONFIG.ITEM_TYPE,
      NOT: { id: itemId },
    },
  });

  if (duplicate) {
    throw crearError(INVENTORY_MESSAGES.NOMBRE_DUPLICADO, HTTP_STATUS.CONFLICT);
  }

  return prisma.$transaction(async (tx) => {
    const updatedItem = await tx.item.update({
      where: { id: itemId },
      data: { name },
      include: { supply: true },
    });

    const updatedSupply = await tx.supply.update({
      where: { itemId },
      data: { unitOfMeasure, minThreshold },
    });

    // Sync alert state after threshold change
    const currentStock = Number(updatedSupply.currentStock);
    const threshold = Number(minThreshold);
    const shouldAlert = threshold > 0 && currentStock <= threshold;

    if (shouldAlert) {
      const alertType = currentStock <= 0 ? 'out_of_stock' : 'low_stock';
      const existing = await tx.supplyAlert.findFirst({ where: { supplyId: itemId } });
      if (existing) {
        await tx.supplyAlert.update({ where: { id: existing.id }, data: { type: alertType, threshold: minThreshold, active: true } });
      } else {
        await tx.supplyAlert.create({ data: { supplyId: itemId, type: alertType, threshold: minThreshold, active: true } });
      }
    } else {
      await tx.supplyAlert.updateMany({ where: { supplyId: itemId, active: true }, data: { active: false } });
    }

    return {
      id: updatedItem.id.toString(),
      name: updatedItem.name,
      status: updatedItem.status,
      unitOfMeasure: updatedSupply.unitOfMeasure,
      currentStock: updatedSupply.currentStock,
      minThreshold: updatedSupply.minThreshold,
    };
  });
};
