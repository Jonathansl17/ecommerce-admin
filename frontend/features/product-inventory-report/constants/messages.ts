export const INVENTORY_REPORT_MESSAGES = {
  page: {
    title: 'Reporte de inventario',
    subtitle: 'Estado actual del stock por producto y variante',
    backButton: '← Volver a Productos',
  },
  filters: {
    searchLabel: 'Buscar por nombre',
    searchPlaceholder: 'Nombre del producto...',
    stockStatusLabel: 'Estado de stock',
  },
  table: {
    colProduct: 'Producto',
    colVariant: 'Variante',
    colStock: 'Stock actual',
    colThreshold: 'Umbral mínimo',
    colStatus: 'Estado',
    noVariant: '—',
    noThreshold: 'Sin umbral',
    emptyMessage: 'No hay productos que coincidan con los filtros seleccionados.',
  },
  stockStatus: {
    all: 'Todos',
    available: 'Disponible',
    low: 'Bajo',
    out_of_stock: 'Agotado',
  },
  sections: {
    standardTitle: 'Productos regulares',
    customTitle: 'Productos personalizados',
    customSubtitle: 'Productos marcados como personalizables para pedidos a medida',
    customEmpty: 'No hay productos personalizados que coincidan con los filtros.',
  },
  loading: 'Cargando reporte...',
  fetchError: 'Error al cargar el reporte de inventario.',
  retry: 'Reintentar',
} as const;
