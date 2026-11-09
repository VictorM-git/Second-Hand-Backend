import { seedCategories } from '../data/categories.js';
import { normalize } from '../utils/format.js';

// Categorías (RQF010). Mientras no hay backend se guardan en localStorage.
// Futuro: GET/POST/PUT/PATCH `${API_URL}/categories`.
const KEY = 'sh_categories';
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export function loadCategories() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seedCategories;
  } catch {
    return seedCategories;
  }
}

const save = (list) => localStorage.setItem(KEY, JSON.stringify(list));

// Nombres de las categorías activas: las usan Explorar y Publicar
export const getActiveCategoryNames = () =>
  loadCategories().filter((c) => c.status === 'Activa').map((c) => c.name);

// Valida y limpia el nombre (no vacío, máximo 40 caracteres, sin duplicados)
function validateName(name, list, ignoreId) {
  const clean = name.trim().replace(/\s+/g, ' ');
  if (!clean) throw new Error('Escribe el nombre de la categoría.');
  if (clean.length > 40) throw new Error('Máximo 40 caracteres.');
  if (list.some((c) => c.id !== ignoreId && normalize(c.name) === normalize(clean))) {
    throw new Error('Ya existe una categoría con ese nombre.');
  }
  return clean;
}

export async function getCategories() {
  await wait();
  return loadCategories();
}

export async function createCategory(name) {
  await wait();
  const list = loadCategories();
  const category = { id: `c${Date.now()}`, name: validateName(name, list), status: 'Activa', articleCount: 0 };
  save([...list, category]);
  return category;
}

export async function updateCategory(id, name) {
  await wait();
  const list = loadCategories();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('No encontramos la categoría.');
  list[index] = { ...list[index], name: validateName(name, list, id) };
  save(list);
  return list[index];
}

// 'Activa' | 'Inactiva'
export async function setCategoryStatus(id, status) {
  await wait(250);
  const list = loadCategories();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('No encontramos la categoría.');
  list[index] = { ...list[index], status };
  save(list);
  return list[index];
}
