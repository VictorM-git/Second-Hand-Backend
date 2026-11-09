import { CATEGORY_STATUS } from '../constants.js';
import { Category } from '../models/Category.js';
import { Item } from '../models/Item.js';
import { HttpError } from '../utils/HttpError.js';
import { serializeCategory } from '../utils/serializers.js';
import { collapseSpaces } from '../utils/text.js';

const countItems = (categoryId) => Item.count((item) => item.categoryId === categoryId);
const toJson = (category) => serializeCategory(category, countItems(category.id));

// Valida y limpia el nombre: no vacío, máximo 40 caracteres y sin duplicados (sin importar tildes ni mayúsculas)
function readName(body, currentId) {
  const name = collapseSpaces(body?.name);
  if (!name) throw new HttpError(400, 'Escribe el nombre de la categoría.', { name: 'Escribe el nombre de la categoría.' });
  if (name.length > 40) throw new HttpError(400, 'Máximo 40 caracteres.', { name: 'Máximo 40 caracteres.' });

  const duplicate = Category.findByName(name);
  if (duplicate && duplicate.id !== currentId) throw new HttpError(409, 'Ya existe una categoría con ese nombre.');
  return name;
}

function findCategory(id) {
  const category = Category.findById(id);
  if (!category) throw new HttpError(404, 'No encontramos la categoría.');
  return category;
}

// GET /api/categories?status=Activa — RQF010: lista de categorías con sus artículos asociados
export function listCategories(req, res) {
  const { status } = req.query;
  if (status !== undefined && !CATEGORY_STATUS.includes(status)) {
    throw new HttpError(400, 'El filtro status debe ser "Activa" o "Inactiva".');
  }

  const categories = Category.find((category) => !status || category.status === status);
  res.json(categories.map(toJson));
}

// POST /api/categories — registrar categoría (queda Activa). Solo admin.
export function createCategory(req, res) {
  const category = Category.create({ name: readName(req.body) });
  res.status(201).json(toJson(category));
}

// PUT /api/categories/:id — modificar el nombre. Solo admin.
// Los artículos guardan el id de la categoría, así que el nuevo nombre se refleja en todos.
export function updateCategory(req, res) {
  const category = findCategory(req.params.id);
  Category.update(category, { name: readName(req.body, category.id) });
  res.json(toJson(category));
}

// PATCH /api/categories/:id/status — activar o inactivar. Solo admin.
// Una categoría inactiva no aparece para publicar ni filtrar (?status=Activa).
export function setCategoryStatus(req, res) {
  const { status } = req.body ?? {};
  if (!CATEGORY_STATUS.includes(status)) {
    throw new HttpError(400, 'El estado debe ser "Activa" o "Inactiva".', { status: 'Estado no válido.' });
  }

  const category = findCategory(req.params.id);
  Category.update(category, { status });
  res.json(toJson(category));
}
