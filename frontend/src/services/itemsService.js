import { mockItems } from '../data/items.mock.js';
import { loadMyItems } from './myItemsService.js';

// Capa de acceso a datos. Hoy usa datos mock; al tener el backend,
// solo se cambia el cuerpo de estas funciones por llamadas fetch a la API REST.
// const API_URL = import.meta.env.VITE_API_URL;

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Landing: los 4 artículos más recientes
export async function getRecentItems() {
  await wait();
  return mockItems.slice(0, 4);
  // Futuro: GET `${API_URL}/items?limit=4&sort=recent`
}

// Explorar: artículos disponibles. Incluye las publicaciones nuevas del usuario (las de prueba iniciales no).
export async function getItems() {
  await wait();
  const published = loadMyItems().filter((i) => i.status === 'Disponible' && !i.seed);
  return [...published, ...mockItems];
  // Futuro: GET `${API_URL}/items?q=&category=&condition=&location=&page=`
}

// Detalle: un artículo por id, propio o de otros (null si no existe)
export async function getItemById(id) {
  await wait();
  return [...mockItems, ...loadMyItems()].find((item) => item.id === id) ?? null;
  // Futuro: GET `${API_URL}/items/${id}`
}
