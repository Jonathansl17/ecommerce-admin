import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG, MOVEMENT_TYPES } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { procesarAlertaStockBajo, limpiarAlertaStockBajo } from '../../shared/services/supplyAlert.service.js';

export const createEntry = async (supplyId, { quantity, date }, adminId) => {
  const itemId = BigInt(supplyId);
  const entryDate = date ? new Date(date) : new Date();

  return prisma.$transaction(async (tx) => {
    const supply = await tx.supply.findUnique({
      where: { itemId },
      include: { item: true },
    });

    if (!supply || supply.item.itemType !== INVENTORY_CONFIG.ITEM_TYPE) {
      throw crearError(INVENTORY_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    }

    const previousStock = supply.currentStock;
    const newStock = Number(previousStock) + quantity;

    const updatedSupply = await tx.supply.update({
      where: { itemId },
      data: { currentStock: newStock },
      include: { item: true },
    });

    await tx.inventoryMovement.create({
      data: {
        supplyId: itemId,
        adminId: BigInt(adminId),
        type: MOVEMENT_TYPES.ENTRY,
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
  const itemEntries = items.map(({ supplyId, quantity }) => ({ itemId: BigInt(supplyId), quantity }));

  return prisma.$transaction(async (tx) => {
    const results = [];

    for (const { itemId, quantity } of itemEntries) {
      const supply = await tx.supply.findUnique({
        where: { itemId },
        include: { item: true },
      });

      if (!supply || supply.item.itemType !== INVENTORY_CONFIG.ITEM_TYPE) {
        throw crearError(INVENTORY_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
      }

      const previousStock = supply.currentStock;
      const newStock = Number(previousStock) + quantity;

      const updatedSupply = await tx.supply.update({
        where: { itemId },
        data: { currentStock: newStock },
        include: { item: true },
      });

      await tx.inventoryMovement.create({
        data: { supplyId: itemId, adminId: adminBigId, type: MOVEMENT_TYPES.ENTRY, quantity, previousStock, newStock, createdAt: entryDate },
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

  const entryDate = date ? new Date(date) : new Date();
  const adminBigId = BigInt(adminId);
  const itemEntries = items.map(({ supplyId, quantity }) => ({ itemId: BigInt(supplyId), quantity }));

  // Serializable isolation ensures concurrent consumption requests on the same
  // supply fail with a serialization error (Prisma P2034) rather than silently
  // driving stock negative.
  return prisma.$transaction(async (tx) => {
    const updatedSupplies = [];

    for (const { itemId, quantity } of itemEntries) {
      const supply = await tx.supply.findUnique({
        where: { itemId },
        include: { item: true },
      });

      if (!supply || supply.item.itemType !== INVENTORY_CONFIG.ITEM_TYPE) {
        throw crearError(INVENTORY_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
      }

      const previousStock = supply.currentStock;
      const newStock = Number(previousStock) - quantity;

      if (newStock < 0) {
        throw crearError(INVENTORY_MESSAGES.STOCK_INSUFICIENTE, HTTP_STATUS.CONFLICT);
      }

      const updatedSupply = await tx.supply.update({
        where: { itemId },
        data: { currentStock: newStock },
        include: { item: true },
      });

      await tx.inventoryMovement.create({
        data: {
          supplyId: itemId,
          adminId: adminBigId,
          type: MOVEMENT_TYPES.CONSUMPTION,
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
  }, { isolationLevel: 'Serializable' });
};
