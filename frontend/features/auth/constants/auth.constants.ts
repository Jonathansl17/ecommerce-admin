export const AUTH_STRINGS = {
  register: {
    title: 'Crear cuenta administrativa',
    subtitle: 'Registra tus datos para acceder al panel de administración',
    fullNameLabel: 'Nombre completo',
    fullNamePlaceholder: 'Tu nombre completo',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'correo@ejemplo.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••',
    confirmPasswordLabel: 'Confirmar contraseña',
    confirmPasswordPlaceholder: '••••••••',
    submitButton: 'Registrarse',
    submittingButton: 'Registrando...',
    hasAccountText: '¿Ya tienes cuenta?',
    loginLink: 'Iniciar sesión',
    successTitle: 'Cuenta creada exitosamente',
    successMessage: 'Ya puedes iniciar sesión con tus credenciales',
    goToLogin: 'Ir al inicio de sesión',
  },
  login: {
    title: 'Panel Administrativo',
    subtitle: 'Inicia sesión para acceder al panel de administración',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'correo@ejemplo.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••',
    submitButton: 'Iniciar sesión',
    submittingButton: 'Ingresando...',
    noAccountText: '¿No tienes cuenta?',
    registerLink: 'Registrarse',
  },
  dashboard: {
    navTitle: 'Ecommerce Admin',
    logoutButton: 'Cerrar sesión',
    pageTitle: 'Panel de Administración',
    pageSubtitle:
      'Gestiona productos, pedidos y usuarios.',
    greeting: 'Hola,',
    adminBadgeLabel: 'Panel Administrativo',
  },
  validation: {
    fullNameRequired: 'El nombre completo es obligatorio',
    emailRequired: 'El correo electrónico es obligatorio',
    emailInvalid: 'El formato del correo electrónico no es válido',
    passwordRequired: 'La contraseña es obligatoria',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
    passwordPattern:
      'La contraseña debe incluir al menos una mayúscula, una minúscula y un número',
    confirmPasswordRequired: 'Debes confirmar la contraseña',
    passwordsMismatch: 'Las contraseñas no coinciden',
  },
  errors: {
    emailAlreadyExists: 'Este correo electrónico ya está registrado',
    unexpectedError: 'Ocurrió un error inesperado',
    connectionError: 'No se pudo conectar con el servidor',
    invalidCredentials: 'Correo electrónico o contraseña incorrectos',
    noAdminPermission:
      'No tienes permisos para acceder al panel de administración',
  },
} as const;

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const ADMIN_ROLE = 'administrador' as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const;
