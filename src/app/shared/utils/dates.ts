/** "2026-10-17T15:00:00" → "15:00" */
export function formatHour(value: string): string {
  return value.slice(11, 16);
}

/** "2026-10-17T15:00:00" → "sábado, 17 de octubre de 2026, 15:00" */
export function formatDisplayDateTime(value: string): string {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(value));
}

/** Fecha de mañana en formato YYYY-MM-DD (hora local del navegador). */
export function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDuration(minutes: number): string {
  return minutes % 60 === 0 ? `${minutes / 60} h` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}
