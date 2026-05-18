const CURRENCY_FORMATTER = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const DATE_FORMATTER = new Intl.DateTimeFormat('es-CR', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const DATE_ONLY_FORMATTER = new Intl.DateTimeFormat('es-CR', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export function formatCurrency(amount: number): string {
  return CURRENCY_FORMATTER.format(amount);
}

export function formatDate(isoString: string): string {
  return DATE_FORMATTER.format(new Date(isoString));
}

export function formatDateOnly(isoString: string): string {
  return DATE_ONLY_FORMATTER.format(new Date(isoString));
}

export function shortId(id: string): string {
  return id.length > 8 ? `...${id.slice(-8)}` : id;
}
