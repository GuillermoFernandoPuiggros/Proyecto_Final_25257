// ...existing code...
# Proyecto Final - API REST (Backend)

Resumen
-------
API REST para la gestión de productos desarrollada como proyecto final del curso de Backend. La aplicación expone endpoints CRUD sobre una colección `products` alojada en Firestore y contempla autenticación/autorización (JWT) para operaciones protegidas.

Tecnologías
----------
- Node.js (ES Modules)
- Express
- Firebase Firestore (Cloud)
- dotenv
- jsonwebtoken
- body-parser, cors

Requisitos
---------
- Node.js >= 18
- npm
- Cuenta y proyecto en Firebase con Firestore habilitado

Instalación
-----------
1. Clonar el repositorio:
   ```
   git clone <repo-url>
   cd "d:\OneDrive\Back-End\Curso Back-End\Proyecto-Final"
   ```
2. Instalar dependencias:
   ```
   npm install
   ```
3. Crear archivo `.env` en la raíz con las variables (ejemplo abajo).
4. Iniciar servidor:
   ```
   npm run start
   ```

Variables de entorno (.env)
---------------------------
Ejemplo mínimo (usar valores reales de tu proyecto Firebase y un secreto seguro para JWT):
```
PORT=3000
JWT_SECRET=tu_secreto_seguro
FIREBASE_API_KEY=AIza... 
FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=1:...:web:...
```

Estructura del proyecto
-----------------------
- index.js                -> Punto de entrada (arranca app)
- src/app.js              -> Configuración de Express (middlewares, rutas)
- src/data/data.js        -> Inicialización Firebase / Firestore (usa .env)
- src/routes/             -> Definición de rutas (products, auth, users, ...)
- src/controller/         -> Controladores (lógica de respuesta)
- src/services/           -> Servicios (lógica de negocio)
- src/models/             -> Modelos / interacción con Firestore
- src/validators/         -> Middlewares de validación de payloads
- src/jwt/                -> Lógica JWT (generación, verificación, roles)
- src/scripts/            -> Scripts auxiliares (seed, etc.)
- package.json

Colecciones y campos (conveciones)
---------------------------------
- Colección `products`:
  - id (Firestore id)
  - categoria
  - descripcion
  - id_int
  - nombre
  - precio (número)
  - stock (número)
- Colección `users`:
  - id (Firestore id)
  - email
  - experiencia
  - nombre
  - password (hasheada)
  - rol (por ejemplo: admin | user)
  - ubicacion

Endpoints principales
---------------------
- GET  /api/products
  - Devuelve todos los productos.
- GET  /api/products/:id
  - Devuelve producto por id.
- POST /api/products/create
  - Crea producto (protegida: requiere token + rol `admin`).
  - Body JSON: { nombre, precio, stock, categoria, descripcion, id_int }
- PUT  /api/products/:id
  - Actualiza producto (protegida: admin).
- DELETE /api/products/:id
  - Elimina producto (protegida: admin).
- POST /auth/login
  - Autenticación de usuario → devuelve Bearer token (implementación en auth.routes.js).

Ejemplos rápidos (curl)
-----------------------
Crear:
```
curl -X POST http://localhost:3000/api/products/create \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer <TOKEN>" \
 -d '{"nombre":"Camiseta","precio":1999,"stock":30,"categoria":"indumentaria"}'
```

Listar:
```
curl http://localhost:3000/api/products
```

Actualizar:
```
curl -X PUT http://localhost:3000/api/products/<ID> \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer <TOKEN>" \
 -d '{"precio":2500}'
```

Delete:
```
curl -X DELETE http://localhost:3000/api/products/<ID> \
 -H "Authorization: Bearer <TOKEN>"
```

Pruebas con Insomnia / Postman
------------------------------
- Crear un Workspace.
- Usar `http://localhost:3000` como base URL.
- Añadir headers `Content-Type: application/json`.
- Para endpoints protegidos añadir header `Authorization: Bearer <TOKEN>`.

Seed de datos (opcional)
------------------------
Hay un script sugerido en `src/scripts/seedProducts.js` para crear datos de ejemplo. Ejecutar:
```
node src/scripts/seedProducts.js
```
Asegurarse de que `src/data/data.js` esté correctamente configurado con las variables de entorno.

Seguridad y buenas prácticas
----------------------------
- En producción, no usar reglas de Firestore abiertas. Configurar reglas y Firebase Admin si corresponde.
- Guardar `JWT_SECRET` seguro y nunca en el repositorio.
- Hashear contraseñas con bcrypt antes de guardarlas.
- Validar todos los inputs en `src/validators` para evitar datos inválidos.

Despliegue
----------
- Variables de entorno en el entorno de ejecución (Heroku, Vercel, Cloud Run).
- Considerar uso de Firebase Admin SDK en backend para verificación de tokens y tareas administradas.

Contribución
------------
- Mantener convenciones de carpetas.
- Documentar nuevas rutas en README y actualizar ejemplos.
- Abrir issues y pull requests para mejoras.

Licencia
--------
Proyecto con fines educativos. Adaptar licencia según necesidad.

Contacto
--------
Autor: Guillermo Fernando Puiggros

// ...existing code...
