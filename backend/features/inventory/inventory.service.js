import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { sendLowStockAlert } from '../../shared/services/email.service.js';

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

export const getMovements = async (supplyId, { type, dateFrom, dateTo }) => {
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

  const movements = await prisma.inventoryMovement.findMany({
    where,
    include: { admin: { include: { adminUser: true } } },
    orderBy: { createdAt: 'desc' },
  });

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
  };
};

export const createConsumption = async (items, { reference, date }, adminId) => {
  // Detect duplicate supplyIds in the same operation
  const supplyIds = items.map((i) => i.supplyId);
  if (new Set(supplyIds).size !== supplyIds.length) {
    throw crearError(INVENTORY_MESSAGES.INSUMO_DUPLICADO_EN_OPERACION, HTTP_STATUS.CONFLICT);
  }

  // Fetch all supplies and validate stock
  const supplyData = await Promise.all(
    items.map(async ({ supplyId, quantity }) => {
      const itemId = BigInt(supplyId);
      const supply = await prisma.supply.findUnique({
        where: { itemId },
        include: { item: true },
      });

      if (!supply || supply.item.itemType !== INVENTORY_CONFIG.ITEM_TYPE) {
        throw crearError(INVENTORY_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
      }

      if (Number(supply.currentStock) < quantity) {
        throw crearError(INVENTORY_MESSAGES.STOCK_INSUFICIENTE, HTTP_STATUS.CONFLICT);
      }

      return { supply, itemId, quantity };
    })
  );

  const entryDate = date ? new Date(date) : new Date();
  const adminBigId = BigInt(adminId);

  return prisma.$transaction(async (tx) => {
    const updatedSupplies = [];

    for (const { supply, itemId, quantity } of supplyData) {
      const previousStock = supply.currentStock;
      const newStock = Number(previousStock) - quantity;

      const updatedSupply = await tx.supply.update({
        where: { itemId },
        data: { currentStock: newStock },
        include: { item: true },
      });

      await tx.inventoryMovement.create({
        data: {
          supplyId: itemId,
          adminId: adminBigId,
          type: 'consumption',
          quantity,
          previousStock,
          newStock,
          reference: reference || null,
          createdAt: entryDate,
        },
      });

      // Activate alert if stock reaches or falls below minThreshold
      const minThreshold = Number(updatedSupply.minThreshold);
      const shouldAlert = newStock <= 0 || (minThreshold > 0 && newStock <= minThreshold);

      if (shouldAlert) {
        const alertType = newStock <= 0 ? 'out_of_stock' : 'low_stock';
        const existingAlert = await tx.supplyAlert.findFirst({
          where: { supplyId: itemId },
        });

        if (existingAlert) {
          await tx.supplyAlert.update({
            where: { id: existingAlert.id },
            data: { type: alertType, threshold: updatedSupply.minThreshold, active: true },
          });
        } else {
          await tx.supplyAlert.create({
            data: {
              supplyId: itemId,
              type: alertType,
              threshold: updatedSupply.minThreshold,
              active: true,
            },
          });
        }

        // Fire-and-forget email notification
        sendLowStockAlert({
          supplyName: updatedSupply.item.name,
          currentStock: newStock,
          minThreshold: Number(updatedSupply.minThreshold),
          unitOfMeasure: updatedSupply.unitOfMeasure,
          alertType,
        }).catch((err) => console.error('Error al enviar notificación de alerta:', err));
      }

      updatedSupplies.push({
        id: updatedSupply.item.id.toString(),
        name: updatedSupply.item.name,
        status: updatedSupply.item.status,
        unitOfMeasure: updatedSupply.unitOfMeasure,
        currentStock: updatedSupply.currentStock,
        minThreshold: updatedSupply.minThreshold,
      });
    }

    return updatedSupplies;
  });
};

export const createEntry = async (supplyId, { quantity, date }, adminId) => {
  const itemId = BigInt(supplyId);

  const supply = await prisma.supply.findUnique({
    where: { itemId },
    include: { item: true },
  });

  if (!supply || supply.item.itemType !== INVENTORY_CONFIG.ITEM_TYPE) {
    throw crearError(INVENTORY_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }

  const previousStock = supply.currentStock;
  const newStock = Number(previousStock) + quantity;
  const entryDate = date ? new Date(date) : new Date();

  return prisma.$transaction(async (tx) => {
    const updatedSupply = await tx.supply.update({
      where: { itemId },
      data: { currentStock: newStock },
      include: { item: true },
    });

    await tx.inventoryMovement.create({
      data: {
        supplyId: itemId,
        adminId: BigInt(adminId),
        type: 'entry',
        quantity,
        previousStock,
        newStock,
        createdAt: entryDate,
      },
    });

    // Deactivate alert if stock is restored above threshold
    if (newStock > Number(updatedSupply.minThreshold)) {
      await tx.supplyAlert.updateMany({
        where: { supplyId: itemId, active: true },
        data: { active: false },
      });
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
