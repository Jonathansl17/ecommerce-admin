import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import {
  sincronizarAlertaTrasCambioUmbral,
  calcAvgDailyConsumption,
} from '../../shared/services/supplyAlert.service.js';

export const getAll = async () => {
  const items = await prisma.item.findMany({
    where: { itemType: INVENTORY_CONFIG.ITEM_TYPE },
    include: { supply: { include: { alerts: { where: { active: true }, take: 1 } } } },
    orderBy: { name: 'asc' },
  });

  const results = await Promise.all(
    items.map(async (item) => {
      const supply = item.supply;
      const hasActiveAlert = supply?.alerts?.length > 0;
      let avgDailySales = null;
      let daysRemaining = null;

      if (hasActiveAlert && supply) {
        avgDailySales = await calcAvgDailyConsumption(prisma, item.id);
        daysRemaining =
          avgDailySales > 0
            ? Math.floor(Number(supply.currentStock) / avgDailySales)
            : null;
      }

      return {
        id: item.id.toString(),
        name: item.name,
        status: item.status,
        unitOfMeasure: supply?.unitOfMeasure ?? null,
        currentStock: supply?.currentStock ?? null,
        minThreshold: supply?.minThreshold ?? null,
        avgDailySales: avgDailySales !== null ? Math.round(avgDailySales * 100) / 100 : null,
        daysRemaining,
      };
    }),
  );

  return results;
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

    await sincronizarAlertaTrasCambioUmbral(tx, itemId, Number(updatedSupply.currentStock), Number(minThreshold));

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
