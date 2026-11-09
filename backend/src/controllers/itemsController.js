import { CONDITIONS, LOCALITIES, MAX_ITEM_PHOTO_CHARS } from '../constants.js';
import { Category } from '../models/Category.js';
import { newestFirst } from '../models/collection.js';
import { Item } from '../models/Item.js';
import { HttpError, throwIfErrors } from '../utils/HttpError.js';
import { serializeItem } from '../utils/serializers.js';
import { isImageDataUrl, normalize, toParagraphs } from '../utils/text.js';

// Órdenes de Explorar. El orden alfabético usa las reglas del español ("Álgebra" va con la A).
const spanish = new Intl.Collator('es');
const SORTS = {
  recent: newestFirst,
  oldest: (a, b) => a.createdAt - b.createdAt,
  title: (a, b) => spanish.compare(a.title, b.title),
};

function findItem(id) {
  const item = Item.findById(id);
  if (!item) throw new HttpError(404, 'No encontramos el artículo.');
  return item;
}

// Lee y valida los datos del formulario de publicar/editar (mismas reglas que ItemForm.jsx).
// current = artículo que se edita (o undefined al crear).
function readItemInput(body = {}, current) {
  const title = String(body.title ?? '').trim();
  const categoryName = String(body.category ?? '').trim();
  const condition = String(body.condition ?? '');
  const descriptionText = Array.isArray(body.description) ? body.description.join('\n\n') : String(body.description ?? '');
  const location = String(body.location ?? '');
  const photo = body.photo ?? '';

  const category = categoryName ? Category.findByName(categoryName) : null;
  // Solo categorías activas; al editar se conserva la actual aunque ya esté inactiva
  const keepsCurrentCategory = current && category && current.categoryId === category.id;
  const photoUnchanged = current && photo === current.images[0];

  let categoryError = '';
  if (!categoryName) categoryError = 'Selecciona una categoría.';
  else if (!category) categoryError = 'La categoría no existe.';
  else if (category.status !== 'Activa' && !keepsCurrentCategory) categoryError = 'La categoría está inactiva.';

  let photoError = '';
  if (!photo) photoError = 'Agrega una fotografía del artículo.';
  else if (!photoUnchanged && !isImageDataUrl(photo)) photoError = 'Solo se permiten imágenes JPG o PNG.';
  else if (!photoUnchanged && photo.length > MAX_ITEM_PHOTO_CHARS) photoError = 'La imagen debe pesar máximo 5 MB.';

  throwIfErrors({
    title: !title ? 'Este campo es obligatorio.' : title.length > 80 ? 'Máximo 80 caracteres.' : '',
    category: categoryError,
    condition: CONDITIONS.includes(condition) ? '' : 'Selecciona el estado.',
    description: descriptionText.trim().length >= 20 ? '' : 'Describe el artículo en al menos 20 caracteres.',
    location: LOCALITIES.includes(location) ? '' : 'Selecciona la ubicación de entrega.',
    photo: photoError,
  });

  return {
    title,
    categoryId: category.id,
    condition,
    description: toParagraphs(descriptionText),
    location,
    ...(photoUnchanged ? {} : { images: [photo] }),
  };
}

// Solo el dueño puede modificar su publicación
function assertOwner(item, user) {
  if (item.ownerId !== user.id) throw new HttpError(403, 'Solo puedes modificar tus publicaciones.');
}

// GET /api/items — RQF005: artículos disponibles, con búsqueda, filtros, orden y paginación opcionales.
// ?q=&category=&condition=&location=&sort=recent|oldest|title&limit=&page=
// El total de resultados (sin paginar) va en el encabezado X-Total-Count.
export function listItems(req, res) {
  const text = (value) => (value === undefined ? '' : String(value).trim());
  const q = normalize(text(req.query.q));
  const categoryName = text(req.query.category);
  const location = text(req.query.location);
  const sort = req.query.sort ?? 'recent';
  if (!Object.hasOwn(SORTS, sort)) throw new HttpError(400, 'El orden debe ser recent, oldest o title.');

  // Varios estados: ?condition=Nuevo&condition=Usado o ?condition=Nuevo,Usado
  const conditions = req.query.condition === undefined
    ? null
    : [req.query.condition].flat().flatMap((c) => String(c).split(',')).map((c) => c.trim());
  const category = categoryName ? Category.findByName(categoryName) : null;

  const results = Item.find((item) =>
    item.status === 'Disponible'
    // búsqueda en título y descripción sin importar tildes ni mayúsculas
    && (!q || normalize(`${item.title} ${item.description.join(' ')}`).includes(q))
    // una categoría que no existe no devuelve resultados
    && (!categoryName || item.categoryId === category?.id)
    && (!conditions || conditions.includes(item.condition))
    && (!location || item.location === location)
  ).sort(SORTS[sort]);

  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 0, 0), 100);
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const pageItems = limit ? results.slice((page - 1) * limit, page * limit) : results;

  res.set('X-Total-Count', String(results.length));
  res.json(pageItems.map((item) => serializeItem(item, req.user, { coverOnly: true })));
}

// GET /api/items/mine — RQF007: mis publicaciones (todas, en cualquier estado), las más recientes primero
export function listMyItems(req, res) {
  const items = Item.find((item) => item.ownerId === req.user.id).sort(newestFirst);
  res.json(items.map((item) => serializeItem(item, req.user)));
}

// GET /api/items/:id — detalle. Una publicación inactiva solo la ve su dueño (o el administrador).
export function getItem(req, res) {
  const item = findItem(req.params.id);
  const isOwner = req.user && item.ownerId === req.user.id;
  if (item.status === 'Inactivo' && !isOwner && req.user?.role !== 'admin') {
    throw new HttpError(404, 'No encontramos el artículo.');
  }
  res.json(serializeItem(item, req.user));
}

// POST /api/items — RQF004: registrar publicación (queda Disponible)
export function createItem(req, res) {
  const item = Item.create({ ...readItemInput(req.body), ownerId: req.user.id });
  res.status(201).json(serializeItem(item, req.user));
}

// PUT /api/items/:id — RQF007: modificar publicación propia (no se puede si ya fue entregada)
export function updateItem(req, res) {
  const item = findItem(req.params.id);
  assertOwner(item, req.user);
  if (item.status === 'Entregado') throw new HttpError(409, 'Esta publicación ya fue entregada y no se puede editar.');

  Item.update(item, readItemInput(req.body, item));
  res.json(serializeItem(item, req.user));
}

// PATCH /api/items/:id/status — RQF007: inactivar/activar ('Disponible' <-> 'Inactivo').
// Las publicaciones 'En proceso' (solicitud aceptada) o 'Entregado' no se pueden cambiar aquí.
export function setItemStatus(req, res) {
  const { status } = req.body ?? {};
  if (!['Disponible', 'Inactivo'].includes(status)) {
    throw new HttpError(400, 'El estado debe ser "Disponible" o "Inactivo".', { status: 'Estado no válido.' });
  }

  const item = findItem(req.params.id);
  assertOwner(item, req.user);
  if (!['Disponible', 'Inactivo'].includes(item.status)) {
    throw new HttpError(409, `No puedes activar ni inactivar una publicación en estado "${item.status}".`);
  }

  Item.update(item, { status });
  res.json(serializeItem(item, req.user));
}
