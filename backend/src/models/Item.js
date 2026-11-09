import { createCollection } from './collection.js';

const items = createCollection();

// Artículo publicado (RQF004, RQF005, RQF007)
// Campos: id, title, categoryId, condition, location (localidad de entrega), description (párrafos),
//         images (la primera es la portada), status, ownerId, createdAt
export const Item = {
  ...items,
  create: (data) => items.insert({ status: 'Disponible', ...data }),
};
