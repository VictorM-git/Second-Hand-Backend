import { mockRequests } from '../data/requests.mock.js';
import { todayLocalISO } from '../utils/format.js';

// Acceso a datos de solicitudes (RQF006 y RQF008). Las solicitudes nuevas se guardan en localStorage
// mientras no hay backend. Futuro: GET/POST `${API_URL}/requests`.
const KEY = 'sh_my_requests';
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

function loadCreated() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

// RQF008: solicitudes que hizo el usuario (las nuevas primero)
export async function getMyRequests() {
  await wait();
  return [...loadCreated(), ...mockRequests];
}

// Una solicitud por id (null si no existe)
export async function getRequestById(id) {
  await wait();
  return [...loadCreated(), ...mockRequests].find((r) => r.id === id) ?? null;
}

// RQF006: registrar una solicitud de donación o intercambio sobre un artículo
export async function createRequest(item, { type, offeredItem, message }) {
  await wait(400);
  const created = loadCreated();

  if ([...created, ...mockRequests].some((r) => r.itemId === item.id && r.status === 'Pendiente')) {
    throw new Error('Ya tienes una solicitud pendiente para este artículo.');
  }

  const request = {
    id: `r${Date.now()}`,
    itemId: item.id,
    title: item.title,
    image: item.image,
    type,
    counterpart: item.owner.name,
    date: todayLocalISO(),
    status: 'Pendiente',
    note: 'Esperando respuesta del donante. Recibirás una notificación cuando haya novedad.',
    message,
    offeredTitle: offeredItem?.title ?? null,
  };
  localStorage.setItem(KEY, JSON.stringify([request, ...created]));
  return request;
}
