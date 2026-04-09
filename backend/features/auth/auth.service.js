import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../shared/db/prisma.js';
import { AUTH_CONFIG, AUTH_MESSAGES } from './auth.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const normalizarEmail = (email) => email.toLowerCase().trim();

const seleccionarCamposPublicos = (adminUser) => ({
  id: adminUser.id.toString(),
  fullName: adminUser.fullName,
  email: adminUser.email,
});

const generarToken = (usuario, roleName) => {
  const jti = crypto.randomUUID();
  return jwt.sign(
    { sub: usuario.id.toString(), email: usuario.email, rol: roleName, jti },
    process.env.JWT_SECRET,
    { expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN }
  );
};

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
  const token = generarToken(usuario, roleName);

  return {
    token,
    usuario: {
      id: usuario.id.toString(),
      email: usuario.email,
      fullName: usuario.fullName,
      rol: roleName,
    },
  };
};

export const cerrarSesion = async (jti, expiresAt) => {
  await prisma.revokedToken.upsert({
    where: { jti },
    create: { jti, expiresAt },
    update: {},
  });
};

export const estaTokenRevocado = async (jti) => {
  const token = await prisma.revokedToken.findUnique({
    where: { jti },
    select: { id: true },
  });
  return !!token;
};

export const limpiarTokensExpirados = async () => {
  const resultado = await prisma.revokedToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return resultado.count;
};
