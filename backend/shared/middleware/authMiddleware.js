import jwt from 'jsonwebtoken';
import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { estaTokenRevocado } from '../../features/auth/auth.tokens.service.js';
import { COOKIE_NAMES } from '../../features/auth/auth.constants.js';

const AUTH_ERRORS = {
  TOKEN_MISSING: 'Token de autenticación requerido',
  TOKEN_INVALID: 'Token de autenticación inválido o expirado',
  TOKEN_REVOKED: 'El token ha sido revocado',
  ACCESS_DENIED: 'No tienes permisos para acceder a este recurso',
};

export const requireAuth = async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAMES.ACCESS];

  if (!token) {
    return next(crearError(AUTH_ERRORS.TOKEN_MISSING, HTTP_STATUS.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.jti) {
      return next(crearError(AUTH_ERRORS.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED));
    }

    if (await estaTokenRevocado(payload.jti)) {
      return next(crearError(AUTH_ERRORS.TOKEN_REVOKED, HTTP_STATUS.UNAUTHORIZED));
    }

    req.user = { id: payload.sub, email: payload.email, rol: payload.rol, jti: payload.jti, exp: payload.exp };
    next();
  } catch {
    next(crearError(AUTH_ERRORS.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED));
  }
};

export const requireRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.rol)) {
    return next(crearError(AUTH_ERRORS.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN));
  }
  next();
};
