import {
  CATEGORY_STATUS, CONDITIONS, ITEM_STATUS, LOCALITIES, REQUEST_STATUS, REQUEST_TYPES, ROLES, USER_STATUS,
} from '../constants.js';

// Documentación OpenAPI 3 de la API. Se muestra con Swagger UI en /api/docs
// y en JSON en /api/docs.json (se puede importar en Postman o Thunder Client).
// Los ids de los ejemplos son los de los datos de prueba (se cargan en memoria al iniciar el servidor).

// ---------- Ayudantes para no repetir estructura ----------
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const arrayOf = (name) => ({ type: 'array', items: ref(name) });
const json = (schema, example) => ({ 'application/json': { schema, ...(example !== undefined && { example }) } });
const ok = (description, schema, example) => ({ description, content: json(schema, example) });
const body = (schema, example) => ({ required: true, content: json(schema, example) });
const bodyExamples = (schema, examples) => ({ required: true, content: { 'application/json': { schema, examples } } });
const errors = (...codes) => Object.fromEntries(codes.map((code) => [code, { $ref: `#/components/responses/E${code}` }]));
const idParam = (description, example) => ({
  name: 'id', in: 'path', required: true, description,
  schema: { type: 'string' }, example,
});

const AUTH = [{ bearerAuth: [] }];
const OPTIONAL_AUTH = [{}, { bearerAuth: [] }]; // funciona con o sin token

// Imagen PNG de 1×1 px en base64 (para probar la subida de fotos)
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// ---------- Ejemplos (datos de prueba) ----------
const USER_EXAMPLE = {
  id: 'u0',
  name: 'Ana Camila Gómez',
  email: 'ana@correo.com',
  phone: '300 000 0000',
  location: 'Chapinero',
  bio: '',
  photo: null,
  instagram: '',
  role: 'user',
  status: 'Activo',
  memberSince: '2026-07-01',
  stats: { publications: 5, requests: 3 },
};

const ITEM_EXAMPLE = {
  id: '1',
  title: 'Cálculo de una variable, Stewart',
  category: 'Libros',
  condition: 'Usado',
  location: 'Chapinero',
  description: [
    'Séptima edición, en español. Tiene subrayados a lápiz en los primeros tres capítulos y la pasta está completa.',
    'El libro está en buen estado general. Ideal para estudiantes de ingeniería o ciencias exactas.',
  ],
  images: ['/images/items/calculo.jpg', '/images/items/calculo-2.jpg'],
  image: '/images/items/calculo.jpg',
  status: 'Disponible',
  createdAt: '2026-11-07T09:30:00-05:00',
  owner: { id: 'o1', name: 'Víctor Díaz', location: 'Chapinero, Bogotá', photo: null },
  mine: false,
};

const MY_REQUEST_EXAMPLE = {
  id: '2',
  itemId: '7',
  title: 'Física universitaria, Sears Zemansky',
  image: '/images/items/item-7.jpg',
  type: 'Intercambio',
  counterpart: 'Daniela León',
  date: '2026-11-04',
  status: 'Aceptada',
  note: 'Tu solicitud fue aceptada. Contacta al miembro para coordinar la entrega.',
  message: 'Te puedo dar mi set de lápices de dibujo técnico, están nuevos.',
  offeredTitle: 'Set de lápices de dibujo técnico',
  acceptedAt: '2026-11-06',
  contact: {
    name: 'Daniela León',
    email: 'daniela@correo.com',
    phone: '310 555 1234',
    location: 'Santa Fe',
    instagram: '@danielaleon',
    photo: null,
    memberSince: '2026-03-01',
  },
};

const RECEIVED_EXAMPLE = {
  id: 'rr1',
  itemId: 'm1',
  itemTitle: 'Cálculo de una variable, Stewart',
  requester: { id: 'u1', name: 'Laura Pérez', photo: null },
  type: 'Donación',
  offeredTitle: null,
  status: 'Pendiente',
  message: 'Lo necesito para el curso de este semestre, puedo recogerlo cuando te sirva.',
  date: '2026-09-06',
};

const CATEGORY_EXAMPLE = { id: 'c1', name: 'Libros', status: 'Activa', articleCount: 5 };
const ADMIN_USER_EXAMPLE = {
  id: 'u3', name: 'Sara Mora', email: 'sara@correo.com',
  location: 'Usaquén', publications: 0, status: 'Activo', registeredAt: '2026-09-03',
};

