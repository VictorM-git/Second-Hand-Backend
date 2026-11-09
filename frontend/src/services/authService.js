// Capa de autenticación. Hoy simula las respuestas; al tener el backend,
// se reemplaza cada función por un fetch a la API REST (POST /auth/login, etc.).
// const API_URL = import.meta.env.VITE_API_URL;
import { loadUsers } from './usersService.js';

// Credencial privilegiada de prueba (RQF002): este correo entra como administrador
const ADMIN_EMAIL = 'admin@secondhand.com';

const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login({ email, password }) {
  await wait();
  if (password === 'incorrecta') throw new Error('Correo o contraseña incorrectos.'); // solo para probar el error

  const normalized = email.trim().toLowerCase();
  if (normalized === ADMIN_EMAIL) {
    return { user: { name: 'Administrador', email, role: 'admin' }, token: 'mock-admin-token' };
  }

  // RQF009: las cuentas inactivadas por el administrador no pueden entrar
  const registered = loadUsers().find((u) => u.email.toLowerCase() === normalized);
  if (registered?.status === 'Inactivo') throw new Error('Tu cuenta está inactiva. Contacta al administrador.');

  return {
    user: {
      name: 'Ana Camila Gómez',
      role: 'user',
      email,
      phone: '300 000 0000',
      location: 'Chapinero',
      bio: '',
      photo: null,
      memberSince: '2026-07-01',
      stats: { publications: 12, requests: 3, rating: 4.8 },
    },
    token: 'mock-token',
  };
}

export async function register(data) {
  await wait();
  if (data.email === 'ana@correo.com') throw new Error('Este correo ya está registrado.'); // RQF001: correo único
  return { user: { name: data.name, email: data.email } };
}

export async function requestPasswordReset({ email }) {
  await wait();
  return { ok: true, email };
}

// RQF003: actualizar datos del perfil. Futuro: PUT `${API_URL}/users/me`
export async function updateProfile(user) {
  await wait(300);
  return user;
}
