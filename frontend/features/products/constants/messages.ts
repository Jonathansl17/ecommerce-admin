export const PRODUCTS_MESSAGES = {
  page: {
    title: 'Stock de productos',
    subtitle: 'Consulta y ajusta manualmente el stock de cada producto.',
  },
  list: {
    emptyMessage: 'No hay productos registrados.',
    colName: 'Nombre',
    colUnit: 'Unidad',
    colStock: 'Stock actual',
    colStatus: 'Estado',
    colActions: 'Acciones',
    adjustButton: 'Ajustar stock',
    statusActive: 'Activo',
    statusInactive: 'Inactivo',
  },
  adjust: {
    title: 'Ajustar stock',
    currentStockLabel: 'Stock actual (solo lectura)',
    newStockLabel: 'Nuevo stock',
    newStockPlaceholder: '0',
    reasonLabel: 'Motivo',
    noteLabel: 'Notas (opcional)',
    notePlaceholder: 'Agrega observaciones adicionales...',
    noteHint: 'Máximo 500 caracteres',
    saveButton: 'Aplicar ajuste',
    savingButton: 'Aplicando...',
    cancelButton: 'Cancelar',
  },
  validation: {
    newStockMin: 'La cantidad no puede ser negativa',
    newStockRequired: 'Ingresa la nueva cantidad',
    reasonRequired: 'Selecciona un motivo',
    noteMax: 'Las notas no pueden superar los 500 caracteres',
  },
  errors: {
    fetchError: 'No se pudieron cargar los productos',
    adjustError: 'No se pudo ajustar el stock',
    sameStockError: 'El nuevo stock es igual al stock actual',
  },
  success: {
    adjustApplied: 'Stock ajustado correctamente',
  },
} as const;
