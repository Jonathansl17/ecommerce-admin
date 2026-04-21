export const PASSWORD_RECOVERY_MESSAGES = {
  REQUEST_PROCESSED: 'Si el correo está registrado, recibirás un enlace de recuperación',
  INVALID_TOKEN: 'El enlace de recuperación no es válido o ya expiró',
  PASSWORD_RESET: 'Tu contraseña ha sido restablecida correctamente',
};

export const PASSWORD_RECOVERY_CONFIG = {
  TOKEN_TTL_MINUTES: 30,
  RESET_PATH: '/reset-password',
};
