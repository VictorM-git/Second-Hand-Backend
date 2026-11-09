import { normalize } from '../utils/text.js';
import { createCollection } from './collection.js';

const categories = createCollection();

// Categoría de artículos (RQF010). La gestiona el administrador.
// Campos: id, name, status ('Activa' | 'Inactiva'), createdAt
export const Category = {
  ...categories,

  // Busca por nombre sin importar tildes ni mayúsculas ("ropa" = "Ropa"). Evita duplicados.
  findByName: (name) => categories.findOne((category) => normalize(category.name) === normalize(name)),

  create: (data) => categories.insert({ status: 'Activa', ...data }),
};
