import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import prisma from '../../shared/db/prisma.js';
import { AUTH_CONFIG } from './auth.constants.js';

const hashearToken = (rawToken) =>
  crypto.createHash('sha256').update(rawToken).digest('hex');

const generarAccessToken = (usuario, roleName) => {
  const jti = crypto.randomUUID();
  return jwt.sign(
    { sub: usuario.id.toString(), email: usuario.email, rol: roleName, jti },
    process.env.JWT_SECRET,
    { expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRES_IN }
  );
};

const crearRefreshToken = async (adminUserId) => {
  const rawToken = crypto.randomBytes(AUTH_CONFIG.REFRESH_TOKEN_BYTES).toString('base64url');
  const tokenHash = hashearToken(rawToken);
  const jti = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_MS);

  await prisma.refreshToken.create({
    data: { userId: adminUserId, tokenHash, jti, expiresAt },
  });

  return { rawToken, expiresAt };
};

export const emitirPar = async (usuario, roleName) => {
  const accessToken = generarAccessToken(usuario, roleName);
  const refresh = await crearRefreshToken(usuario.id);
  return { accessToken, refreshToken: refresh.rawToken, refreshExpiresAt: refresh.expiresAt };
};

export const buscarRefreshPorRaw = (rawToken) =>
  prisma.refreshToken.findUnique({ where: { tokenHash: hashearToken(rawToken) } });

export const marcarRefreshRotado = (id) =>
  prisma.refreshToken.update({
    where: { id },
    data: { rotatedAt: new Date(), lastUsedAt: new Date() },
  });

export const revocarRefreshsActivosDelUsuario = (userId) =>
  prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null, rotatedAt: null },
    data: { revokedAt: new Date() },
  });

export const revocarRefreshPorRaw = async (rawToken) => {
  if (!rawToken) return;
  const tokenHash = hashearToken(rawToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

export const revocarAccessJti = (jti, expiresAt) =>
  prisma.revokedToken.upsert({
    where: { jti },
    create: { jti, expiresAt },
    update: {},
  });

export const estaTokenRevocado = async (jti) => {
  const token = await prisma.revokedToken.findUnique({
    where: { jti },
    select: { id: true },
  });
  return !!token;
};

export const limpiarTokensExpirados = async () => {
  const ahora = new Date();
  const [revoked, refresh] = await Promise.all([
    prisma.revokedToken.deleteMany({ where: { expiresAt: { lt: ahora } } }),
    prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: ahora } } }),
  ]);
  return revoked.count + refresh.count;
};
