export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffMinutes < 1) return 'Justo ahora';
  if (diffHours < 1) return `hace ${diffMinutes} minuto${diffMinutes === 1 ? '' : 's'}`;
  if (diffDays < 1) return `hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;
  return `hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
}
