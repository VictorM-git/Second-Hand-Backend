// Datos de prueba. Las imágenes van en /public/images/items (exportar desde Figma).
// Si falta una imagen se muestra un fondo gris; la foto 2 es opcional (miniatura).
const owners = [
  { name: 'Víctor Díaz', location: 'Chapinero, Bogotá' },
  { name: 'Laura Mejía', location: 'Suba, Bogotá' },
  { name: 'Camilo Rojas', location: 'Teusaquillo, Bogotá' },
  { name: 'Natalia Pardo', location: 'Usaquén, Bogotá' },
];

const daysAgo = (d) => new Date(Date.now() - d * 86400000).toISOString();

// [id, título, categoría, estado, ubicación, días desde publicación, descripción]
const rows = [
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

export const mockItems = rows.map(([id, title, category, condition, location, d, description], i) => {
  const base = firstImages[id] ?? `item-${id}`;
  return {
    id, title, category, condition, location, description,
    images: [`/images/items/${base}.jpg`, `/images/items/${base}-2.jpg`],
    image: `/images/items/${base}.jpg`, // portada para las tarjetas
    status: 'Disponible',
    createdAt: daysAgo(d),
    owner: owners[i % owners.length],
  };
});
