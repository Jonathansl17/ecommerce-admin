import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { INVENTORY_MESSAGES, INVENTORY_CONFIG } from './inventory.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getAll = async () => {
  // placeholder — MT-3
};

export const create = async ({ name, unitOfMeasure, initialStock }) => {
  // placeholder — MT-2
};
