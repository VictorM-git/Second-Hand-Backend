// Valores fijos del dominio. Deben coincidir con los del frontend (src/data).

// Estado físico del artículo (frontend: data/categories.js -> conditions)
export const CONDITIONS = ['Nuevo', 'Como nuevo', 'Usado'];

// Localidades de Bogotá (frontend: data/localities.js)
export const LOCALITIES = [
  'Chapinero', 'Teusaquillo', 'Suba', 'Usaquén', 'Engativá', 'Fontibón',
  'Kennedy', 'Barrios Unidos', 'Santa Fe', 'La Candelaria', 'Puente Aranda',
  'Usme', 'Bosa', 'Ciudad Bolívar', 'Tunjuelito', 'San Cristóbal',
];
export const CITY = 'Bogotá';

// Estado de una publicación (frontend: PublicationRow.jsx)
export const ITEM_STATUS = ['Disponible', 'En proceso', 'Inactivo', 'Entregado'];

// Solicitudes (RQF006 y RQF008)
export const REQUEST_TYPES = ['Donación', 'Intercambio'];
export const REQUEST_STATUS = ['Pendiente', 'Aceptada', 'Rechazada'];

// Usuarios (RQF009) y categorías (RQF010)
export const ROLES = ['user', 'admin'];
export const USER_STATUS = ['Activo', 'Inactivo'];
export const CATEGORY_STATUS = ['Activa', 'Inactiva'];

// Tamaño máximo de las fotos (como data URL base64): artículo 5 MB, perfil 1 MB (igual que el frontend)
export const MAX_ITEM_PHOTO_CHARS = Math.ceil((5 * 1024 * 1024 * 4) / 3) + 100;
export const MAX_PROFILE_PHOTO_CHARS = Math.ceil((1024 * 1024 * 4) / 3) + 100;
