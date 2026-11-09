// Publicaciones del usuario (RQF007). Datos de prueba iniciales.
// seed: true -> no se muestran en Explorar (solo las publicaciones nuevas aparecen allí).
const owner = { name: 'Ana Camila Gómez', location: 'Chapinero, Bogotá' };

// [id, título, categoría, estado, fecha, estado de publicación, imagen]
const rows = [
  ['m1', 'Cálculo de una variable, Stewart', 'Libros', 'Usado', '2026-09-02', 'Disponible', 'calculo'],
  ['m2', 'Escritorio plegable de madera', 'Muebles', 'Usado', '2026-08-28', 'Inactivo', 'escritorio'],
  ['m3', 'Calculadora científica Casio', 'Útiles escolares', 'Como nuevo', '2026-08-19', 'Entregado', 'calculadora'],
  ['m4', 'Chaqueta impermeable talla M', 'Ropa', 'Usado', '2026-08-15', 'Disponible', 'chaqueta'],
  ['m5', 'Set de lápices de dibujo técnico', 'Útiles escolares', 'Nuevo', '2026-08-10', 'Disponible', 'item-5'],
];

export const seedMyItems = rows.map(([id, title, category, condition, date, status, img]) => ({
  id, title, category, condition, status,
  location: 'Chapinero',
  description: ['Artículo en buen estado, listo para entregar a quien lo necesite.'],
  images: [`/images/items/${img}.jpg`],
  image: `/images/items/${img}.jpg`,
  createdAt: `${date}T12:00:00`,
  owner,
  mine: true,
  seed: true,
}));
