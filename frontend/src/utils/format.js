// Texto relativo para fechas: "hace 3 días", "hace 2 semanas"...
export function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'hoy';
  if (days === 1) return 'hace 1 día';
  if (days < 7) return `hace ${days} días`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`;
}

// Iniciales para el avatar: "Víctor Díaz" -> "VD"
export function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

// Quita tildes y pasa a minúsculas para comparar texto en las búsquedas
export const normalize = (text) =>
  String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Números de página a mostrar: [1, '…', 4, 5, 6, '…', 12]
export function getPageNumbers(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['…', p] : [p]));
}

// ---- Fechas en español (a partir de 'AAAA-MM-DD', sin problemas de zona horaria) ----
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const splitDate = (iso) => String(iso).slice(0, 10).split('-').map(Number); // [año, mes, día]

// "4 de septiembre"
export function formatDay(iso) {
  const [, m, d] = splitDate(iso);
  return `${d} de ${MONTHS[m - 1]}`;
}

// "15 de mayo de 2025"
export function formatDate(iso) {
  const [y] = splitDate(iso);
  return `${formatDay(iso)} de ${y}`;
}

// "julio de 2026"
export function formatMonthYear(iso) {
  const [y, m] = splitDate(iso);
  return `${MONTHS[m - 1]} de ${y}`;
}

// ---- Fecha y hora local como texto ISO (sin convertir a UTC) ----
const pad = (n) => String(n).padStart(2, '0');

// "2026-11-03T14:05:09"
export function nowLocalISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// "2026-11-03"
export const todayLocalISO = () => nowLocalISO().slice(0, 10);

// "5 sep 2026"
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export function formatShortDate(iso) {
  const [y, m, d] = splitDate(iso);
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
}
