import prisma from '../../shared/db/prisma.js';
import { PRODUCTS_MESSAGES, PRODUCTS_CONFIG } from './products.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const incluirSupply = {
  supply: true,
};

export const getAll = async () => {
  return prisma.item.findMany({
    include: incluirSupply,
  });
};

export const getById = async (id) => {
  const item = await prisma.item.findUnique({
    where: { id: BigInt(id) },
    include: incluirSupply,
  });

  if (!item) {
    throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }

  return item;
};

export const create = async ({ name, itemType, status }) => {
  try {
    return await prisma.item.create({
      data: {
        name,
        itemType: itemType ?? PRODUCTS_CONFIG.TIPO_POR_DEFECTO,
        status: status ?? PRODUCTS_CONFIG.ESTADO_POR_DEFECTO,
      },
      include: incluirSupply,
    });
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  const { name, itemType, status } = data;

  try {
    return await prisma.item.update({
      where: { id: BigInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(itemType !== undefined && { itemType }),
        ...(status !== undefined && { status }),
      },
      include: incluirSupply,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    }
    throw error;
  }
};

export const remove = async (id) => {
  try {
    return await prisma.item.delete({
      where: { id: BigInt(id) },
      include: incluirSupply,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw crearError(PRODUCTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    }
    throw error;
  }
};
