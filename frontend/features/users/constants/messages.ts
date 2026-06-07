export const USERS_MESSAGES = {
  page: {
    title: 'Usuarios administradores',
    subtitle: 'Gestiona las cuentas de acceso al panel de administración.',
    loading: 'Cargando usuarios...',
  },
  search: {
    fieldName: 'Nombre',
    fieldEmail: 'Correo',
    placeholderName: 'Buscar por nombre...',
    placeholderEmail: 'Buscar por correo...',
    button: 'Buscar',
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
  sort: {
    label: 'Ordenar por',
    options: {
      createdAtDesc: 'Más recientes',
      createdAtAsc: 'Más antiguos',
      fullNameAsc: 'Nombre A→Z',
      fullNameDesc: 'Nombre Z→A',
    },
  },
  pagination: {
    showing: 'Mostrando',
    of: 'de',
    results: 'usuarios',
    prev: 'Anterior',
    next: 'Siguiente',
  },
  errors: {
    fetchError: 'No se pudo cargar la lista de usuarios.',
    statusError: 'No se pudo cambiar el estado del usuario.',
  },
} as const;
