# Second Hand · Backend (API REST)

API REST de **Second Hand**, la plataforma para donar e intercambiar artículos de segunda mano en Bogotá.
Atiende al frontend en React de Second Hand, que está en otro repositorio, y se ejecuta **por separado**, en su propia carpeta y puerto.

**Tecnologías:** Node.js · Express 5 · JWT (jsonwebtoken) · bcrypt · CORS · Swagger UI.

> **Todavía no hay base de datos.** Los datos viven en memoria, en arreglos dentro de cada modelo (`src/models/`).
> Al iniciar el servidor se cargan los datos de prueba del frontend, y los cambios se pierden al reiniciarlo.

---

## 1. Requisitos

- **Node.js 20.19 o superior** (`node -v`).

No se necesita instalar nada más.

## 2. Instalación

```bash
git clone https://github.com/VictorM-git/Second-Hand-Backend.git
cd Second-Hand-Backend
npm install
```

Crea el archivo `.env` a partir del ejemplo y revisa los valores:

```bash
cp .env.example .env             # Git Bash / macOS / Linux
Copy-Item .env.example .env      # PowerShell
```

| Variable | Para qué sirve | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `JWT_SECRET` | Clave para firmar los tokens. Larga y aleatoria | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_EXPIRES_IN` | Duración del token | `1d` |
| `CORS_ORIGIN` | Frontend autorizado (varios, separados por coma) | `http://localhost:5173` |
| `SEED_ADMIN_PASSWORD` | Contraseña del administrador de prueba | `Admin12345` |
| `SEED_USER_PASSWORD` | Contraseña de los usuarios de prueba | `Usuario12345` |

> El `.env` tiene claves y **no se sube al repositorio** (está en `.gitignore`). Solo se sube `.env.example`.

## 3. Ejecutar

```bash
npm run dev    # inicia la API y se reinicia sola al guardar cambios
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Desarrollo: `node --watch src/server.js` |
| `npm start` | Producción: `node src/server.js` |

Al iniciar, la terminal muestra:

```
Datos de prueba en memoria: 15 usuarios, 5 categorías, 23 artículos, 6 solicitudes
API escuchando en http://localhost:3000/api
Documentación Swagger en http://localhost:3000/api/docs
```

### Backend y frontend por separado

Son dos proyectos independientes, cada uno con su `package.json`. Se usan dos terminales:

```bash
# Terminal 1 — en la carpeta del backend (puerto 3000)
npm run dev

# Terminal 2 — en la carpeta del frontend (puerto 5173)
npm run dev
```

El backend funciona aunque el frontend esté apagado (se prueba con Swagger o REST Client), y el frontend funciona sin el backend porque por ahora usa sus propios datos de prueba.

## 4. Datos de prueba

Al arrancar, el servidor carga en memoria los mismos datos que muestra el frontend (su carpeta `src/data/`), **con los mismos ids**:

| Datos | Ids |
|---|---|
| 5 categorías (Instrumentos musicales está inactiva) | `c1` … `c5` |
| Administrador, Ana Camila Gómez y 9 usuarios registrados | `a1`, `u0`, `u1` … `u9` |
| 4 dueños de los artículos de Explorar | `o1` … `o4` |
| 18 artículos de Explorar y 5 publicaciones de Ana | `1` … `18`, `m1` … `m5` |
| 3 solicitudes hechas por Ana y 3 recibidas | `1` … `3`, `rr1` … `rr3` |

| Cuenta | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@secondhand.com` | `Admin12345` |
| Usuaria principal | `ana@correo.com` | `Usuario12345` |
| Cuenta inactiva (para probar el 403) | `sara@correo.com` | `Usuario12345` |

Todos los usuarios de prueba usan `Usuario12345`. Los registros nuevos reciben un id aleatorio. **Para volver al estado inicial, reinicia el servidor.**

## 5. Arquitectura

Cada petición recorre estas capas:

```
Cliente (React / Swagger / REST Client)
  → app.js        CORS, lectura de JSON, registro de peticiones
  → routes/       qué controlador atiende cada método + ruta
  → middlewares/  requireAuth (JWT), requireRole (user / admin)
  → controllers/  valida los datos y aplica las reglas del negocio
  → models/       guardan y consultan los datos (por ahora, arreglos en memoria)
```

