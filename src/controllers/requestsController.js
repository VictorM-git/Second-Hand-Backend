import { REQUEST_STATUS, REQUEST_TYPES } from '../constants.js';
import { newestFirst } from '../models/collection.js';
import { Item } from '../models/Item.js';
import { Request } from '../models/Request.js';
import { HttpError, throwIfErrors } from '../utils/HttpError.js';
import { serializeMyRequest, serializeReceivedRequest } from '../utils/serializers.js';

// Cambios de estado permitidos para quien recibe la solicitud (ReceivedRequestCard.jsx):
// Pendiente -> Aceptada / Rechazada · Rechazada -> Pendiente (deshacer) · Aceptada -> Pendiente (deshacer)
const TRANSITIONS = {
  Pendiente: ['Aceptada', 'Rechazada'],
  Rechazada: ['Pendiente'],
  Aceptada: ['Pendiente'],
};

const isId = (value) => typeof value === 'string' && value.trim() !== '';

// GET /api/requests — RQF008: solicitudes que hizo el usuario (las nuevas primero)
export function listMyRequests(req, res) {
  const requests = Request.find((r) => r.requesterId === req.user.id).sort(newestFirst);
  res.json(requests.map(serializeMyRequest));
}

// GET /api/requests/:id — una solicitud propia. Incluye "contact" solo si fue aceptada.
export function getMyRequest(req, res) {
  const request = Request.findOne((r) => r.id === req.params.id && r.requesterId === req.user.id);
  if (!request) throw new HttpError(404, 'No encontramos la solicitud.');
  res.json(serializeMyRequest(request));
}

// POST /api/requests — RQF006: solicitar un artículo en donación o intercambio
export function createRequest(req, res) {
  const body = req.body ?? {};
  const type = String(body.type ?? '');
  const message = String(body.message ?? '').trim();
  const isExchange = type === 'Intercambio';

  throwIfErrors({
    itemId: isId(body.itemId) ? '' : 'Indica el artículo que quieres pedir.',
    type: REQUEST_TYPES.includes(type) ? '' : 'El tipo debe ser "Donación" o "Intercambio".',
    offeredItemId: isExchange && !isId(body.offeredItemId) ? 'Elige el artículo que ofreces a cambio.' : '',
    message: message.length >= 10 ? '' : 'Escribe un mensaje (mínimo 10 caracteres).',
  });

  const item = Item.findById(body.itemId);
  if (!item) throw new HttpError(404, 'No encontramos el artículo.');
  if (item.ownerId === req.user.id) throw new HttpError(400, 'No puedes enviarte una solicitud a ti mismo.');
  if (item.status !== 'Disponible') throw new HttpError(409, 'Este artículo no está disponible.');

  const pending = Request.findOne((r) => r.itemId === item.id && r.requesterId === req.user.id && r.status === 'Pendiente');
  if (pending) throw new HttpError(409, 'Ya tienes una solicitud pendiente para este artículo.');

  // En un intercambio se ofrece una publicación propia que esté disponible
  let offered = null;
  if (isExchange) {
    offered = Item.findOne((i) => i.id === body.offeredItemId && i.ownerId === req.user.id && i.status === 'Disponible');
    if (!offered) {
      throw new HttpError(400, 'El artículo que ofreces debe ser tuyo y estar disponible.', {
        offeredItemId: 'Elige uno de tus artículos disponibles.',
      });
    }
  }

  const request = Request.create({
    itemId: item.id,
    requesterId: req.user.id,
    ownerId: item.ownerId,
    type,
    offeredItemId: offered?.id ?? null,
    offeredTitle: offered?.title ?? null, // se guarda el título por si luego cambia
    message,
  });
  res.status(201).json(serializeMyRequest(request));
}

// GET /api/requests/received — RQF006: solicitudes recibidas sobre mis publicaciones
export function listReceivedRequests(req, res) {
  const requests = Request.find((r) => r.ownerId === req.user.id && !r.hiddenForOwner).sort(newestFirst);
  res.json(requests.map(serializeReceivedRequest));
}

// Busca una solicitud recibida por el usuario actual
function findReceived(id, user) {
  const request = Request.findOne((r) => r.id === id && r.ownerId === user.id && !r.hiddenForOwner);
  if (!request) throw new HttpError(404, 'No encontramos la solicitud.');
  return request;
}

// PATCH /api/requests/:id — RQF006: aceptar, rechazar o deshacer (volver a 'Pendiente').
// - Aceptar solo es posible si la publicación está 'Disponible' y la pasa a 'En proceso'.
// - Deshacer una aceptada devuelve la publicación a 'Disponible' (si seguía 'En proceso').
export function respondToRequest(req, res) {
  const next = req.body?.status;
  if (!REQUEST_STATUS.includes(next)) {
    throw new HttpError(400, 'El estado debe ser "Pendiente", "Aceptada" o "Rechazada".', { status: 'Estado no válido.' });
  }

  const request = findReceived(req.params.id, req.user);
  if (!TRANSITIONS[request.status].includes(next)) {
    throw new HttpError(409, `No puedes pasar una solicitud de "${request.status}" a "${next}".`);
  }

  const item = Item.findById(request.itemId);
  const changes = { status: next };

  if (next === 'Aceptada') {
    // Cada publicación admite una sola solicitud aceptada
    if (item.status === 'Inactivo') throw new HttpError(409, 'Activa la publicación antes de aceptar la solicitud.');
    if (item.status === 'En proceso') throw new HttpError(409, 'Esta publicación ya tiene una solicitud aceptada.');
    if (item.status !== 'Disponible') throw new HttpError(409, 'Esta publicación ya no está disponible.');
    Item.update(item, { status: 'En proceso' });
    changes.acceptedAt = new Date();
  }

  if (request.status === 'Aceptada' && next === 'Pendiente') {
    if (item.status === 'En proceso') Item.update(item, { status: 'Disponible' });
    changes.acceptedAt = null;
  }

  Request.update(request, changes);
  res.json(serializeReceivedRequest(request));
}

// DELETE /api/requests/:id — elimina de mi lista una solicitud recibida (solo las rechazadas).
// Quien la hizo la sigue viendo como "Rechazada" en Mis solicitudes.
export function deleteReceivedRequest(req, res) {
  const request = findReceived(req.params.id, req.user);
  if (request.status !== 'Rechazada') throw new HttpError(409, 'Solo puedes eliminar solicitudes rechazadas.');

  Request.update(request, { hiddenForOwner: true });
  res.status(204).end();
}
