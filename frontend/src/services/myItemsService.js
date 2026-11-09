import { seedMyItems } from '../data/myItems.mock.js';
import { nowLocalISO } from '../utils/format.js';

// Publicaciones del usuario (RQF004 y RQF007). Mientras no hay backend se guardan en localStorage.
// Futuro: reemplazar cada función por llamadas a la API REST (POST/PUT/PATCH /items).
const KEY = 'sh_my_items';
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Lectura síncrona (la usa también itemsService para mostrar las publicaciones en Explorar)
export function loadMyItems() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seedMyItems;
  } catch {
    return seedMyItems;
  }
}

function save(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    throw new Error('No pudimos guardar los cambios. Intenta con una imagen más liviana.');
  }
}

// El textarea guarda párrafos separados por saltos de línea
const toParagraphs = (text) => text.split(/\n+/).map((p) => p.trim()).filter(Boolean);

export async function getMyItems() {
  await wait();
  return [...loadMyItems()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getMyItemById(id) {
  await wait();
  return loadMyItems().find((i) => i.id === id) ?? null;
}

// Registrar publicación
export async function createMyItem(data, owner) {
  await wait(400);
  const item = {
    id: `m${Date.now()}`,
    title: data.title.trim(),
    category: data.category,
    condition: data.condition,
    location: data.location,
    description: toParagraphs(data.description),
    images: [data.photo],
    image: data.photo,
    status: 'Disponible',
    createdAt: nowLocalISO(),
    owner,
    mine: true,
  };
  save([item, ...loadMyItems()]);
  return item;
}

// Modificar publicación
export async function updateMyItem(id, data) {
  await wait(400);
  const items = loadMyItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error('No encontramos la publicación.');

  const prev = items[index];
  const photoChanged = data.photo && data.photo !== prev.image;
  const updated = {
    ...prev,
    title: data.title.trim(),
    category: data.category,
    condition: data.condition,
    location: data.location,
    description: toParagraphs(data.description),
    owner: { ...prev.owner, location: `${data.location}, Bogotá` },
    ...(photoChanged ? { images: [data.photo], image: data.photo } : {}),
  };
  items[index] = updated;
  save(items);
  return updated;
}

// Inactivar / activar publicación ('Disponible' <-> 'Inactivo')
export async function setMyItemStatus(id, status) {
  await wait(250);
  const items = loadMyItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error('No encontramos la publicación.');
  items[index] = { ...items[index], status };
  save(items);
  return items[index];
}
