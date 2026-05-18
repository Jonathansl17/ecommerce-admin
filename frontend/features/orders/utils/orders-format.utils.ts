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

const INVALID_DATE_FALLBACK = '—';

function safeFormat(formatter: Intl.DateTimeFormat, isoString: string | null | undefined): string {
  if (isoString == null || isoString === '') return INVALID_DATE_FALLBACK;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return INVALID_DATE_FALLBACK;
  return formatter.format(date);
}

export function formatDate(isoString: string | null | undefined): string {
  return safeFormat(DATE_FORMATTER, isoString);
}

export function formatDateOnly(isoString: string | null | undefined): string {
  return safeFormat(DATE_ONLY_FORMATTER, isoString);
}

export function shortId(id: string): string {
  return id.length > 8 ? `...${id.slice(-8)}` : id;
}
