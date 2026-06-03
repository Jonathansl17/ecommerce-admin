/**
 * Alert type values stored in SupplyAlert.type.
 * Shared between supplyAlert.service.js and email.service.js.
 */
export const SUPPLY_ALERT_TYPES = {
  OUT_OF_STOCK: 'out_of_stock',
  LOW_STOCK: 'low_stock',
};

/**
 * InventoryMovement type values used when querying consumption history.
 */
export const INVENTORY_MOVEMENT_TYPES = {
  CONSUMPTION: 'consumption',
};

/**
 * Window (in days) used to calculate average daily consumption.
 */
export const SUPPLY_ALERT_CONFIG = {
  AVG_DAILY_WINDOW: 30,
};
