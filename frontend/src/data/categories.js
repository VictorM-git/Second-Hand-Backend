// Categorías iniciales (las gestiona el administrador: RQF010) y estados de los artículos.
export const seedCategories = [
  { id: 'c1', name: 'Libros', status: 'Activa', articleCount: 412 },
  { id: 'c2', name: 'Útiles escolares', status: 'Activa', articleCount: 289 },
  { id: 'c3', name: 'Ropa', status: 'Activa', articleCount: 176 },
  { id: 'c4', name: 'Muebles', status: 'Activa', articleCount: 58 },
  { id: 'c5', name: 'Instrumentos musicales', status: 'Inactiva', articleCount: 3 },
];

export const conditions = ['Nuevo', 'Como nuevo', 'Usado'];
