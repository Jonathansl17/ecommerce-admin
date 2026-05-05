import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { PASSWORD_RECOVERY_CONFIG, PASSWORD_RECOVERY_MESSAGES } from './password-recovery.constants.js';
import { enviarCorreoRecuperacionPassword } from './password-recovery.email.service.js';

const normalizarEmail = (email) => email.toLowerCase().trim();

const generarTokenRecuperacion = () =>
  `${crypto.randomUUID()}.${crypto.randomBytes(32).toString('hex')}`;

const hashearTokenRecuperacion = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const obtenerFechaExpiracion = () =>
  new Date(Date.now() + PASSWORD_RECOVERY_CONFIG.TOKEN_TTL_MINUTES * 60 * 1000);

const construirUrlRecuperacion = (token) => {
  const recoveryUrl =
    process.env.PASSWORD_RESET_URL ||
    `${process.env.FRONTEND_URL || 'http://localhost:4000'}${PASSWORD_RECOVERY_CONFIG.RESET_PATH}`;

  const url = new URL(recoveryUrl);
  url.searchParams.set('token', token);
  return url.toString();
};

const obtenerRegistroRecuperacionValido = (tokenHash) =>
  prisma.adminRecoveryToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      adminUserId: true,
      adminUser: {
        select: {
          accountStatus: true,
        },
      },
    },
  });

export const solicitarRecuperacionPassword = async ({ email, saltRounds: _unused }) => {
  const emailNormalizado = normalizarEmail(email);
  const usuario = await prisma.adminUser.findUnique({
    where: { email: emailNormalizado },
    select: {
      id: true,
      email: true,
      fullName: true,
      accountStatus: true,
    },
  });

  if (!usuario || usuario.accountStatus !== 'active') {
    return { message: PASSWORD_RECOVERY_MESSAGES.REQUEST_PROCESSED };
  }

  const token = generarTokenRecuperacion();
  const tokenHash = hashearTokenRecuperacion(token);
  const expiresAt = obtenerFechaExpiracion();
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.adminRecoveryToken.updateMany({
      where: {
        adminUserId: usuario.id,
        usedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    });

    await tx.adminRecoveryToken.create({
      data: {
        adminUserId: usuario.id,
        tokenHash,
        expiresAt,
      },
    });
  });

  await enviarCorreoRecuperacionPassword({
    email: usuario.email,
    fullName: usuario.fullName,
    recoveryUrl: construirUrlRecuperacion(token),
    expiresAt,
  });

  return { message: PASSWORD_RECOVERY_MESSAGES.REQUEST_PROCESSED };
};

export const validarTokenRecuperacionPassword = async (token) => {
  const tokenHash = hashearTokenRecuperacion(token);
  const recoveryToken = await obtenerRegistroRecuperacionValido(tokenHash);

  if (!recoveryToken || recoveryToken.adminUser.accountStatus !== 'active') {
    throw crearError(PASSWORD_RECOVERY_MESSAGES.INVALID_TOKEN, HTTP_STATUS.BAD_REQUEST);
  }
};

export const restablecerPassword = async ({ token, password, saltRounds }) => {
  const tokenHash = hashearTokenRecuperacion(token);
  const recoveryToken = await obtenerRegistroRecuperacionValido(tokenHash);

  if (!recoveryToken || recoveryToken.adminUser.accountStatus !== 'active') {
    throw crearError(PASSWORD_RECOVERY_MESSAGES.INVALID_TOKEN, HTTP_STATUS.BAD_REQUEST);
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.adminUser.update({
      where: { id: recoveryToken.adminUserId },
      data: { passwordHash },
    });

    await tx.adminRecoveryToken.update({
      where: { id: recoveryToken.id },
      data: { usedAt: now },
    });
  });

  return { message: PASSWORD_RECOVERY_MESSAGES.PASSWORD_RESET };
};