```
backend/
├── src/
│   ├── server.js            punto de entrada: carga los datos de prueba y abre el puerto
│   ├── app.js               configuración de Express (middlewares, rutas, Swagger, errores)
│   ├── constants.js         estados, condiciones y localidades permitidas
│   ├── config/env.js        variables de entorno
│   ├── routes/              una ruta por recurso (auth, users, items, requests, categories, admin)
│   ├── controllers/         lógica de cada endpoint
│   ├── models/              User, Item, Request, Category y collection.js (almacenamiento en memoria)
│   ├── middlewares/         auth.js (JWT y roles), errors.js, logger.js
│   ├── utils/               errores HTTP, formato de respuestas, fechas y textos
│   ├── data/seed.js         datos de prueba que se cargan al iniciar
│   └── docs/openapi.js      documentación OpenAPI que muestra Swagger
├── requests.http            pruebas para REST Client
├── .env.example
└── package.json
```

**Modelos**

| Modelo | Campos principales |
|---|---|
| `User` | id, name, email (único), password (hash bcrypt), phone, location, bio, photo, instagram, role (`user`/`admin`), status (`Activo`/`Inactivo`) |
| `Category` | id, name (único sin importar tildes ni mayúsculas), status (`Activa`/`Inactiva`) |
| `Item` | id, title, categoryId, condition, location, description (párrafos), images, status, ownerId |
| `Request` | id, itemId, requesterId, ownerId, type (`Donación`/`Intercambio`), offeredItemId, offeredTitle, message, status, acceptedAt |

Los controladores leen y guardan datos solo a través de las funciones de los modelos (`find`, `findById`, `create`, `update`…). El almacenamiento en memoria está en `src/models/collection.js`.

## 6. Endpoints

Todas las rutas empiezan por `/api`. **Acceso:** público, **usuario** (rol `user` con token), **admin** (rol `admin` con token).

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/health` | público | Ruta de prueba: estado del servidor y cantidad de datos cargados |
| POST | `/auth/register` | público | Registrar usuario |
| POST | `/auth/login` | público | Iniciar sesión, devuelve `{ user, token }` |
| GET | `/users/me` | con token | Mi perfil y mis indicadores |
| PUT | `/users/me` | con token | Editar mi perfil |
| GET | `/users?limit=` | admin | Usuarios de la comunidad |
| PATCH | `/users/:id/status` | admin | Activar o inactivar un usuario |
| GET | `/items` | público | Explorar: `q`, `category`, `condition`, `location`, `sort`, `limit`, `page` |
| GET | `/items/mine` | usuario | Mis publicaciones |
| GET | `/items/:id` | público | Detalle de un artículo |
| POST | `/items` | usuario | Publicar artículo |
| PUT | `/items/:id` | usuario (dueño) | Editar mi publicación |
| PATCH | `/items/:id/status` | usuario (dueño) | Activar o inactivar mi publicación |
| GET | `/requests` | usuario | Mis solicitudes |
| GET | `/requests/:id` | usuario | Detalle de una de mis solicitudes |
| POST | `/requests` | usuario | Solicitar un artículo (donación o intercambio) |
| GET | `/requests/received` | usuario | Solicitudes recibidas sobre mis publicaciones |
| PATCH | `/requests/:id` | usuario (dueño del artículo) | Aceptar, rechazar o deshacer |
| DELETE | `/requests/:id` | usuario (dueño del artículo) | Eliminar una solicitud recibida rechazada |
| GET | `/categories?status=` | público | Categorías con su número de artículos |
| POST | `/categories` | admin | Crear categoría |
| PUT | `/categories/:id` | admin | Renombrar categoría |
| PATCH | `/categories/:id/status` | admin | Activar o inactivar categoría |
| GET | `/admin/stats` | admin | Indicadores del panel |

Las rutas protegidas usan el encabezado `Authorization: Bearer <token>`.

**Códigos de estado**

| Código | Cuándo |
|---|---|
| 200 / 201 / 204 | Correcto / creado / eliminado |
| 400 | Datos inválidos (incluye el error de cada campo) |
| 401 | Sin token, o token inválido o vencido |
| 403 | Rol incorrecto, cuenta inactiva o recurso de otro usuario |
| 404 | No existe |
| 409 | Conflicto: correo o categoría repetidos, o un estado que no permite la acción |
| 413 | Cuerpo demasiado grande (imagen muy pesada) |

Todos los errores tienen la misma forma:

```json
{ "message": "Ingresa un correo válido.", "errors": { "email": "Ingresa un correo válido." } }
```

## 7. Documentación con Swagger

Con el servidor encendido:

- **Swagger UI:** http://localhost:3000/api/docs (también se llega desde http://localhost:3000).
- **OpenAPI en JSON:** http://localhost:3000/api/docs.json (se puede importar en Postman o Thunder Client).

Para probar rutas protegidas en Swagger:

1. Abre `POST /auth/login` → **Try it out** → elige un ejemplo (usuaria o administrador) → **Execute**.
2. Copia el `token` de la respuesta.
3. Pulsa **Authorize** (arriba a la derecha), pega el token y confirma.

## 8. Cómo probar

1. **Ruta de prueba:** abre http://localhost:3000/api/health. Debe responder `{"status":"ok","storage":"memoria","data":{"users":15,...}}`.
2. **Swagger:** recorre cada sección con **Try it out** (sección 7).
3. **REST Client (VS Code):** instala la extensión *REST Client*, abre `requests.http`, ejecuta primero los tres *login* y luego cualquier petición con **Send Request**.
4. **Postman / Thunder Client:** importa `http://localhost:3000/api/docs.json`.
5. **CORS:** con el frontend en http://localhost:5173, abre la consola del navegador y ejecuta:
   ```js
   fetch('http://localhost:3000/api/items').then((r) => r.json()).then(console.log)
   ```
   Desde ese origen responde normalmente. Desde otra página (otro origen), el navegador bloquea la respuesta.
