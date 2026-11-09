import { LOCALITIES, MAX_PROFILE_PHOTO_CHARS, USER_STATUS } from '../constants.js';
import { newestFirst } from '../models/collection.js';
import { Item } from '../models/Item.js';
import { User } from '../models/User.js';
import { getUserStats } from '../utils/counts.js';
import { HttpError, throwIfErrors } from '../utils/HttpError.js';
import { serializeMe, serializeUserForAdmin } from '../utils/serializers.js';
import { isImageDataUrl, phoneDigits } from '../utils/text.js';

const countPublications = (userId) => Item.count((item) => item.ownerId === userId);

// GET /api/users/me — datos del usuario con sesión (ruta protegida)
export function getMe(req, res) {
  res.json(serializeMe(req.user, getUserStats(req.user.id)));
}

// PUT /api/users/me — RQF003: actualizar datos del perfil.
// Solo se cambian los campos editables que vengan en el cuerpo; el correo y el rol no se pueden cambiar.
export function updateMe(req, res) {
  const body = req.body ?? {};
  const has = (field) => body[field] !== undefined;
  const changes = {};
  const errors = {};

  if (has('name')) {
    changes.name = String(body.name).trim();
    errors.name = changes.name ? '' : 'Este campo es obligatorio.';
  }
  if (has('phone')) {
    changes.phone = String(body.phone).trim();
    errors.phone = phoneDigits(changes.phone).length === 10 ? '' : 'El teléfono debe tener 10 dígitos.';
  }
  if (has('location')) {
    changes.location = String(body.location);
    errors.location = LOCALITIES.includes(changes.location) ? '' : 'Selecciona tu localidad.';
  }
  if (has('bio')) {
    changes.bio = String(body.bio ?? '').trim();
    errors.bio = changes.bio.length <= 300 ? '' : 'Máximo 300 caracteres.';
  }
  if (has('instagram')) {
    changes.instagram = String(body.instagram ?? '').trim();
    errors.instagram = changes.instagram.length <= 50 ? '' : 'Máximo 50 caracteres.';
  }
  if (has('photo')) {
    changes.photo = body.photo || null; // null o '' quita la foto
    if (changes.photo && !isImageDataUrl(changes.photo)) errors.photo = 'Selecciona una imagen (JPG o PNG).';
    else if (changes.photo && changes.photo.length > MAX_PROFILE_PHOTO_CHARS) errors.photo = 'La imagen debe pesar menos de 1 MB.';
  }
  throwIfErrors(errors);

  User.update(req.user, changes);
  res.json(serializeMe(req.user, getUserStats(req.user.id)));
}

// GET /api/users?limit=7 — RQF009: usuarios de la comunidad (los más recientes primero). Solo admin.
export function listUsers(req, res) {
  const limit = Number.parseInt(req.query.limit, 10);
  let users = User.find((user) => user.role === 'user').sort(newestFirst);
  if (limit > 0) users = users.slice(0, limit);

  res.json(users.map((user) => serializeUserForAdmin(user, countPublications(user.id))));
}

// PATCH /api/users/:id/status — RQF009: inactivar o reactivar una cuenta. Solo admin.
export function setUserStatus(req, res) {
  const { status } = req.body ?? {};
  if (!USER_STATUS.includes(status)) {
    throw new HttpError(400, 'El estado debe ser "Activo" o "Inactivo".', { status: 'Estado no válido.' });
  }

  const user = User.findOne((u) => u.id === req.params.id && u.role === 'user');
  if (!user) throw new HttpError(404, 'No encontramos al usuario.');

  User.update(user, { status });
  res.json(serializeUserForAdmin(user, countPublications(user.id)));
}
