import bcrypt from 'bcrypt';
import prisma from '../../shared/db/prisma.js';
import { CLIENTS_MESSAGES, CLIENTS_CONFIG } from './clients.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const parseId = (id) => {
  if (!/^\d+$/.test(String(id))) {
    throw crearError(CLIENTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }
  return BigInt(id);
};

const seleccionarCamposPublicos = {
  id: true,
  fullName: true,
  email: true,
  accountStatus: true,
  createdAt: true,
  updatedAt: true,
};

const serializarUsuario = (u) => ({ ...u, id: u.id.toString() });

export const getAll = async ({ page = 1, limit = CLIENTS_CONFIG.DEFAULT_PAGE_SIZE, search } = {}) => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(Math.max(1, Number(limit)), CLIENTS_CONFIG.MAX_PAGE_SIZE);
  const where = search
    ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : undefined;
  const [total, adminUsers] = await Promise.all([
    prisma.adminUser.count({ where }),
    prisma.adminUser.findMany({
      where,
      select: seleccionarCamposPublicos,
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
  ]);
  return { data: adminUsers.map(serializarUsuario), pagination: { page: pageNum, limit: limitNum, total } };
};

export const changeStatus = async (id, accountStatus) => {
  if (!['active', 'inactive'].includes(accountStatus)) {
    throw crearError('Estado inválido', HTTP_STATUS.BAD_REQUEST);
  }

  try {
    const user = await prisma.adminUser.update({
      where: { id: parseId(id) },
      data: { accountStatus },
      select: seleccionarCamposPublicos,
    });
    return serializarUsuario(user);
  } catch (error) {
    if (error.code === 'P2025') {
      throw crearError(CLIENTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    }
    throw error;
  }
};

export const getById = async (id) => {
  const adminUser = await prisma.adminUser.findUnique({
    where: { id: parseId(id) },
    select: seleccionarCamposPublicos,
  });

  if (!adminUser) {
    throw crearError(CLIENTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
  }

  return serializarUsuario(adminUser);
};

export const create = async ({ fullName, email, password }) => {
  const passwordHash = await bcrypt.hash(password, CLIENTS_CONFIG.SALT_ROUNDS);

  try {
    const user = await prisma.adminUser.create({
      data: {
        fullName,
        email,
        passwordHash,
        accountStatus: CLIENTS_CONFIG.ESTADO_CUENTA_INICIAL,
      },
      select: seleccionarCamposPublicos,
    });
    return serializarUsuario(user);
  } catch (error) {
    if (error.code === 'P2002') {
      throw crearError(CLIENTS_MESSAGES.CORREO_YA_REGISTRADO, HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};

export const update = async (id, data) => {
  const { fullName, email, password, accountStatus } = data;
  const datosActualizados = {};

  if (fullName !== undefined) datosActualizados.fullName = fullName;
  if (email !== undefined) datosActualizados.email = email;
  if (accountStatus !== undefined) datosActualizados.accountStatus = accountStatus;
  if (password) {
    datosActualizados.passwordHash = await bcrypt.hash(password, CLIENTS_CONFIG.SALT_ROUNDS);
  }

  try {
    const user = await prisma.adminUser.update({
      where: { id: parseId(id) },
      data: datosActualizados,
      select: seleccionarCamposPublicos,
    });
    return serializarUsuario(user);
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
    const user = await prisma.adminUser.delete({
      where: { id: parseId(id) },
      select: seleccionarCamposPublicos,
    });
    return serializarUsuario(user);
  } catch (error) {
    if (error.code === 'P2025') {
      throw crearError(CLIENTS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);
    }
    throw error;
  }
};
