import bcrypt from 'bcrypt';
import prisma from '../../shared/db/prisma.js';
import { AUTH_CONFIG, AUTH_MESSAGES } from './auth.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import {
  emitirPar,
  buscarRefreshPorRaw,
  marcarRefreshRotado,
  revocarRefreshsActivosDelUsuario,
  revocarRefreshPorRaw,
  revocarAccessJti,
} from './auth.tokens.service.js';

const normalizarEmail = (email) => email.toLowerCase().trim();

const seleccionarCamposPublicos = (adminUser) => ({
  id: adminUser.id.toString(),
  fullName: adminUser.fullName,
  email: adminUser.email,
});

const obtenerUsuarioConRol = (id) =>
  prisma.adminUser.findUnique({
    where: { id: typeof id === 'bigint' ? id : BigInt(id) },
    select: {
      id: true,
      email: true,
      fullName: true,
      accountStatus: true,
      admin: { select: { role: { select: { name: true } } } },
    },
  });

const armarUsuarioConRol = (usuario, roleName) => ({
  id: usuario.id.toString(),
  email: usuario.email,
  fullName: usuario.fullName,
  rol: roleName,
});

export const register = async ({ fullName, email, password }) => {
  const passwordHash = await bcrypt.hash(password, AUTH_CONFIG.SALT_ROUNDS);

  try {
    const adminUser = await prisma.$transaction(async (tx) => {
      const rol = await tx.role.findUnique({
        where: { name: AUTH_CONFIG.ROL_POR_DEFECTO },
      });

      if (!rol) {
        throw crearError(AUTH_MESSAGES.ROL_NO_CONFIGURADO, HTTP_STATUS.INTERNAL_ERROR);
      }

      const nuevoAdminUser = await tx.adminUser.create({
        data: {
          fullName,
          email,
          passwordHash,
          accountStatus: AUTH_CONFIG.ESTADO_CUENTA_INICIAL,
        },
      });

      await tx.admin.create({
        data: {
          adminUserId: nuevoAdminUser.id,
          roleId: rol.id,
        },
      });

      return nuevoAdminUser;
    });

    return seleccionarCamposPublicos(adminUser);
  } catch (error) {
    if (error.code === 'P2002') {
      throw crearError(AUTH_MESSAGES.CORREO_YA_REGISTRADO, HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};

export const iniciarSesion = async ({ email, password }) => {
  const emailNormalizado = normalizarEmail(email);

  const usuario = await prisma.adminUser.findUnique({
    where: { email: emailNormalizado },
    select: {
      id: true,
      email: true,
      fullName: true,
      passwordHash: true,
      accountStatus: true,
      admin: {
        select: {
          role: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!usuario) {
    throw crearError(AUTH_MESSAGES.CREDENCIALES_INVALIDAS, HTTP_STATUS.UNAUTHORIZED);
  }

  if (usuario.accountStatus !== 'active') {
    throw crearError(AUTH_MESSAGES.CUENTA_INACTIVA, HTTP_STATUS.UNAUTHORIZED);
  }

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) {
    throw crearError(AUTH_MESSAGES.CREDENCIALES_INVALIDAS, HTTP_STATUS.UNAUTHORIZED);
  }

  const roleName = usuario.admin?.role?.name;
  if (!roleName) {
    throw crearError(AUTH_MESSAGES.ROL_NO_CONFIGURADO, HTTP_STATUS.INTERNAL_ERROR);
  }

  const par = await emitirPar(usuario, roleName);

  return { ...par, usuario: armarUsuarioConRol(usuario, roleName) };
};

export const rotarRefresh = async (rawRefresh) => {
  if (!rawRefresh) {
    throw crearError(AUTH_MESSAGES.SESION_EXPIRADA, HTTP_STATUS.UNAUTHORIZED);
  }

  const registro = await buscarRefreshPorRaw(rawRefresh);
  if (!registro || registro.revokedAt || registro.rotatedAt || registro.expiresAt < new Date()) {
    if (registro && !registro.revokedAt) {
      await revocarRefreshsActivosDelUsuario(registro.userId);
    }
    throw crearError(AUTH_MESSAGES.SESION_EXPIRADA, HTTP_STATUS.UNAUTHORIZED);
  }

  const usuario = await obtenerUsuarioConRol(registro.userId);
  if (!usuario || usuario.accountStatus !== 'active') {
    throw crearError(AUTH_MESSAGES.SESION_EXPIRADA, HTTP_STATUS.UNAUTHORIZED);
  }

  const roleName = usuario.admin?.role?.name;
  if (!roleName) {
    throw crearError(AUTH_MESSAGES.ROL_NO_CONFIGURADO, HTTP_STATUS.INTERNAL_ERROR);
  }

  const par = await emitirPar(usuario, roleName);
  await marcarRefreshRotado(registro.id);

  return { ...par, usuario: armarUsuarioConRol(usuario, roleName) };
};

export const revocarSesion = async ({ rawRefresh, accessJti, accessExp }) => {
  await Promise.all([
    revocarRefreshPorRaw(rawRefresh),
    accessJti ? revocarAccessJti(accessJti, new Date(accessExp * 1000)) : Promise.resolve(),
  ]);
};

export const obtenerUsuarioActivo = async (id) => {
  const usuario = await obtenerUsuarioConRol(id);
  if (!usuario || usuario.accountStatus !== 'active') return null;
  const roleName = usuario.admin?.role?.name;
  if (!roleName) return null;
  return armarUsuarioConRol(usuario, roleName);
};
