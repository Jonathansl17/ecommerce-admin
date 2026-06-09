export const PRODUCTS_MESSAGES = {
  NO_ENCONTRADO: 'Producto no encontrado',
  VARIANTE_NO_ENCONTRADA: 'Variante de producto no encontrada',
  ELIMINADO_EXITOSO: 'Producto eliminado correctamente',
  ERROR_AL_CREAR: 'Error al crear el producto',
  ERROR_AL_ACTUALIZAR: 'Error al actualizar el producto',
  ERROR_AL_ELIMINAR: 'Error al eliminar el producto',
  AJUSTE_REGISTRADO: 'Ajuste de stock registrado correctamente',
  MISMO_STOCK: 'El nuevo stock es igual al stock actual',
  AJUSTE_MASIVO_REGISTRADO: 'Ajuste masivo de stock registrado correctamente',
  ERROR_AJUSTE_MASIVO: 'Error al procesar el ajuste masivo',
  UMBRAL_INVALIDO: 'El umbral mínimo debe ser un entero mayor o igual a 1',
};

export const PRODUCTS_CONFIG = {
  ESTADO_POR_DEFECTO: 'active',
  UMBRAL_MIN: 1,
  UMBRAL_MAX: 999999,
  IMAGEN_POR_DEFECTO: 'https://placehold.co/600x400?text=Producto',
  CATEGORIA_POR_DEFECTO: 'General',
  IMAGEN_MAX_LENGTH: 300,
  CATEGORIA_MAX_LENGTH: 80,
  HOSTS_IMAGEN_PERMITIDOS: ['placehold.co', 'images.unsplash.com'],
};

export const PRODUCTS_SYNC = {
  VARIANTE_COLOR_POR_DEFECTO: 'Único',
  VARIANTE_TALLA_POR_DEFECTO: 'Único',
};
