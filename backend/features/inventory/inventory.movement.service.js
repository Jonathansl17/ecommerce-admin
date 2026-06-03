import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG, MOVEMENT_TYPES } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { procesarAlertaStockBajo, limpiarAlertaStockBajo } from '../../shared/services/supplyAlert.service.js';

// --- Private helpers ---

const fetchAndValidateSupply = async (supplyId) => {
  const itemId = BigInt(supplyId);
  const supply = await prisma.supply.findUnique({
    where: { itemId },
    include: { item: true },
  });
  if (!supply || supply.item.itemType !== INVENTORY_CONFIG.ITEM_TYPE) {
    throw crearError(INVENTORY_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }
  return { supply, itemId };
};

const applyStockMovement = async (tx, { itemId, previousStock, newStock, adminBigId, type, quantity, reference = null, createdAt }) => {
  const updatedSupply = await tx.supply.update({
    where: { itemId },
    data: { currentStock: newStock },
    include: { item: true },
  });
  await tx.inventoryMovement.create({
    data: { supplyId: itemId, adminId: adminBigId, type, quantity, previousStock, newStock, reference, createdAt },
  });
  return updatedSupply;
};

const formatSupplyResponse = (updatedSupply) => ({
  id: updatedSupply.item.id.toString(),
  name: updatedSupply.item.name,
  status: updatedSupply.item.status,
  unitOfMeasure: updatedSupply.unitOfMeasure,
  currentStock: updatedSupply.currentStock,
  minThreshold: updatedSupply.minThreshold,
});

// --- Exports ---

export const createEntry = async (supplyId, { quantity, date }, adminId) => {
  const { supply, itemId } = await fetchAndValidateSupply(supplyId);
  const previousStock = supply.currentStock;
  const newStock = Number(previousStock) + quantity;
  const entryDate = date ? new Date(date) : new Date();

  return prisma.$transaction(async (tx) => {
    const updatedSupply = await applyStockMovement(tx, {
      itemId, previousStock, newStock,
      adminBigId: BigInt(adminId),
      type: MOVEMENT_TYPES.ENTRY,
      quantity,
      createdAt: entryDate,
    });
    await limpiarAlertaStockBajo(tx, itemId, newStock, Number(updatedSupply.minThreshold));
    return formatSupplyResponse(updatedSupply);
  });
};

export const createEntries = async (items, { date }, adminId) => {
  const entryDate = date ? new Date(date) : new Date();
  const adminBigId = BigInt(adminId);

  const supplyData = await Promise.all(
    items.map(async ({ supplyId, quantity }) => {
      const { supply, itemId } = await fetchAndValidateSupply(supplyId);
      return { supply, itemId, quantity };
    })
  );

  return prisma.$transaction(async (tx) => {
    const results = [];
    for (const { supply, itemId, quantity } of supplyData) {
      const previousStock = supply.currentStock;
      const newStock = Number(previousStock) + quantity;
      const updatedSupply = await applyStockMovement(tx, {
        itemId, previousStock, newStock, adminBigId,
        type: MOVEMENT_TYPES.ENTRY, quantity, createdAt: entryDate,
      });
      await limpiarAlertaStockBajo(tx, itemId, newStock, Number(updatedSupply.minThreshold));
      results.push(formatSupplyResponse(updatedSupply));
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
      const { supply, itemId } = await fetchAndValidateSupply(supplyId);
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
      const updatedSupply = await applyStockMovement(tx, {
        itemId, previousStock, newStock, adminBigId,
        type: MOVEMENT_TYPES.CONSUMPTION, quantity,
        reference: reference || null, createdAt: entryDate,
      });
      await procesarAlertaStockBajo(tx, { itemId, newStock, updatedSupply });
      updatedSupplies.push(formatSupplyResponse(updatedSupply));
    }
    return updatedSupplies;
  });
};
