// Quita tildes y pasa a minúsculas para comparar texto (igual que utils/format.js del frontend)
export const normalize = (text) =>
  String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Quita espacios repetidos y de los extremos: "  Ropa   deportiva " -> "Ropa deportiva"
export const collapseSpaces = (text) => String(text ?? '').trim().replace(/\s+/g, ' ');

// El textarea de la descripción guarda párrafos separados por saltos de línea
export const toParagraphs = (text) =>
  String(text ?? '').split(/\n+/).map((p) => p.trim()).filter(Boolean);

// Valida formatos (mismas reglas que utils/validators.js del frontend)
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? ''));
export const phoneDigits = (value) => String(value ?? '').replace(/\D/g, '');
export const isImageDataUrl = (value) =>
  typeof value === 'string' && /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$/.test(value);
