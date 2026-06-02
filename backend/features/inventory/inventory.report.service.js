import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG, PAGINATION_CONFIG } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getMovements = async (supplyId, { type, dateFrom, dateTo, page = PAGINATION_CONFIG.DEFAULT_PAGE, limit = PAGINATION_CONFIG.DEFAULT_LIMIT }) => {
  const itemId = BigInt(supplyId);

  const supply = await prisma.supply.findUnique({
    where: { itemId },
    include: { item: true },
  });

  if (!supply || supply.item.itemType !== INVENTORY_CONFIG.ITEM_TYPE) {
    throw crearError(INVENTORY_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }

  const where = { supplyId: itemId };
  if (type) where.type = type;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const skip = (page - 1) * limit;

  const [total, movements] = await Promise.all([
    prisma.inventoryMovement.count({ where }),
    prisma.inventoryMovement.findMany({
      where,
      include: { admin: { include: { adminUser: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return {
    supply: {
      id: supply.item.id.toString(),
      name: supply.item.name,
      status: supply.item.status,
      unitOfMeasure: supply.unitOfMeasure,
      currentStock: supply.currentStock,
      minThreshold: supply.minThreshold,
    },
    movements: movements.map((m) => ({
      id: m.id.toString(),
      type: m.type,
      quantity: Number(m.quantity),
      previousStock: Number(m.previousStock),
      newStock: Number(m.newStock),
      reference: m.reference,
      createdAt: m.createdAt.toISOString(),
      adminName: m.admin.adminUser.fullName,
    })),
    meta: {
      total,
      page,
      limit,
      hasMore: skip + movements.length < total,
    },
  };
};

export const getReport = async (dateFrom, dateTo) => {
  const startDate = new Date(dateFrom);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(dateTo);
  endDate.setHours(23, 59, 59, 999);

  const movements = await prisma.inventoryMovement.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      supply: { item: { itemType: INVENTORY_CONFIG.ITEM_TYPE } },
    },
    include: { supply: { include: { item: true } } },
    orderBy: { createdAt: 'asc' },
  });

  // Group totals per supply
  const supplyTotals = new Map();
  for (const m of movements) {
    const key = m.supplyId.toString();
    if (!supplyTotals.has(key)) {
      supplyTotals.set(key, { supply: m.supply, entradas: 0, consumo: 0 });
    }
    const row = supplyTotals.get(key);
    if (m.type === 'entry') row.entradas += Number(m.quantity);
    else row.consumo += Number(m.quantity);
  }

  // Calculate stock values per supply
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPeriodCurrent = endDate >= today;

  const supplies = await Promise.all(
    Array.from(supplyTotals.entries()).map(async ([supplyId, { supply, entradas, consumo }]) => {
      let stockFinal;
      if (isPeriodCurrent) {
        stockFinal = Number(supply.currentStock);
      } else {
        const movementsAfter = await prisma.inventoryMovement.findMany({
          where: { supplyId: BigInt(supplyId), createdAt: { gt: endDate } },
        });
        stockFinal = Number(supply.currentStock);
        for (const m of movementsAfter) {
          if (m.type === 'entry') stockFinal -= Number(m.quantity);
          else stockFinal += Number(m.quantity);
        }
      }

      return {
        id: supply.item.id.toString(),
        name: supply.item.name,
        unitOfMeasure: supply.unitOfMeasure,
        stockInicial: stockFinal - entradas + consumo,
        entradas,
        consumo,
        stockFinal,
      };
    })
  );

  // Build rendimiento from consumptions with reference
  const rendimientoMap = new Map();
  for (const m of movements) {
    if (m.type !== 'consumption' || !m.reference) continue;
    if (!rendimientoMap.has(m.reference)) rendimientoMap.set(m.reference, new Map());
    const itemMap = rendimientoMap.get(m.reference);
    const key = m.supply.item.name;
    if (!itemMap.has(key)) itemMap.set(key, { quantity: 0, unitOfMeasure: m.supply.unitOfMeasure });
    itemMap.get(key).quantity += Number(m.quantity);
  }

  const rendimiento = Array.from(rendimientoMap.entries()).map(([reference, itemMap]) => ({
    reference,
    items: Array.from(itemMap.entries()).map(([supplyName, data]) => ({
      supplyName,
      unitOfMeasure: data.unitOfMeasure,
      quantity: data.quantity,
    })),
  }));

  return {
    period: { from: dateFrom, to: dateTo },
    supplies: supplies.sort((a, b) => a.name.localeCompare(b.name)),
    rendimiento,
  };
};
