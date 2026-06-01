# US-REV-005 — Respuesta del administrador a reseñas · Registro de cambios

Implementación de la respuesta oficial de la tienda a reseñas de producto.

## Modelo de admin adoptado

El administrador **es un `ClientUser`** marcado como tal en una **tabla aparte (`Admin`)**:
la existencia de una fila con `admin = true` para ese `clientUserId` habilita responder reseñas.
El admin se autentica con su sesión normal (JWT por cookie), no con API key.

```
Cliente normal  → JWT → ve y vota reseñas
Cliente admin   → JWT + fila Admin(admin=true) → además responde/edita/elimina respuestas
Visitante       → ve reseñas y respuestas (público, sin login)
```

---

## Base de datos — `backend/prisma/schema.prisma`

### Tabla nueva `Admin` (`admins`)
| Campo | Tipo | Nota |
|---|---|---|
| `id` | BigInt PK | |
| `clientUserId` | BigInt **UNIQUE**, FK → `ClientUser` | un usuario = a lo sumo una fila admin |
| `admin` | Boolean `@default(true)` | flag que habilita responder |
| `createdAt` | DateTime | |

### Tabla nueva `ReviewResponse` (`review_responses`)
| Campo | Tipo | Nota |
|---|---|---|
| `id` | BigInt PK | |
| `reviewId` | BigInt **UNIQUE**, FK → `Review` (`onDelete: Cascade`) | **0:1** → una sola respuesta por reseña; se borra en cascada con la reseña |
| `adminUserId` | BigInt, FK → `ClientUser` | enlaza al cliente-admin autor |
| `content` | Text | texto de la respuesta (1–500 validado en backend) |
| `createdAt` / `updatedAt` | DateTime | `edited` se deriva comparando ambas fechas |

### Relaciones añadidas en modelos existentes
- `ClientUser`: `admin Admin?`, `reviewResponses ReviewResponse[]`.
- `Review`: `response ReviewResponse?`.

### Migraciones generadas
- `20260527165241_add_review_response`
- `20260527173034_add_admin_table`

> Tras cambios de schema: `npx prisma generate` (con el server detenido) para regenerar el client.

---

## Backend

### Autorización
- **`backend/shared/middleware/requireAdmin.js`** (nuevo): tras `requireAuth`, consulta
  `prisma.admin` por `req.user.id`; si no existe o `admin !== true` → **403**.

### Endpoints de respuesta (rutas cliente, JWT)
En `backend/features/reviews/`:
- **routes** — añadidas, todas con `requireAuth` + `requireAdmin`:
  - `POST   /api/reviews/:reviewId/response` → crear (rechaza con **409** si ya existe)
  - `PUT    /api/reviews/:reviewId/response` → editar (**404** si no existe)
  - `DELETE /api/reviews/:reviewId/response` → eliminar
- **service** — `responderReview`, `actualizarRespuesta`, `eliminarRespuesta`
  (`adminUserId` se toma de `req.user.id`); helpers `obtenerReviewConRespuesta` /
  `obtenerRespuestaMapeada`.
- **validator** — `validateResponder`: `content` con `trim`, 1–500 caracteres.
- **constants** — `REVIEW_RESPONSE_LIMITS` y mensajes `RESPONSE_*`.
- **controller** — handlers `responder`, `actualizarRespuesta`, `eliminarRespuesta`.

### Render público de la respuesta
- `reviews.service.js`: `mapReviewResponse` + campo `response` en `mapReview`;
  `obtenerPorProducto` incluye `response: true`. La respuesta se devuelve a cualquier
  visitante (sin importar autenticación).

### Sesión expone si el usuario es admin
- `backend/features/auth/auth.service.js`:
  - `serializarUsuario` ahora incluye `isAdmin: usuario.admin?.admin === true`.
  - Las queries de **login**, **refresh** y **`obtenerUsuarioActivo` (/me)** incluyen
    la relación `admin`, de modo que `isAdmin` viaja en las tres rutas de sesión
    (corrige el bug: tras login el flag llegaba `undefined` hasta recargar).

