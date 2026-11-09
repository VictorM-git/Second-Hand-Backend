import { Category } from '../models/Category.js';
import { Item } from '../models/Item.js';
import { Request } from '../models/Request.js';
import { User } from '../models/User.js';

// Datos de prueba: los mismos del frontend (src/data/*.js), con los mismos ids.
// Se cargan en memoria cada vez que arranca el servidor; al reiniciarlo vuelven a este estado.

const DAY = 24 * 60 * 60 * 1000;
const bogota = (date, time = '12:00') => new Date(`${date}T${time}:00-05:00`); // fecha en hora de Bogotá

export async function loadSeedData({ adminPassword, userPassword, now = Date.now() }) {
  const daysAgo = (d) => new Date(now - d * DAY);
  [Category, User, Item, Request].forEach((Model) => Model.clear());

  // ---------- Categorías (src/data/categories.js) ----------
  const categoryRows = [
    ['c1', 'Libros', 'Activa'],
    ['c2', 'Útiles escolares', 'Activa'],
    ['c3', 'Ropa', 'Activa'],
    ['c4', 'Muebles', 'Activa'],
    ['c5', 'Instrumentos musicales', 'Inactiva'],
  ];
  for (const [id, name, status] of categoryRows) {
    Category.create({ id, name, status, createdAt: bogota('2026-06-01') });
  }
  const categoryId = (name) => Category.findByName(name).id;

  // ---------- Usuarios ----------
  await User.create({
    id: 'a1',
    name: 'Administrador',
    email: 'admin@secondhand.com',
    password: adminPassword,
    role: 'admin',
    createdAt: bogota('2026-06-01'),
  });

  // Usuaria principal del frontend (perfil, mis publicaciones y solicitudes)
  await User.create({
    id: 'u0',
    name: 'Ana Camila Gómez',
    email: 'ana@correo.com',
    password: userPassword,
    phone: '300 000 0000',
    location: 'Chapinero',
    createdAt: bogota('2026-07-01'),
  });

  // Usuarios registrados (src/data/users.mock.js): [id, nombre, correo, localidad, estado, fecha de registro]
  const communityRows = [
    ['u1', 'Laura Pérez', 'laura@correo.com', 'Suba', 'Activo', '2026-09-05'],
    ['u2', 'Miguel Torres', 'miguel@correo.com', 'Kennedy', 'Activo', '2026-09-04'],
    ['u3', 'Sara Mora', 'sara@correo.com', 'Usaquén', 'Inactivo', '2026-09-03'],
    ['u4', 'Andrés Gil', 'andres@correo.com', 'Chapinero', 'Activo', '2026-09-02'],
    ['u5', 'Daniela León', 'daniela@correo.com', 'Santa Fe', 'Activo', '2026-03-01'],
    ['u6', 'Camilo Ruiz', 'camilo@correo.com', 'Teusaquillo', 'Activo', '2026-09-01'],
    ['u7', 'Valentina Cruz', 'valentina@correo.com', 'Bosa', 'Inactivo', '2026-05-10'],
    ['u8', 'Diana Herrera', 'diana@correo.com', 'Fontibón', 'Activo', '2026-08-31'],
    ['u9', 'Felipe Ríos', 'felipe@correo.com', 'Engativá', 'Activo', '2026-08-29'],
  ];
  // Dueños de los artículos de Explorar (src/data/items.mock.js)
  const ownerRows = [
    ['o1', 'Víctor Díaz', 'victor@correo.com', 'Chapinero', 'Activo', '2026-06-15'],
    ['o2', 'Laura Mejía', 'laura.mejia@correo.com', 'Suba', 'Activo', '2026-06-15'],
    ['o3', 'Camilo Rojas', 'camilo.rojas@correo.com', 'Teusaquillo', 'Activo', '2026-06-15'],
    ['o4', 'Natalia Pardo', 'natalia@correo.com', 'Usaquén', 'Activo', '2026-06-15'],
  ];
  // El hash de bcrypt toma unos milisegundos por usuario: se crean en paralelo
  await Promise.all([...communityRows, ...ownerRows].map(([id, name, email, location, status, date], i) => User.create({
    id,
    name,
    email,
    password: userPassword,
    phone: `320 555 00${String(i + 1).padStart(2, '0')}`,
    location,
    status,
    createdAt: bogota(date),
  })));
  // Contacto de Daniela que muestra src/data/requests.mock.js
  User.update(User.findById('u5'), { phone: '310 555 1234', instagram: '@danielaleon' });

  // ---------- Artículos de Explorar (src/data/items.mock.js) ----------
  // [id, título, categoría, estado, ubicación, días desde publicación, descripción]
  const itemRows = [
    ['1', 'Cálculo de una variable, Stewart', 'Libros', 'Usado', 'Chapinero', 1,
      ['Séptima edición, en español. Tiene subrayados a lápiz en los primeros tres capítulos y la pasta está completa. Lo usé dos semestres y ya no lo necesito.',
        'El libro está en buen estado general. Las páginas están sin rasgaduras y todos los capítulos están intactos. Ideal para estudiantes de ingeniería o ciencias exactas.']],
    ['2', 'Escritorio plegable de madera', 'Muebles', 'Usado', 'Teusaquillo', 2, ['Escritorio plegable de madera, ideal para espacios pequeños. Tiene marcas leves de uso.']],
    ['3', 'Calculadora científica Casio', 'Útiles escolares', 'Como nuevo', 'Suba', 2, ['Calculadora científica Casio, funciona perfecto. Incluye la tapa protectora.']],
    ['4', 'Chaqueta impermeable talla M', 'Ropa', 'Usado', 'Chapinero', 3, ['Chaqueta impermeable talla M, sirve para la lluvia de Bogotá. Cierres en buen estado.']],
    ['5', 'Set de lápices de dibujo técnico', 'Útiles escolares', 'Nuevo', 'Usaquén', 3, ['Set de lápices de dibujo técnico sin estrenar, con varias durezas.']],
    ['6', 'Silla de oficina ergonómica', 'Muebles', 'Usado', 'Fontibón', 4, ['Silla ergonómica con ruedas y altura regulable. El tapizado tiene un pequeño desgaste.']],
    ['7', 'Física universitaria, Sears Zemansky', 'Libros', 'Usado', 'Suba', 5, ['Volumen 1 de Física universitaria. Algunas páginas con notas al margen.']],
    ['8', 'Álgebra lineal, Grossman', 'Libros', 'Como nuevo', 'Teusaquillo', 6, ['Casi sin uso, sin subrayados. Perfecto para el curso de álgebra lineal.']],
    ['9', 'Mesa auxiliar blanca', 'Muebles', 'Como nuevo', 'Kennedy', 7, ['Mesa auxiliar blanca de 40 cm, ideal como mesa de noche.']],
    ['10', 'Estantería de 4 niveles', 'Muebles', 'Usado', 'Engativá', 8, ['Estantería metálica de cuatro niveles. Hay que armarla, incluye los tornillos.']],
    ['11', 'Buzo de lana talla S', 'Ropa', 'Usado', 'Usaquén', 9, ['Buzo de lana talla S, color gris. Sin bolitas ni manchas.']],
    ['12', 'Jeans talla 30', 'Ropa', 'Como nuevo', 'Barrios Unidos', 10, ['Jeans azul oscuro talla 30, usados un par de veces.']],
    ['13', 'Bata de laboratorio talla M', 'Ropa', 'Nuevo', 'Chapinero', 11, ['Bata blanca de laboratorio talla M, nunca usada.']],
    ['14', 'Compás y escuadras', 'Útiles escolares', 'Usado', 'Suba', 12, ['Juego de compás y dos escuadras para dibujo técnico.']],
    ['15', 'Cuadernos universitarios x5', 'Útiles escolares', 'Nuevo', 'Teusaquillo', 13, ['Cinco cuadernos universitarios de 100 hojas, sin usar.']],
    ['16', 'Química general, Chang', 'Libros', 'Usado', 'Fontibón', 14, ['Edición en español, con el CD de ejercicios incluido.']],
    ['17', 'Lámpara de escritorio LED', 'Muebles', 'Como nuevo', 'Santa Fe', 15, ['Lámpara LED con brazo flexible y tres niveles de luz.']],
    ['18', 'Mochila para portátil', 'Útiles escolares', 'Usado', 'Kennedy', 16, ['Mochila con compartimento acolchado para portátil de hasta 15 pulgadas.']],
  ];
  const firstImages = { 1: 'calculo', 2: 'escritorio', 3: 'calculadora', 4: 'chaqueta' };
  const owners = ['o1', 'o2', 'o3', 'o4'];
  // Los artículos que Ana pidió (src/data/requests.mock.js) son de los usuarios que aparecen como contraparte
  const requestedOwners = { 4: 'u6', 7: 'u5', 17: 'u4' };

  itemRows.forEach(([id, title, category, condition, location, days, description], i) => {
    const base = firstImages[id] ?? `item-${id}`;
    Item.create({
      id,
      title,
      categoryId: categoryId(category),
      condition,
      location,
      description,
      images: [`/images/items/${base}.jpg`, `/images/items/${base}-2.jpg`],
      status: id === '7' ? 'En proceso' : 'Disponible', // el 7 tiene una solicitud aceptada
      ownerId: requestedOwners[id] ?? owners[i % owners.length],
      createdAt: daysAgo(days),
    });
  });

  // ---------- Publicaciones de Ana (src/data/myItems.mock.js) ----------
  // [id, título, categoría, estado, fecha, estado de publicación, imagen]
  const myRows = [
    ['m1', 'Cálculo de una variable, Stewart', 'Libros', 'Usado', '2026-09-02', 'Disponible', 'calculo'],
    ['m2', 'Escritorio plegable de madera', 'Muebles', 'Usado', '2026-08-28', 'Inactivo', 'escritorio'],
    ['m3', 'Calculadora científica Casio', 'Útiles escolares', 'Como nuevo', '2026-08-19', 'Entregado', 'calculadora'],
    ['m4', 'Chaqueta impermeable talla M', 'Ropa', 'Usado', '2026-08-15', 'Disponible', 'chaqueta'],
    ['m5', 'Set de lápices de dibujo técnico', 'Útiles escolares', 'Nuevo', '2026-08-10', 'Disponible', 'item-5'],
  ];
  for (const [id, title, category, condition, date, status, image] of myRows) {
    Item.create({
      id,
      title,
      categoryId: categoryId(category),
      condition,
      location: 'Chapinero',
      description: ['Artículo en buen estado, listo para entregar a quien lo necesite.'],
      images: [`/images/items/${image}.jpg`],
      status,
      ownerId: 'u0',
      createdAt: bogota(date),
    });
  }

  // ---------- Solicitudes hechas por Ana (src/data/requests.mock.js) ----------
  Request.create({
    id: '1',
    itemId: '4',
    requesterId: 'u0',
    ownerId: 'u6',
    type: 'Donación',
    message: 'Hola, la necesito para las salidas de campo de este semestre.',
    createdAt: daysAgo(1),
  });
  Request.create({
    id: '2',
    itemId: '7',
    requesterId: 'u0',
    ownerId: 'u5',
    type: 'Intercambio',
    offeredItemId: 'm5',
    offeredTitle: 'Set de lápices de dibujo técnico',
    message: 'Te puedo dar mi set de lápices de dibujo técnico, están nuevos.',
    status: 'Aceptada',
    acceptedAt: daysAgo(2),
    createdAt: daysAgo(4),
  });
  Request.create({
    id: '3',
    itemId: '17',
    requesterId: 'u0',
    ownerId: 'u4',
    type: 'Donación',
    message: 'Me serviría mucho para estudiar en las noches.',
    status: 'Rechazada',
    createdAt: daysAgo(10),
  });

  // ---------- Solicitudes recibidas por Ana (src/data/receivedRequests.mock.js) ----------
  Request.create({
    id: 'rr1',
    itemId: 'm1',
    requesterId: 'u1',
    ownerId: 'u0',
    type: 'Donación',
    message: 'Lo necesito para el curso de este semestre, puedo recogerlo cuando te sirva.',
    createdAt: bogota('2026-09-06'),
  });
  Request.create({
    id: 'rr2',
    itemId: 'm2',
    requesterId: 'u2',
    ownerId: 'u0',
    type: 'Intercambio',
    offeredTitle: 'una silla giratoria',
    message: '¿Tengo una silla en buen estado, te interesa?',
    status: 'Rechazada',
    createdAt: bogota('2026-09-05'),
  });
  Request.create({
    id: 'rr3',
    itemId: 'm3',
    requesterId: 'u3',
    ownerId: 'u0',
    type: 'Donación',
    message: '',
    status: 'Aceptada',
    acceptedAt: bogota('2026-09-05'),
    createdAt: bogota('2026-09-04'),
  });

  return {
    categories: Category.all().length,
    users: User.all().length,
    items: Item.all().length,
    requests: Request.all().length,
  };
}
