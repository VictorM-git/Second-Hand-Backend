import { seedReceivedRequests } from '../data/receivedRequests.mock.js';
import { loadMyItems, setMyItemStatus } from './myItemsService.js';

// Solicitudes recibidas sobre mis publicaciones (RQF006). Se guardan en localStorage mientras no hay backend.
// Futuro: GET `${API_URL}/requests/received` y PATCH `${API_URL}/requests/:id`.
const KEY = 'sh_received_requests';
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seedReceivedRequests;
  } catch {
    return seedReceivedRequests;
  }
}
const save = (list) => localStorage.setItem(KEY, JSON.stringify(list));

export async function getReceivedRequests() {
  await wait();
  return load();
}

/**
 * Cambia el estado de una solicitud: 'Aceptada' | 'Rechazada' | 'Pendiente' (deshacer).
 * - Aceptar solo es posible si la publicación está 'Disponible' y la pasa a 'En proceso'.
 * - Deshacer una aceptada devuelve la publicación a 'Disponible' (si seguía 'En proceso').
 */
export async function respondToRequest(id, nextStatus) {
  await wait(250);
  const list = load();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('No encontramos la solicitud.');

  const request = list[index];
  const item = loadMyItems().find((i) => i.id === request.itemId);

  if (nextStatus === 'Aceptada') {
    if (!item || item.status === 'Inactivo') throw new Error('Activa la publicación antes de aceptar la solicitud.');
    if (item.status === 'En proceso') throw new Error('Esta publicación ya tiene una solicitud aceptada.');
    if (item.status !== 'Disponible') throw new Error('Esta publicación ya no está disponible.');
    await setMyItemStatus(item.id, 'En proceso');
  }

  if (request.status === 'Aceptada' && nextStatus === 'Pendiente' && item?.status === 'En proceso') {
    await setMyItemStatus(item.id, 'Disponible');
  }

  list[index] = { ...request, status: nextStatus };
  save(list);
  return list[index];
}

// Elimina una solicitud (solo las rechazadas)
export async function deleteReceivedRequest(id) {
  await wait(250);
  save(load().filter((r) => r.id !== id));
}
