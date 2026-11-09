import { CITY } from '../constants.js';
import { Category } from '../models/Category.js';
import { Item } from '../models/Item.js';
import { User } from '../models/User.js';
import { toBogotaDate, toBogotaISO } from './dates.js';

// Convierten los registros guardados en el JSON que espera el frontend
// (mismos nombres de campos que los datos de prueba de src/data/*.js). Nunca incluyen la contraseña.

// Usuario con sesión (login y /users/me). stats = { publications, requests }
export function serializeMe(user, stats) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio,
    photo: user.photo ?? null,
    instagram: user.instagram,
    role: user.role,
    status: user.status,
    memberSince: toBogotaDate(user.createdAt),
    stats,
  };
}

// Fila de la tabla de usuarios del administrador (RQF009)
export function serializeUserForAdmin(user, publications) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    location: user.location,
    publications,
    status: user.status,
    registeredAt: toBogotaDate(user.createdAt),
  };
}

// Categoría (RQF010). articleCount = artículos asociados
export function serializeCategory(category, articleCount) {
  return { id: category.id, name: category.name, status: category.status, articleCount };
}

// Artículo. viewer = usuario que consulta (o null) para calcular "mine".
// coverOnly: en las listas solo se envía la portada (las fotos pueden ser pesadas).
export function serializeItem(item, viewer, { coverOnly = false } = {}) {
  const owner = User.findById(item.ownerId);
  return {
    id: item.id,
    title: item.title,
    category: Category.findById(item.categoryId)?.name ?? null,
    condition: item.condition,
    location: item.location,
    description: item.description,
    images: coverOnly ? item.images.slice(0, 1) : item.images,
    image: item.images[0] ?? null, // portada para las tarjetas
    status: item.status,
    createdAt: toBogotaISO(item.createdAt),
    owner: {
      id: owner.id,
      name: owner.name,
      location: `${item.location}, ${CITY}`,
      photo: owner.photo ?? null,
    },
    mine: Boolean(viewer && item.ownerId === viewer.id),
  };
}

const NOTES = {
  Pendiente: 'Esperando respuesta del donante. Recibirás una notificación cuando haya novedad.',
  Aceptada: 'Tu solicitud fue aceptada. Contacta al miembro para coordinar la entrega.',
  Rechazada: 'El artículo ya no está disponible o el donante no pudo atender tu solicitud.',
};

// Solicitud hecha por el usuario (RQF008).
// Los datos de contacto del dueño solo se incluyen cuando la solicitud fue aceptada.
export function serializeMyRequest(request) {
  const item = Item.findById(request.itemId);
  const owner = User.findById(request.ownerId);
  const data = {
    id: request.id,
    itemId: item.id,
    title: item.title,
    image: item.images[0] ?? null,
    type: request.type,
    counterpart: owner.name,
    date: toBogotaDate(request.createdAt),
    status: request.status,
    note: NOTES[request.status],
    message: request.message,
    offeredTitle: request.offeredTitle ?? null,
  };
  if (request.status === 'Aceptada') {
    data.acceptedAt = toBogotaDate(request.acceptedAt);
    data.contact = {
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      location: owner.location,
      instagram: owner.instagram,
      photo: owner.photo ?? null,
      memberSince: toBogotaDate(owner.createdAt),
    };
  }
  return data;
}

// Solicitud recibida sobre una publicación propia (RQF006)
export function serializeReceivedRequest(request) {
  const item = Item.findById(request.itemId);
  const requester = User.findById(request.requesterId);
  return {
    id: request.id,
    itemId: item.id,
    itemTitle: item.title,
    requester: { id: requester.id, name: requester.name, photo: requester.photo ?? null },
    type: request.type,
    offeredTitle: request.offeredTitle ?? null,
    status: request.status,
    message: request.message,
    date: toBogotaDate(request.createdAt),
  };
}
