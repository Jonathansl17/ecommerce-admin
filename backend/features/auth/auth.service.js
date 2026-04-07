import bcrypt from 'bcrypt';
import prisma from '../../shared/db/prisma.js';
import { AUTH_CONFIG, AUTH_MESSAGES } from './auth.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const seleccionarCamposPublicos = (adminUser) => ({
  id: adminUser.id.toString(),
  fullName: adminUser.fullName,
  email: adminUser.email,
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
