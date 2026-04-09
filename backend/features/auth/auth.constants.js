export const AUTH_MESSAGES = {
  REGISTRO_EXITOSO: 'Registro exitoso',
  CORREO_YA_REGISTRADO: 'Este correo electrónico ya está registrado',
  ROL_NO_CONFIGURADO: 'El rol por defecto no está configurado',
  ERROR_AL_REGISTRAR: 'Error al registrar el usuario',
  INICIO_SESION_EXITOSO: 'Inicio de sesión exitoso',
  CREDENCIALES_INVALIDAS: 'Correo electrónico o contraseña incorrectos',
  CUENTA_INACTIVA: 'Tu cuenta está inactiva. Contacta al soporte.',
  SESION_CERRADA: 'Sesión cerrada exitosamente',
  TOKEN_REVOCADO: 'El token ha sido revocado',
};

export const AUTH_CONFIG = {
  SALT_ROUNDS: 10,
  ROL_POR_DEFECTO: 'administrador',
  ESTADO_CUENTA_INICIAL: 'active',
  JWT_EXPIRES_IN: '7d',
};

export const AUTH_VALIDATION = {
  NOMBRE_MIN: 1,
  NOMBRE_MAX: 100,
  CORREO_MAX: 150,
  CONTRASENA_MIN: 8,
};
