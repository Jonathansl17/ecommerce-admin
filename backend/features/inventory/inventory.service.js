import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getAll = async () => {
  // placeholder — MT-3
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