### Módulo interno (admin panel externo) — solo lectura
- `backend/features/internal/reviews/`: la serialización de reseñas incluye `response`
  (lectura), para que el panel administrativo vea las respuestas existentes. **No** hay
  endpoints internos de escritura (la escritura vive en las rutas cliente con `requireAdmin`).

### Seed / utilidades
- `backend/prisma/seed.js`: `limpiarBaseDeDatos` borra `reviewResponse` y `admin`
  respetando las nuevas FK.
- **`backend/prisma/make-admin.js`** (nuevo): script idempotente para marcar un
  `ClientUser` como admin por email. Uso:
  ```bash
  node prisma/make-admin.js            # por defecto yarield252@gmail.com
  node prisma/make-admin.js otro@mail  # cualquier email existente
  ```

---

## Frontend

### Sesión
- `features/auth/types/auth.types.ts`: `AuthUser.isAdmin?: boolean`.
  (`AuthContext` ya propaga el `user` desde `/auth/login` y `/auth/me`.)

### Capa de datos
- `features/reviews/shared/product-reviews.api.ts`: helper `responseFetch` +
  `respondToReview`, `updateReviewResponse`, `deleteReviewResponse`.

### Estado
- `features/reviews/types/reviews.types.ts`: interfaz `ReviewResponse` y campo
  `response: ReviewResponse | null` en `ProductReview`.
- `features/reviews/types/product-reviews.types.ts`: acción `SET_RESPONSE`,
  handlers en `UseProductReviewsResult` y props nuevas en `PublicReviewCardProps`.
- `reducers/product-reviews.reducer.ts`: caso `SET_RESPONSE` (actualiza
  `review.response` de la reseña afectada).
- `hooks/useProductReviews.ts`: handlers `respond` / `updateResponse` /
  `deleteResponse` (confirman con la respuesta del backend antes de actualizar estado).

### UI
- **`features/reviews/components/AdminResponseSection.tsx`** (nuevo):
  - Muestra la respuesta a **todos** los visitantes, con badge **"Respuesta oficial de
    la tienda"**, fecha y marca "Editada".
  - Solo si `isAdmin`: botón **Responder** (cuando no hay respuesta), formulario con
    textarea + contador (máx 500), y acciones **Editar** / **Eliminar**
    (esta última con `ConfirmDialog` reutilizado).
- `components/PublicReviewCard.tsx`: delega el bloque de respuesta a
  `AdminResponseSection` y reenvía `isAdmin` + handlers.
- `components/ProductReviewsSection.tsx`: calcula `isAdmin = user?.isAdmin === true`
  y pasa los handlers `respond` / `updateResponse` / `deleteResponse`.
- `constants/product-reviews.constants.ts`: strings de la respuesta (badge, contador,
  acciones, diálogo de confirmación).

---

## Reglas de negocio cubiertas

| Regla | Dónde |
|---|---|
| Solo admins responden/editan/eliminan | `requireAdmin` (backend) + UI condicionada a `isAdmin` |
| Una sola respuesta por reseña | `reviewId UNIQUE` (BD) + chequeo **409** en service |
| Texto obligatorio, máx 500 | `validateResponder` (backend) + contador/bloqueo (frontend) |
| Respuesta pública bajo la reseña | `mapReview.response` + `AdminResponseSection` |
| Identificada como "Respuesta oficial de la tienda" + fecha | `AdminResponseSection` |
| Editar respuesta (marca "Editada") | `PUT /response` + `edited` derivado de fechas |
| Eliminar con confirmación | `DELETE /response` + `ConfirmDialog` |
| Cascada al borrar la reseña | `onDelete: Cascade` en `ReviewResponse.reviewId` |
| Notificación al autor | **Fuera de alcance** (definido por la US) |

---

## Pasos para probar en local

```powershell
# Con el backend detenido:
cd backend
npx prisma generate                 # regenera el client con Admin/ReviewResponse
node prisma/make-admin.js           # marca yarield252@gmail.com como admin
npm run dev                         # levanta el backend (puerto 3001)
```

1. Inicia sesión como `yarield252@gmail.com` → en una reseña verás **Responder**.
2. Inicia sesión con un usuario no-admin → no aparece el botón (correcto).
3. Sin login → se ven reseñas y respuestas existentes, sin controles.
</content>
