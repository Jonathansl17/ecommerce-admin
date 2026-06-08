import bcrypt from 'bcrypt';
import prisma from '../../shared/db/prisma.js';
import { CLIENTS_MESSAGES, CLIENTS_CONFIG } from './clients.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const seleccionarCamposPublicos = {
  id: true,
  fullName: true,
  email: true,
  accountStatus: true,
  createdAt: true,
  updatedAt: true,
};

export const getAll = async () => {
  return prisma.adminUser.findMany({
    select: seleccionarCamposPublicos,
  });
};

export const getById = async (id) => {
  const adminUser = await prisma.adminUser.findUnique({
    where: { id: BigInt(id) },
    select: seleccionarCamposPublicos,
  });

  if (!adminUser) {
    throw crearError(CLIENTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }

  return adminUser;
};

export const create = async ({ fullName, email, password, accountStatus }) => {
  const passwordHash = await bcrypt.hash(password, CLIENTS_CONFIG.SALT_ROUNDS);

  try {
    return await prisma.adminUser.create({
      data: {
        fullName,
        email,
        passwordHash,
        accountStatus: accountStatus ?? CLIENTS_CONFIG.ESTADO_CUENTA_INICIAL,
      },
      select: seleccionarCamposPublicos,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw crearError(CLIENTS_MESSAGES.CORREO_YA_REGISTRADO, HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};

export const update = async (id, data) => {
  const { password, ...camposRestantes } = data;
  const datosActualizados = { ...camposRestantes };

  if (password) {
    datosActualizados.passwordHash = await bcrypt.hash(password, CLIENTS_CONFIG.SALT_ROUNDS);
  }

  try {
    return await prisma.adminUser.update({
      where: { id: BigInt(id) },
      data: datosActualizados,
      select: seleccionarCamposPublicos,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw crearError(CLIENTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    }
    if (error.code === 'P2002') {
      throw crearError(CLIENTS_MESSAGES.CORREO_YA_REGISTRADO, HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};

export const remove = async (id) => {
  try {
    return await prisma.adminUser.delete({
      where: { id: BigInt(id) },
      select: seleccionarCamposPublicos,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw crearError(CLIENTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    }
    throw error;
  }
};
