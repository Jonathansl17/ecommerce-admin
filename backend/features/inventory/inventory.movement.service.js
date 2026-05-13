import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { sendLowStockAlert } from '../../shared/services/email.service.js';

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

      if (newStock > Number(updatedSupply.minThreshold)) {
        await tx.supplyAlert.updateMany({ where: { supplyId: itemId, active: true }, data: { active: false } });
      }

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
