# Second Hand — Proyecto Full Stack con React y Express

Plataforma web para **publicar, explorar y solicitar artículos de segunda mano**. Los usuarios publican artículos, los demás los solicitan y el dueño acepta o rechaza cada solicitud. Un administrador gestiona usuarios y categorías.

```
INTERFAZ → REACT + VITE → API REST → EXPRESS → ROUTES → CONTROLLERS → MODELOS → DATOS EN MEMORIA
```

---

## Tabla de contenido

1. [Tecnologías](#1-tecnologías)
2. [Requisitos](#2-requisitos)
3. [Instalación](#3-instalación)
4. [Configuración y variables de entorno](#4-configuración-y-variables-de-entorno)
5. [Ejecución](#5-ejecución)
6. [Endpoints de la API](#6-endpoints-de-la-api)
7. [Estructura del proyecto](#7-estructura-del-proyecto)
8. [Pruebas](#8-pruebas)

---

## 1. Tecnologías

| Capa | Tecnología | Para qué |
|------|-----------|----------|
| Frontend | React 18 | Interfaz basada en componentes |
| | React Router 6 | Navegación entre páginas |
| | Bootstrap 5 | Estilos y componentes visuales |
| | Vite 5 | Servidor de desarrollo y compilación |
| Backend | Node.js ≥ 20.19 | Entorno de ejecución |
| | Express 5 | Servidor HTTP y rutas |
| | jsonwebtoken · bcrypt | Autenticación con JWT y contraseñas cifradas |
| | cors · swagger-ui-express | CORS y documentación de la API |
| Persistencia | En memoria | Datos de prueba cargados al iniciar (sin base de datos por ahora) |

## 2. Requisitos

- **Node.js 20.19 o superior** → `node -v`
- **npm 10 o superior** → `npm -v`
- Un editor (recomendado **Visual Studio Code**) y un navegador moderno.
- *(Opcional)* La extensión REST Client o Thunder Client para probar la API.

## 3. Instalación

```bash
# 1. Clona el repositorio y entra en la carpeta
git clone https://github.com/VictorM-git/Second-Hand-Backend.git
cd Second-Hand-Backend

# 2. Dependencias del backend
cd backend
npm install

# 3. Dependencias del frontend
cd ../frontend
npm install
```

## 4. Configuración y variables de entorno

Cada proyecto lee **su propio** archivo `.env`. Crea las copias a partir de las plantillas:

```bash
# macOS / Linux / Git Bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Windows PowerShell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

### `backend/.env`

| Variable | Obligatoria | Valor por defecto | Descripción |
|----------|:-----------:|-------------------|-------------|
| `PORT` | No | `3000` | Puerto de la API |
| `JWT_SECRET` | **Sí** | — | Clave para firmar los tokens JWT |
| `JWT_EXPIRES_IN` | No | `1d` | Duración de los tokens |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Origen(es) del frontend autorizados, separados por coma |
| `SEED_ADMIN_PASSWORD` | No | `Admin12345` | Contraseña de la cuenta administradora de prueba |
| `SEED_USER_PASSWORD` | No | `Usuario12345` | Contraseña de las cuentas de usuario de prueba |

### `frontend/.env`

| Variable | Obligatoria | Valor por defecto | Descripción |
|----------|:-----------:|-------------------|-------------|
| `VITE_API_URL` | No | `http://localhost:3000/api` | URL base de la API |

> **Seguridad:** los archivos `.env` están en `.gitignore` y **nunca** deben subirse al repositorio. Las variables `VITE_*` terminan en el navegador, así que son públicas: no pongas secretos en ellas.

## 5. Ejecución

Necesitas **dos terminales**.

```bash
# Terminal 1 — API
cd backend
npm run dev          # http://localhost:3000/api  ·  Swagger en http://localhost:3000/api/docs

# Terminal 2 — Interfaz
cd frontend
npm run dev          # http://localhost:5173
```

Abre **http://localhost:5173**.

### Cuentas de prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `admin@secondhand.com` | valor de `SEED_ADMIN_PASSWORD` |
| Usuario | `ana@correo.com` | valor de `SEED_USER_PASSWORD` |

### Scripts disponibles

| Proyecto | Script | Qué hace |
|----------|--------|----------|
| backend | `npm run dev` | Inicia la API con recarga automática (`node --watch`) |
| backend | `npm start` | Inicia la API |
| frontend | `npm run dev` | Servidor de desarrollo de Vite |
| frontend | `npm run build` | Genera la versión de producción en `dist/` |
| frontend | `npm run preview` | Sirve la versión de producción |

## 6. Endpoints de la API

URL base: `http://localhost:3000/api` · Documentación interactiva: `http://localhost:3000/api/docs`

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/health` | Estado de la API | Público |
| POST | `/auth/register` | Crea una cuenta | Público |
| POST | `/auth/login` | Inicia sesión y devuelve el token | Público |
| GET | `/users/me` | Perfil del usuario actual | Autenticado |
| PUT | `/users/me` | Actualiza el perfil | Autenticado |
| GET | `/users` | Lista los usuarios | Admin |
| PATCH | `/users/:id/status` | Activa o bloquea un usuario | Admin |
| GET | `/items` | Lista y filtra artículos | Público |
| GET | `/items/mine` | Mis publicaciones | Usuario |
| GET | `/items/:id` | Detalle de un artículo | Público |
| POST | `/items` | Publica un artículo | Usuario |
| PUT | `/items/:id` | Edita un artículo | Usuario |
| PATCH | `/items/:id/status` | Cambia el estado de un artículo | Usuario |
| GET | `/requests` | Mis solicitudes | Usuario |
| POST | `/requests` | Solicita un artículo | Usuario |
| GET | `/requests/received` | Solicitudes recibidas | Usuario |
| GET | `/requests/:id` | Detalle de una solicitud | Usuario |
| PATCH | `/requests/:id` | Acepta o rechaza una solicitud | Usuario |
| DELETE | `/requests/:id` | Elimina una solicitud recibida | Usuario |
| GET | `/categories` | Lista las categorías | Público |
| POST | `/categories` | Crea una categoría | Admin |
| PUT | `/categories/:id` | Edita una categoría | Admin |
| PATCH | `/categories/:id/status` | Activa o desactiva una categoría | Admin |
| GET | `/admin/stats` | Estadísticas del panel | Admin |

Las rutas protegidas requieren el encabezado `Authorization: Bearer <token>`.

## 7. Estructura del proyecto

```
Second-Hand/
├── backend/
│   ├── pruebas/
│   │   └── api.http                 # Pruebas para REST Client (VS Code)
│   ├── src/
│   │   ├── config/env.js            # Lee y valida las variables de entorno
│   │   ├── controllers/             # admin, auth, categories, items, requests, users
│   │   ├── data/seed.js             # Datos de prueba cargados al iniciar
│   │   ├── docs/openapi.js          # Documentación Swagger
│   │   ├── middlewares/             # auth (JWT y roles), errors, logger
│   │   ├── models/                  # User, Item, Request, Category
│   │   ├── routes/                  # Una ruta por recurso
│   │   ├── utils/                   # HttpError, fechas, serializadores…
│   │   ├── constants.js
│   │   ├── app.js                   # Configuración de Express
│   │   └── server.js                # Punto de entrada
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/images/               # Imágenes de los artículos
│   ├── src/
│   │   ├── assets/                  # Logos
│   │   ├── components/              # Componentes reutilizables por sección
│   │   ├── context/AuthContext.jsx  # Sesión del usuario
│   │   ├── data/                    # Datos de prueba
│   │   ├── hooks/                   # Hooks personalizados
│   │   ├── pages/                   # Una página por ruta
│   │   ├── services/                # Llamadas a la API
│   │   ├── styles/                  # CSS global y por sección
│   │   ├── utils/                   # Formato, imágenes, validaciones
│   │   ├── App.jsx · main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .vscode/extensions.json          # Extensiones recomendadas
├── .env.example                     # Referencia de todas las variables
├── .gitignore
└── README.md
```

## 8. Pruebas

Con la API encendida:

- **REST Client (VS Code):** abre `backend/pruebas/api.http` y pulsa *Send Request* sobre cada petición.
- **Swagger:** abre `http://localhost:3000/api/docs` y prueba cada endpoint desde el navegador.
- **curl:**
  ```bash
  curl http://localhost:3000/api/health
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@secondhand.com","password":"Admin12345"}'
  ```