// ---------- Esquemas ----------
const schemas = {
  Error: {
    type: 'object',
    description: 'Formato de todas las respuestas de error. "errors" aparece cuando falla la validación de campos.',
    properties: {
      message: { type: 'string', example: 'Ingresa un correo válido.' },
      errors: {
        type: 'object',
        additionalProperties: { type: 'string' },
        example: { email: 'Ingresa un correo válido.', password: 'Mínimo 8 caracteres.' },
      },
    },
    required: ['message'],
  },
  Health: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'ok' },
      storage: { type: 'string', example: 'memoria', description: 'Por ahora los datos viven en memoria (sin base de datos)' },
      data: {
        type: 'object',
        description: 'Cantidad de registros cargados',
        properties: {
          users: { type: 'integer', example: 15 },
          categories: { type: 'integer', example: 5 },
          items: { type: 'integer', example: 23 },
          requests: { type: 'integer', example: 6 },
        },
      },
      time: { type: 'string', format: 'date-time' },
    },
  },
  Stats: {
    type: 'object',
    description: 'Indicadores del perfil',
    properties: {
      publications: { type: 'integer', description: 'Publicaciones del usuario' },
      requests: { type: 'integer', description: 'Solicitudes que ha hecho' },
    },
  },
  User: {
    type: 'object',
    description: 'Usuario con sesión (login y perfil)',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
      location: { type: 'string', description: 'Localidad de Bogotá' },
      bio: { type: 'string', maxLength: 300 },
      photo: { type: 'string', nullable: true, description: 'Foto de perfil como data URL (JPG o PNG)' },
      instagram: { type: 'string' },
      role: { type: 'string', enum: ROLES },
      status: { type: 'string', enum: USER_STATUS },
      memberSince: { type: 'string', format: 'date', description: 'Fecha de registro (AAAA-MM-DD)' },
      stats: ref('Stats'),
    },
  },
  RegisterInput: {
    type: 'object',
    required: ['name', 'email', 'phone', 'location', 'password'],
    properties: {
      name: { type: 'string', example: 'Juan Pérez' },
      email: { type: 'string', format: 'email', example: 'juan@correo.com', description: 'Debe ser único' },
      phone: { type: 'string', example: '300 123 4567', description: '10 dígitos (se permiten espacios)' },
      location: { type: 'string', enum: LOCALITIES, example: 'Chapinero' },
      password: { type: 'string', format: 'password', minLength: 8, example: 'Secreta123' },
      confirmPassword: { type: 'string', format: 'password', description: 'Opcional. Si se envía debe coincidir', example: 'Secreta123' },
    },
  },
  LoginInput: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', format: 'password' },
    },
  },
  LoginResponse: {
    type: 'object',
    properties: {
      user: ref('User'),
      token: { type: 'string', description: 'JWT. Envíalo en el encabezado Authorization: Bearer <token>' },
    },
  },
  ProfileInput: {
    type: 'object',
    description: 'Solo se cambian los campos enviados. El correo y el rol no se pueden modificar.',
    properties: {
      name: { type: 'string' },
      phone: { type: 'string', description: '10 dígitos' },
      location: { type: 'string', enum: LOCALITIES },
      bio: { type: 'string', maxLength: 300 },
      instagram: { type: 'string', maxLength: 50 },
      photo: { type: 'string', nullable: true, description: 'Data URL JPG/PNG de máximo 1 MB. null quita la foto.' },
    },
  },
  AdminUser: {
    type: 'object',
    description: 'Fila de la tabla de usuarios del administrador',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      location: { type: 'string' },
      publications: { type: 'integer' },
      status: { type: 'string', enum: USER_STATUS },
      registeredAt: { type: 'string', format: 'date' },
    },
  },
  UserStatusInput: {
    type: 'object',
    required: ['status'],
    properties: { status: { type: 'string', enum: USER_STATUS } },
  },
  Category: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string', maxLength: 40 },
      status: { type: 'string', enum: CATEGORY_STATUS },
      articleCount: { type: 'integer', description: 'Artículos asociados' },
    },
  },
  CategoryInput: {
    type: 'object',
    required: ['name'],
    properties: { name: { type: 'string', maxLength: 40, description: 'Único, sin importar tildes ni mayúsculas' } },
  },
  CategoryStatusInput: {
    type: 'object',
    required: ['status'],
    properties: { status: { type: 'string', enum: CATEGORY_STATUS } },
  },
  Item: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', maxLength: 80 },
      category: { type: 'string', description: 'Nombre de la categoría' },
      condition: { type: 'string', enum: CONDITIONS },
      location: { type: 'string', enum: LOCALITIES, description: 'Localidad de entrega' },
      description: { type: 'array', items: { type: 'string' }, description: 'Párrafos' },
      images: { type: 'array', items: { type: 'string' }, description: 'En la lista GET /items solo viene la portada' },
      image: { type: 'string', description: 'Portada (primera imagen)' },
      status: { type: 'string', enum: ITEM_STATUS },
      createdAt: { type: 'string', format: 'date-time', description: 'Hora de Bogotá (-05:00)' },
      owner: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          location: { type: 'string', example: 'Chapinero, Bogotá' },
          photo: { type: 'string', nullable: true },
        },
      },
      mine: { type: 'boolean', description: 'true si el artículo es del usuario con sesión' },
    },
  },
  ItemInput: {
    type: 'object',
    required: ['title', 'category', 'condition', 'description', 'location', 'photo'],
    properties: {
      title: { type: 'string', maxLength: 80 },
      category: { type: 'string', description: 'Nombre de una categoría activa' },
      condition: { type: 'string', enum: CONDITIONS },
      description: {
        type: 'string',
        minLength: 20,
        description: 'Mínimo 20 caracteres. Los párrafos se separan con una línea en blanco (también acepta un arreglo de párrafos).',
      },
      location: { type: 'string', enum: LOCALITIES },
      photo: {
        type: 'string',
        description: 'Data URL JPG/PNG de máximo 5 MB. Al editar, enviar la URL de la imagen actual la conserva.',
      },
    },
  },
  ItemStatusInput: {
    type: 'object',
    required: ['status'],
    properties: { status: { type: 'string', enum: ['Disponible', 'Inactivo'] } },
  },
  Contact: {
    type: 'object',
    description: 'Datos del dueño. Solo se incluyen cuando la solicitud fue aceptada.',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
      location: { type: 'string' },
      instagram: { type: 'string' },
      photo: { type: 'string', nullable: true },
      memberSince: { type: 'string', format: 'date' },
    },
  },
  MyRequest: {
    type: 'object',
    description: 'Solicitud hecha por el usuario con sesión',
    properties: {
      id: { type: 'string' },
      itemId: { type: 'string' },
      title: { type: 'string', description: 'Título del artículo pedido' },
      image: { type: 'string', nullable: true },
      type: { type: 'string', enum: REQUEST_TYPES },
      counterpart: { type: 'string', description: 'Nombre del dueño del artículo' },
      date: { type: 'string', format: 'date' },
      status: { type: 'string', enum: REQUEST_STATUS },
      note: { type: 'string', description: 'Texto de ayuda según el estado' },
      message: { type: 'string' },
      offeredTitle: { type: 'string', nullable: true, description: 'En intercambios: título del artículo ofrecido' },
      acceptedAt: { type: 'string', format: 'date', description: 'Solo si status = Aceptada' },
      contact: ref('Contact'),
    },
  },
  RequestInput: {
    type: 'object',
    required: ['itemId', 'type', 'message'],
    properties: {
      itemId: { type: 'string', description: 'Artículo que se pide (debe estar Disponible y no ser propio)' },
      type: { type: 'string', enum: REQUEST_TYPES },
      offeredItemId: { type: 'string', description: 'Solo en Intercambio: una publicación propia Disponible' },
      message: { type: 'string', minLength: 10 },
    },
  },
  ReceivedRequest: {
    type: 'object',
    description: 'Solicitud recibida sobre una publicación propia',
    properties: {
      id: { type: 'string' },
      itemId: { type: 'string' },
      itemTitle: { type: 'string' },
      requester: {
        type: 'object',
        properties: { id: { type: 'string' }, name: { type: 'string' }, photo: { type: 'string', nullable: true } },
      },
      type: { type: 'string', enum: REQUEST_TYPES },
      offeredTitle: { type: 'string', nullable: true },
      status: { type: 'string', enum: REQUEST_STATUS },
      message: { type: 'string' },
      date: { type: 'string', format: 'date' },
    },
  },
  RequestStatusInput: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: REQUEST_STATUS,
        description: 'Pendiente → Aceptada o Rechazada. "Pendiente" deshace una aceptada o rechazada.',
      },
    },
  },
  AdminStats: {
    type: 'object',
    properties: {
      activeUsers: { type: 'integer', description: 'Usuarios de la comunidad activos' },
      publishedItems: { type: 'integer', description: 'Artículos publicados (todos los estados)' },
      requestsThisWeek: { type: 'integer', description: 'Solicitudes de los últimos 7 días' },
      activeCategories: { type: 'integer' },
    },
  },
};

