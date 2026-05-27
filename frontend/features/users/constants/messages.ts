export const USERS_MESSAGES = {
  page: {
    title: 'Usuarios administradores',
    subtitle: 'Gestiona las cuentas de acceso al panel de administración.',
  },
  search: {
    placeholder: 'Buscar por nombre o correo...',
  },
  table: {
    colName: 'Nombre',
    colEmail: 'Correo electrónico',
    colStatus: 'Estado',
    colCreated: 'Registro',
    colActions: 'Acciones',
    statusActive: 'Activo',
    statusInactive: 'Inactivo',
    statusDeleted: 'Eliminado',
    activateButton: 'Activar',
    deactivateButton: 'Desactivar',
    emptyMessage: 'No se encontraron usuarios.',
  },
  errors: {
    fetchError: 'No se pudo cargar la lista de usuarios.',
    statusError: 'No se pudo cambiar el estado del usuario.',
  },
} as const;
