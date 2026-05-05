export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('es-CO');

export const formatTime = (dateStr: string): string =>
  new Date(dateStr).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
