import { seedUsers } from '../data/users.mock.js';

// Usuarios de la plataforma (RQF009). Mientras no hay backend se guardan en localStorage.
// Futuro: GET `${API_URL}/users` y PATCH `${API_URL}/users/:id/status`.
const KEY = 'sh_users';
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export function loadUsers() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seedUsers;
  } catch {
    return seedUsers;
  }
}

export async function getUsers() {
  await wait();
  return loadUsers();
}

// Últimos usuarios registrados (más recientes primero)
export async function getRecentUsers(limit = 7) {
  await wait();
  return [...loadUsers()].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt)).slice(0, limit);
}

// 'Activo' | 'Inactivo'. Un usuario inactivo no puede iniciar sesión.
export async function setUserStatus(id, status) {
  await wait(250);
  const list = loadUsers();
  const index = list.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('No encontramos al usuario.');
  list[index] = { ...list[index], status };
  localStorage.setItem(KEY, JSON.stringify(list));
  return list[index];
}