6. **Contraseñas cifradas:** las contraseñas se guardan como hash de bcrypt (`$2b$10$...`) y ninguna respuesta las incluye.
7. **Terminal:** cada petición se registra, por ejemplo `GET /api/items -> 200 (2 ms)`.

## 9. Reglas de negocio

- **Estados de un artículo:** `Disponible` → `En proceso` (al aceptar una solicitud) · `Disponible` ↔ `Inactivo` (lo decide el dueño) · `Entregado` (no se puede editar).
- **Explorar** solo muestra artículos `Disponible`. Un artículo `Inactivo` solo lo ven su dueño y el administrador.
- **Solicitudes:** no se puede pedir un artículo propio ni uno que no esté disponible, ni repetir una solicitud pendiente. En un intercambio se ofrece una publicación propia `Disponible`.
- **Responder solicitudes:** `Pendiente` → `Aceptada` o `Rechazada`, y ambas se pueden deshacer (vuelven a `Pendiente`). Cada artículo admite una sola solicitud aceptada. Solo se eliminan de la lista las rechazadas.
- **Contacto:** los datos del dueño (correo, teléfono, Instagram) solo se entregan cuando la solicitud fue aceptada.
- **Cuentas inactivas:** no pueden iniciar sesión, y su token deja de funcionar de inmediato.
- **Categorías:** el nombre es único sin importar tildes ni mayúsculas. Una categoría inactiva no sirve para publicar.
- **Imágenes:** se envían como data URL en base64 (JPG o PNG): máximo 5 MB la del artículo y 1 MB la del perfil. Las imágenes de los datos de prueba (`/images/items/...`) son las que sirve el frontend desde `public/`.

## 10. Conectar el frontend

Los servicios del frontend (su carpeta `src/services/`) todavía usan datos de prueba. Cada uno indica con un comentario `Futuro:` la ruta de esta API que lo reemplaza. Para conectarlos:

1. Crea un `.env` en la raíz del frontend con `VITE_API_URL=http://localhost:3000/api`.
2. En cada servicio, cambia la lectura de los datos de prueba por `fetch(`${API_URL}/...`)` y envía `Authorization: Bearer <token>` en las rutas protegidas. El token llega en `POST /auth/login`.

Las respuestas usan los mismos nombres de campos y los mismos ids que los datos de prueba del frontend.

## 11. Despliegue (Render)

1. En **Render**, crea un *Web Service* desde este repositorio:
   - Build Command: `npm install`
   - Start Command: `npm start`
2. Configura las variables de entorno: `JWT_SECRET`, `JWT_EXPIRES_IN` y `CORS_ORIGIN` con la URL pública del frontend (por ejemplo, la de Vercel). `PORT` lo asigna Render.

Railway funciona igual: comando `npm start` y las mismas variables. Mientras no haya base de datos, cada reinicio del servicio vuelve a los datos de prueba.

## 12. Fuera del alcance

- **Base de datos:** se agregará más adelante. Habrá que reemplazar los modelos (`src/models/`) y ajustar las consultas de los controladores; las rutas, los middlewares y la documentación no cambian.
- **Recuperar contraseña:** requiere enviar correos, que no hace parte de este backend. El frontend mantiene su simulación.
- **Calificación de usuarios:** no hay un requisito que la defina.
- **Marcar un artículo como `Entregado`:** el frontend no tiene esa acción. Ese estado solo existe en los datos de prueba.
