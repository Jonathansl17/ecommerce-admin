export const EMAIL_SUBJECTS = {
  LOW_STOCK_ALERT: (supplyName) => `[ALERTA] Stock bajo: ${supplyName}`,
  OUT_OF_STOCK_ALERT: (supplyName) => `[ALERTA] Insumo agotado: ${supplyName}`,
  REVIEW_REJECTED: 'Tu reseña no pudo ser publicada',
};

export const EMAIL_BODY = {
  REVIEW_REJECTED: {
    GREETING: (name) => `Hola${name ? ` ${name}` : ''},`,
    PRODUCT_LINE: (product) =>
      `Gracias por tomarte el tiempo de escribir una reseña sobre <strong>${product}</strong>.`,
    REJECTION_REASON:
      'Lamentablemente, tu reseña no cumple con nuestras normas de la comunidad y no pudo ser publicada.',
    CONTACT_LINE:
      'Si tienes preguntas, puedes contactarnos respondiendo a este correo.',
  },
  LOW_STOCK: {
    INTRO: (supplyName) =>
      `El insumo <strong>${supplyName}</strong> requiere atención en el módulo de inventario.`,
    LABEL_STOCK: 'Stock actual:',
    LABEL_THRESHOLD: 'Umbral mínimo:',
    LABEL_AVG: 'Consumo promedio (últimos 30 días):',
    LABEL_DAYS: 'Días de stock estimados:',
    FOOTER: 'Por favor, registre una entrada de insumo a la brevedad.',
    NO_DATA: 'Sin datos de consumo',
    INDETERMINATE: 'Indeterminado',
    UNIT_PER_DAY: (value, unit) => `${value} ${unit}/día`,
    DAYS_REMAINING: (n) => `${n} día${n === 1 ? '' : 's'}`,
  },
};
