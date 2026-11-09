// Fechas en hora de Bogotá (UTC-5, sin horario de verano).
// El frontend corta los primeros 10 caracteres ('AAAA-MM-DD') para mostrar la fecha;
// si se enviara la hora UTC, una publicación hecha a las 9 p. m. aparecería con el día siguiente.
const OFFSET_MS = -5 * 60 * 60 * 1000;

// 2026-09-03T02:00:00Z -> "2026-09-02T21:00:00-05:00"
export function toBogotaISO(date) {
  if (!date) return null;
  const local = new Date(new Date(date).getTime() + OFFSET_MS);
  return `${local.toISOString().slice(0, 19)}-05:00`;
}

// 2026-09-03T02:00:00Z -> "2026-09-02"
export function toBogotaDate(date) {
  return date ? toBogotaISO(date).slice(0, 10) : null;
}
