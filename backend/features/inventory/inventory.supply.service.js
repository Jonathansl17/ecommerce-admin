import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import {
  sincronizarAlertaTrasCambioUmbral,
  calcAvgDailyConsumption,
} from '../../shared/services/supplyAlert.service.js';

const { AVG_ROUNDING_FACTOR } = INVENTORY_CONFIG;

function roundAvg(value) {
  return Math.round(value * AVG_ROUNDING_FACTOR) / AVG_ROUNDING_FACTOR;
}

function calcDaysRemaining(currentStock, avgDailySales) {
  if (avgDailySales <= 0) return null;
  return Math.floor(Number(currentStock) / avgDailySales);
}

async function buildStockAlertMetrics(itemId, currentStock) {
  const avgDailySales = await calcAvgDailyConsumption(prisma, itemId);
  return {
    avgDailySales: roundAvg(avgDailySales),
    daysRemaining: calcDaysRemaining(currentStock, avgDailySales),
  };
}

function serializeSupply(item, metrics = {}) {
  const { supply } = item;
  return {
    id: item.id.toString(),
    name: item.name,
    status: item.status,
    unitOfMeasure: supply?.unitOfMeasure ?? null,
    currentStock: supply?.currentStock ?? null,
    minThreshold: supply?.minThreshold ?? null,
    avgDailySales: metrics.avgDailySales ?? null,
    daysRemaining: metrics.daysRemaining ?? null,
  };
}

function hasActiveAlert(item) {
  return (item.supply?.alerts?.length ?? 0) > 0;
}

export const getAll = async () => {
  const items = await prisma.item.findMany({
    where: { itemType: INVENTORY_CONFIG.ITEM_TYPE },
    include: { supply: { include: { alerts: { where: { active: true }, take: 1 } } } },
    orderBy: { name: 'asc' },
  });

  return Promise.all(
    items.map(async (item) => {
      if (!hasActiveAlert(item) || !item.supply) return serializeSupply(item);
      const metrics = await buildStockAlertMetrics(item.id, item.supply.currentStock);
      return serializeSupply(item, metrics);
    }),
  );
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
