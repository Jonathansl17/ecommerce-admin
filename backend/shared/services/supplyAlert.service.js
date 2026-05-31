import { sendLowStockAlert } from './email.service.js';
import { SUPPLY_ALERT_TYPES, INVENTORY_MOVEMENT_TYPES } from './supplyAlert.constants.js';

const DAILY_SALES_WINDOW_DAYS = 30;

export async function calcAvgDailyConsumption(db, supplyId) {
  const since = new Date();
  since.setDate(since.getDate() - DAILY_SALES_WINDOW_DAYS);
  since.setHours(0, 0, 0, 0);

  const movements = await db.inventoryMovement.findMany({
    where: {
      supplyId,
      type: INVENTORY_MOVEMENT_TYPES.CONSUMPTION,
      createdAt: { gte: since },
    },
    select: { quantity: true },
  });

  if (movements.length === 0) return 0;

  const totalConsumed = movements.reduce((sum, m) => sum + Number(m.quantity), 0);
  return totalConsumed / DAILY_SALES_WINDOW_DAYS;
}

export async function procesarAlertaStockBajo(tx, { itemId, newStock, updatedSupply }) {
  const minThreshold = Number(updatedSupply.minThreshold);
  const shouldAlert = newStock <= 0 || (minThreshold > 0 && newStock <= minThreshold);

  if (!shouldAlert) {
    await tx.supplyAlert.updateMany({
      where: { supplyId: itemId, active: true },
      data: { active: false },
    });
    return;
  }

  const alertType =
    newStock <= 0 ? SUPPLY_ALERT_TYPES.OUT_OF_STOCK : SUPPLY_ALERT_TYPES.LOW_STOCK;

  const existingAlert = await tx.supplyAlert.findFirst({
    where: { supplyId: itemId },
  });

  const wasAlreadyActive = existingAlert?.active === true;

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

  if (!wasAlreadyActive) {
    const avgDailySales = await calcAvgDailyConsumption(tx, itemId);
    const diasRestantes =
      avgDailySales > 0 ? Math.floor(newStock / avgDailySales) : null;

    sendLowStockAlert({
      supplyName: updatedSupply.item.name,
      currentStock: newStock,
      minThreshold,
      unitOfMeasure: updatedSupply.unitOfMeasure,
      alertType,
      avgDailySales,
      diasRestantes,
    }).catch((err) => console.error('[SupplyAlert] Error al enviar notificación de alerta:', err));
  }
}

export async function limpiarAlertaStockBajo(tx, supplyId, newStock, minThreshold) {
  if (newStock > minThreshold) {
    await tx.supplyAlert.updateMany({
      where: { supplyId, active: true },
      data: { active: false },
    });
  }
}

export async function sincronizarAlertaTrasCambioUmbral(tx, itemId, currentStock, minThreshold) {
  const shouldAlert = minThreshold > 0 && currentStock <= minThreshold;

  if (shouldAlert) {
    const alertType =
      currentStock <= 0 ? SUPPLY_ALERT_TYPES.OUT_OF_STOCK : SUPPLY_ALERT_TYPES.LOW_STOCK;
    const existing = await tx.supplyAlert.findFirst({ where: { supplyId: itemId } });
    if (existing) {
      await tx.supplyAlert.update({
        where: { id: existing.id },
        data: { type: alertType, threshold: minThreshold, active: true },
      });
    } else {
      await tx.supplyAlert.create({
        data: { supplyId: itemId, type: alertType, threshold: minThreshold, active: true },
      });
    }
  } else {
    await tx.supplyAlert.updateMany({
      where: { supplyId: itemId, active: true },
      data: { active: false },
    });
  }
}
