import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { procesarAlertaStockBajo, limpiarAlertaStockBajo } from '../../shared/services/supplyAlert.service.js';

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

    await limpiarAlertaStockBajo(tx, itemId, newStock, Number(updatedSupply.minThreshold));

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

export const createEntries = async (items, { date }, adminId) => {
  const entryDate = date ? new Date(date) : new Date();
  const adminBigId = BigInt(adminId);

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
      return { supply, itemId, quantity };
    })
  );

  return prisma.$transaction(async (tx) => {
    const results = [];
    for (const { supply, itemId, quantity } of supplyData) {
      const previousStock = supply.currentStock;
      const newStock = Number(previousStock) + quantity;

      const updatedSupply = await tx.supply.update({
        where: { itemId },
        data: { currentStock: newStock },
        include: { item: true },
      });

      await tx.inventoryMovement.create({
        data: { supplyId: itemId, adminId: adminBigId, type: 'entry', quantity, previousStock, newStock, createdAt: entryDate },
      });

      await limpiarAlertaStockBajo(tx, itemId, newStock, Number(updatedSupply.minThreshold));

      results.push({
        id: updatedSupply.item.id.toString(),
        name: updatedSupply.item.name,
        status: updatedSupply.item.status,
        unitOfMeasure: updatedSupply.unitOfMeasure,
        currentStock: updatedSupply.currentStock,
        minThreshold: updatedSupply.minThreshold,
      });
    }
    return results;
  });
};

export const createConsumption = async (items, { reference, date }, adminId) => {
  const supplyIds = items.map((i) => i.supplyId);
  if (new Set(supplyIds).size !== supplyIds.length) {
    throw crearError(INVENTORY_MESSAGES.INSUMO_DUPLICADO_EN_OPERACION, HTTP_STATUS.CONFLICT);
  }

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

      await procesarAlertaStockBajo(tx, { itemId, newStock, updatedSupply });

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
