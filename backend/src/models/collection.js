import { randomUUID } from 'node:crypto';

// Por ahora no hay base de datos: cada modelo guarda sus registros en un arreglo en memoria.
// Los datos de prueba se cargan al iniciar el servidor (src/data/seed.js) y los cambios
// se pierden al reiniciarlo.
export function createCollection() {
  const records = [];

  return {
    all: () => records,
    find: (predicate) => records.filter(predicate), // devuelve un arreglo nuevo
    findOne: (predicate) => records.find(predicate) ?? null,
    findById: (id) => records.find((record) => record.id === id) ?? null,
    count: (predicate) => records.filter(predicate).length,

    // Agrega un registro. Si no trae id ni fecha de creación, se generan.
    insert(data) {
      const now = new Date();
      const record = { ...data, id: data.id ?? randomUUID(), createdAt: data.createdAt ?? now, updatedAt: now };
      records.push(record);
      return record;
    },

    update(record, changes) {
      return Object.assign(record, changes, { updatedAt: new Date() });
    },

    clear() {
      records.length = 0;
    },
  };
}

// Orden más recientes primero (por fecha de creación)
export const newestFirst = (a, b) => b.createdAt - a.createdAt;