// ---------- Respuestas de error reutilizables ----------
const errorResponse = (description, example) => ({ description, content: json(ref('Error'), example) });
const responses = {
  E400: errorResponse('Datos inválidos', {
    message: 'Ingresa un correo válido.',
    errors: { email: 'Ingresa un correo válido.' },
  }),
  E401: errorResponse('Sin sesión o token inválido', { message: 'Debes iniciar sesión para continuar.' }),
  E403: errorResponse('Sin permiso (rol incorrecto, cuenta inactiva o no es el dueño)', {
    message: 'Esta acción es solo para el administrador.',
  }),
  E404: errorResponse('No encontrado', { message: 'No encontramos el recurso solicitado.' }),
  E409: errorResponse('Conflicto con el estado actual o con datos existentes', {
    message: 'Este correo ya está registrado.',
  }),
};

// ---------- Rutas ----------
const paths = {
  '/health': {
    get: {
      tags: ['Salud'],
      summary: 'Ruta de prueba',
      description: 'Confirma que el servidor responde y muestra cuántos registros hay en memoria.',
      responses: { 200: ok('Servidor activo', ref('Health')) },
    },
  },

  // ----- Autenticación -----
  '/auth/register': {
    post: {
      tags: ['Autenticación'],
      summary: 'Registrar usuario',
      description: 'Crea una cuenta con rol "user". La contraseña se guarda cifrada con bcrypt. No inicia sesión: después hay que llamar a /auth/login.',
      requestBody: body(ref('RegisterInput')),
      responses: {
        201: ok('Usuario creado', { type: 'object', properties: { user: ref('User') } }),
        ...errors(400, 409),
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Autenticación'],
      summary: 'Iniciar sesión',
      description: 'Devuelve el usuario y un token JWT. Copia el token y pégalo en el botón **Authorize**.',
      requestBody: bodyExamples(ref('LoginInput'), {
        usuario: { summary: 'Usuaria de la comunidad (Ana)', value: { email: 'ana@correo.com', password: 'Usuario12345' } },
        administrador: { summary: 'Administrador', value: { email: 'admin@secondhand.com', password: 'Admin12345' } },
        inactiva: { summary: 'Cuenta inactiva (403)', value: { email: 'sara@correo.com', password: 'Usuario12345' } },
      }),
      responses: {
        200: ok('Sesión iniciada', ref('LoginResponse'), { user: USER_EXAMPLE, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
        400: { $ref: '#/components/responses/E400' },
        401: errorResponse('Credenciales incorrectas', { message: 'Correo o contraseña incorrectos.' }),
        403: errorResponse('Cuenta inactiva', { message: 'Tu cuenta está inactiva. Contacta al administrador.' }),
      },
    },
  },

  // ----- Usuarios -----
  '/users/me': {
    get: {
      tags: ['Usuarios'],
      summary: 'Mi perfil',
      security: AUTH,
      responses: { 200: ok('Perfil del usuario con sesión', ref('User'), USER_EXAMPLE), ...errors(401, 403) },
    },
    put: {
      tags: ['Usuarios'],
      summary: 'Editar mi perfil',
      security: AUTH,
      requestBody: body(ref('ProfileInput'), {
        name: 'Ana Camila Gómez',
        phone: '300 000 0000',
        location: 'Teusaquillo',
        bio: 'Estudiante de ingeniería. Me gusta darle una segunda vida a las cosas.',
        instagram: '@anacamila',
        photo: PNG,
      }),
      responses: { 200: ok('Perfil actualizado', ref('User')), ...errors(400, 401, 403) },
    },
  },
  '/users': {
    get: {
      tags: ['Usuarios'],
      summary: 'Listar usuarios (administrador)',
      description: 'Usuarios de la comunidad, los más recientes primero, con su número de publicaciones.',
      security: AUTH,
      parameters: [{
        name: 'limit', in: 'query', description: 'Máximo de resultados (opcional)',
        schema: { type: 'integer', minimum: 1 }, example: 7,
      }],
      responses: { 200: ok('Lista de usuarios', arrayOf('AdminUser'), [ADMIN_USER_EXAMPLE]), ...errors(401, 403) },
    },
  },
  '/users/{id}/status': {
    patch: {
      tags: ['Usuarios'],
      summary: 'Activar o inactivar un usuario (administrador)',
      description: 'Un usuario inactivo no puede iniciar sesión y su token deja de funcionar de inmediato.',
      security: AUTH,
      parameters: [idParam('Id del usuario', 'u3')],
      requestBody: body(ref('UserStatusInput'), { status: 'Activo' }),
      responses: { 200: ok('Usuario actualizado', ref('AdminUser'), ADMIN_USER_EXAMPLE), ...errors(400, 401, 403, 404) },
    },
  },

  // ----- Artículos -----
  '/items': {
    get: {
      tags: ['Artículos'],
      summary: 'Explorar artículos disponibles',
      description: 'Público. Solo devuelve artículos "Disponible". Si se envía token, "mine" marca los propios. '
        + 'El total sin paginar va en el encabezado **X-Total-Count**.',
      security: OPTIONAL_AUTH,
      parameters: [
        { name: 'q', in: 'query', description: 'Busca en título y descripción (sin importar tildes)', schema: { type: 'string' }, example: 'calculo' },
        { name: 'category', in: 'query', description: 'Nombre de la categoría', schema: { type: 'string' } },
        {
          name: 'condition', in: 'query', description: 'Uno o varios estados',
          schema: { type: 'array', items: { type: 'string', enum: CONDITIONS } }, style: 'form', explode: true,
        },
        { name: 'location', in: 'query', description: 'Localidad', schema: { type: 'string', enum: LOCALITIES } },
        { name: 'sort', in: 'query', schema: { type: 'string', enum: ['recent', 'oldest', 'title'], default: 'recent' } },
        { name: 'limit', in: 'query', description: 'Resultados por página (máx. 100). Sin limit devuelve todos.', schema: { type: 'integer', minimum: 1, maximum: 100 } },
        { name: 'page', in: 'query', description: 'Página (empieza en 1). Se usa junto con limit.', schema: { type: 'integer', minimum: 1, default: 1 } },
      ],
      responses: {
        200: {
          description: 'Lista de artículos',
          headers: { 'X-Total-Count': { description: 'Total de resultados sin paginar', schema: { type: 'integer' } } },
          content: json(arrayOf('Item'), [ITEM_EXAMPLE]),
        },
        ...errors(400),
      },
    },
    post: {
      tags: ['Artículos'],
      summary: 'Publicar artículo',
      description: 'Solo usuarios de la comunidad. La publicación queda "Disponible".',
      security: AUTH,
      requestBody: body(ref('ItemInput'), {
        title: 'Diccionario inglés-español Oxford',
        category: 'Libros',
        condition: 'Como nuevo',
        description: 'Diccionario de bolsillo, casi sin uso.\n\nIdeal para el curso de inglés.',
        location: 'Chapinero',
        photo: PNG,
      }),
      responses: { 201: ok('Artículo publicado', ref('Item')), ...errors(400, 401, 403) },
    },
  },
  '/items/mine': {
    get: {
      tags: ['Artículos'],
      summary: 'Mis publicaciones',
      description: 'Todas mis publicaciones en cualquier estado, las más recientes primero.',
      security: AUTH,
      responses: { 200: ok('Mis artículos', arrayOf('Item')), ...errors(401, 403) },
    },
  },
  '/items/{id}': {
    get: {
      tags: ['Artículos'],
      summary: 'Detalle de un artículo',
      description: 'Público. Una publicación "Inactivo" solo la ven su dueño y el administrador.',
      security: OPTIONAL_AUTH,
      parameters: [idParam('Id del artículo', '1')],
      responses: { 200: ok('Artículo', ref('Item'), ITEM_EXAMPLE), ...errors(404) },
    },
    put: {
      tags: ['Artículos'],
      summary: 'Editar mi publicación',
      description: 'Solo el dueño. No se puede editar una publicación "Entregado".',
      security: AUTH,
      parameters: [idParam('Id del artículo (m1 es de Ana en los datos de prueba)', 'm1')],
      requestBody: body(ref('ItemInput'), {
        title: 'Cálculo de una variable, Stewart (7.ª edición)',
        category: 'Libros',
        condition: 'Usado',
        description: 'Artículo en buen estado, listo para entregar a quien lo necesite.',
        location: 'Chapinero',
        photo: '/images/items/calculo.jpg',
      }),
      responses: { 200: ok('Artículo actualizado', ref('Item')), ...errors(400, 401, 403, 404, 409) },
    },
  },
  '/items/{id}/status': {
    patch: {
      tags: ['Artículos'],
      summary: 'Activar o inactivar mi publicación',
      description: 'Solo el dueño, entre "Disponible" e "Inactivo". Las publicaciones "En proceso" o "Entregado" no se pueden cambiar.',
      security: AUTH,
      parameters: [idParam('Id del artículo (m2 de Ana, inactivo)', 'm2')],
      requestBody: body(ref('ItemStatusInput'), { status: 'Disponible' }),
      responses: { 200: ok('Artículo actualizado', ref('Item')), ...errors(400, 401, 403, 404, 409) },
    },
  },

  // ----- Solicitudes -----
  '/requests': {
    get: {
      tags: ['Solicitudes'],
      summary: 'Mis solicitudes',
      description: 'Solicitudes que hizo el usuario con sesión. Las aceptadas incluyen los datos de contacto del dueño.',
      security: AUTH,
      responses: { 200: ok('Mis solicitudes', arrayOf('MyRequest'), [MY_REQUEST_EXAMPLE]), ...errors(401, 403) },
    },
    post: {
      tags: ['Solicitudes'],
      summary: 'Solicitar un artículo',
      description: 'Donación o intercambio. No se puede pedir un artículo propio, uno que no esté disponible, '
        + 'ni repetir una solicitud pendiente.',
      security: AUTH,
      requestBody: bodyExamples(ref('RequestInput'), {
        donacion: {
          summary: 'Donación',
          value: {
            itemId: '3',
            type: 'Donación',
            message: 'Hola, me serviría mucho para mis clases de estadística.',
          },
        },
        intercambio: {
          summary: 'Intercambio (Ana ofrece su chaqueta)',
          value: {
            itemId: '8',
            type: 'Intercambio',
            offeredItemId: 'm4',
            message: 'Te ofrezco mi chaqueta impermeable a cambio del libro.',
          },
        },
      }),
      responses: { 201: ok('Solicitud creada (Pendiente)', ref('MyRequest')), ...errors(400, 401, 403, 404, 409) },
    },
  },
  '/requests/received': {
    get: {
      tags: ['Solicitudes'],
      summary: 'Solicitudes recibidas',
      description: 'Solicitudes que otros usuarios hicieron sobre mis publicaciones.',
      security: AUTH,
      responses: { 200: ok('Solicitudes recibidas', arrayOf('ReceivedRequest'), [RECEIVED_EXAMPLE]), ...errors(401, 403) },
    },
  },
  '/requests/{id}': {
    get: {
      tags: ['Solicitudes'],
      summary: 'Detalle de una de mis solicitudes',
      security: AUTH,
      parameters: [idParam('Id de la solicitud', '2')],
      responses: { 200: ok('Solicitud', ref('MyRequest'), MY_REQUEST_EXAMPLE), ...errors(401, 403, 404) },
    },
    patch: {
      tags: ['Solicitudes'],
      summary: 'Responder una solicitud recibida',
      description: 'Solo el dueño del artículo. Aceptar pasa la publicación a "En proceso" (solo si está "Disponible"); '
        + 'deshacer una aceptada (status "Pendiente") la devuelve a "Disponible".',
      security: AUTH,
      parameters: [idParam('Id de la solicitud recibida', 'rr1')],
      requestBody: body(ref('RequestStatusInput'), { status: 'Aceptada' }),
      responses: { 200: ok('Solicitud actualizada', ref('ReceivedRequest')), ...errors(400, 401, 403, 404, 409) },
    },
    delete: {
      tags: ['Solicitudes'],
      summary: 'Eliminar una solicitud recibida rechazada',
      description: 'La quita de mi lista de recibidas. Quien la hizo la sigue viendo como "Rechazada".',
      security: AUTH,
      parameters: [idParam('Id de la solicitud recibida (rechazada)', 'rr2')],
      responses: { 204: { description: 'Eliminada' }, ...errors(401, 403, 404, 409) },
    },
  },

  // ----- Categorías -----
  '/categories': {
    get: {
      tags: ['Categorías'],
      summary: 'Listar categorías',
      description: 'Público. Con ?status=Activa devuelve solo las que se pueden usar para publicar y filtrar.',
      parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: CATEGORY_STATUS } }],
      responses: { 200: ok('Categorías', arrayOf('Category'), [CATEGORY_EXAMPLE]), ...errors(400) },
    },
    post: {
      tags: ['Categorías'],
      summary: 'Crear categoría (administrador)',
      security: AUTH,
      requestBody: body(ref('CategoryInput'), { name: 'Electrónica' }),
      responses: { 201: ok('Categoría creada (Activa)', ref('Category')), ...errors(400, 401, 403, 409) },
    },
  },
  '/categories/{id}': {
    put: {
      tags: ['Categorías'],
      summary: 'Renombrar categoría (administrador)',
      description: 'El nuevo nombre se refleja en todos los artículos de la categoría.',
      security: AUTH,
      parameters: [idParam('Id de la categoría', 'c4')],
      requestBody: body(ref('CategoryInput'), { name: 'Muebles y decoración' }),
      responses: { 200: ok('Categoría actualizada', ref('Category')), ...errors(400, 401, 403, 404, 409) },
    },
  },
  '/categories/{id}/status': {
    patch: {
      tags: ['Categorías'],
      summary: 'Activar o inactivar categoría (administrador)',
      security: AUTH,
      parameters: [idParam('Id de la categoría (Instrumentos musicales, inactiva)', 'c5')],
      requestBody: body(ref('CategoryStatusInput'), { status: 'Activa' }),
      responses: { 200: ok('Categoría actualizada', ref('Category')), ...errors(400, 401, 403, 404) },
    },
  },

  // ----- Administración -----
  '/admin/stats': {
    get: {
      tags: ['Administración'],
      summary: 'Indicadores del panel (administrador)',
      security: AUTH,
      responses: {
        200: ok('Indicadores', ref('AdminStats'), { activeUsers: 12, publishedItems: 23, requestsThisWeek: 2, activeCategories: 4 }),
        ...errors(401, 403),
      },
    },
  },
};

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Second Hand API',
    version: '0.1.0',
    description: [
      'API REST de **Second Hand**, la plataforma para donar e intercambiar artículos de segunda mano en Bogotá.',
      '',
      '**Cómo probar las rutas protegidas**',
      '1. Ejecuta `POST /auth/login` con una cuenta de prueba (usa los ejemplos del cuerpo).',
      '2. Copia el `token` de la respuesta.',
      '3. Pulsa **Authorize**, pega el token y confirma.',
      '',
      '**Cuentas de prueba**',
      '- Usuaria: `ana@correo.com` / `Usuario12345`',
      '- Administrador: `admin@secondhand.com` / `Admin12345`',
      '- Todos los usuarios de prueba usan `Usuario12345`. `sara@correo.com` está inactiva.',
      '',
      '**Datos:** por ahora no hay base de datos. Los datos de prueba (los mismos del frontend y con sus mismos ids) '
        + 'se cargan en memoria al iniciar el servidor; los cambios se pierden al reiniciarlo.',
      '',
      'Los errores siempre tienen la forma `{ "message": "...", "errors": { "campo": "..." } }`.',
    ].join('\n'),
  },
  servers: [{ url: '/api', description: 'Este servidor' }],
  tags: [
    { name: 'Salud', description: 'Ruta de prueba' },
    { name: 'Autenticación', description: 'Registro e inicio de sesión (JWT)' },
    { name: 'Usuarios', description: 'Perfil y gestión de usuarios' },
    { name: 'Artículos', description: 'Publicar, explorar y gestionar artículos' },
    { name: 'Solicitudes', description: 'Pedir artículos y responder solicitudes' },
    { name: 'Categorías', description: 'Consulta pública y gestión del administrador' },
    { name: 'Administración', description: 'Panel del administrador' },
  ],
  paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtenido en POST /auth/login',
      },
    },
    schemas,
    responses,
  },
};
