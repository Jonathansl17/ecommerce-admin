import type { UnitOfMeasure } from '@/lib/types/inventory.types';

export const UNIT_OF_MEASURE_LABELS: Record<UnitOfMeasure, string> = {
  grams: 'Gramos',
  kilograms: 'Kilogramos',
  milliliters: 'Mililitros',
  liters: 'Litros',
  units: 'Unidades',
};

export const UNIT_OF_MEASURE_OPTIONS = (
  Object.entries(UNIT_OF_MEASURE_LABELS) as [UnitOfMeasure, string][]
).map(([value, label]) => ({ value, label }));

export const INVENTORY_STRINGS = {
  page: {
    title: 'Gestión de Inventario',
    subtitle: 'Registra y administra los insumos de materia prima.',
  },
  form: {
    title: 'Registrar insumo',
    nameLabel: 'Nombre',
    namePlaceholder: 'Ej: Harina de trigo',
    unitLabel: 'Unidad de medida',
    unitPlaceholder: 'Selecciona una unidad',
    stockLabel: 'Cantidad inicial',
    stockPlaceholder: '0',
    submitButton: 'Registrar insumo',
    submittingButton: 'Registrando...',
  },
  edit: {
    title: 'Editar insumo',
    nameLabel: 'Nombre',
    namePlaceholder: 'Ej: Harina de trigo',
    unitLabel: 'Unidad de medida',
    stockLabel: 'Stock actual (solo lectura)',
    saveButton: 'Guardar cambios',
    savingButton: 'Guardando...',
    cancelButton: 'Cancelar',
  },
  list: {
    emptyMessage: 'No hay insumos registrados.',
    colName: 'Nombre',
    colUnit: 'Unidad',
    colStock: 'Stock actual',
    colStatus: 'Estado',
    colActions: 'Acciones',
    editButton: 'Editar',
  },
  validation: {
    nameRequired: 'El nombre es obligatorio',
    nameMax: 'El nombre no puede superar los 100 caracteres',
    unitRequired: 'Selecciona una unidad de medida',
    stockMin: 'La cantidad inicial no puede ser negativa',
  },
  errors: {
    duplicateName: 'Ya existe un insumo con ese nombre',
    createError: 'No se pudo registrar el insumo',
    updateError: 'No se pudo actualizar el insumo',
    fetchError: 'No se pudieron cargar los insumos',
  },
  success: {
    created: 'Insumo registrado correctamente',
  },
} as const;
