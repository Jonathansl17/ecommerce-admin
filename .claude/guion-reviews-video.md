# Guion: Feature de Reseñas — Recorrido por el código

**Duración estimada:** 6–8 minutos (~1100 palabras a ritmo conversacional).

---

## 1. Introducción (≈ 30 s)

> "Hola, en este video voy a explicar cómo está construida la feature de reseñas del e-commerce. Vamos a recorrer el frontend en Next.js con TypeScript, los dos custom hooks que la mueven —`useReviews` y `useProductReviews`—, y al final, cómo responde el backend en Express + Prisma.
>
> La feature cubre cinco user stories: crear, listar, editar, eliminar reseñas, y votar útil/no útil sobre reseñas ajenas."

---

## 2. Arquitectura general (≈ 45 s)

> "Toda la feature vive en `frontend/features/reviews/`, siguiendo una arquitectura limpia por capas:
>
> - **`types/`** — contratos TypeScript espejo del `schema.prisma`.
> - **`shared/`** — clientes HTTP: `reviews.api.ts` para 'mis reseñas' y `product-reviews.api.ts` para la vista pública del producto.
> - **`hooks/`** — los dos custom hooks que orquestan estado y efectos.
> - **`reducers/`** — un reducer puro para el flujo más complejo.
> - **`components/`** — UI presentacional: `ReviewForm`, `StarRating`, `ReviewCard`, `ReviewVotes`, etc.
>
> Los componentes **no saben** de `fetch` ni de validaciones; solo reciben datos y callbacks. Toda la lógica vive en los hooks."

---

## 3. `useReviews` — el hook del dashboard del usuario (≈ 1 min 30 s)

> "Abrimos `features/reviews/hooks/useReviews.ts`. Este hook alimenta la página `/reviews`, donde el usuario ve sus productos comprados y la reseña que dejó —o no— en cada uno.
>
> Combina cuatro hooks de React:
>
> - **`useAuth`** para saber si hay sesión.
> - **`useState`** para `items`, `pagination`, `page`, `loading` y `error`.
> - **`useCallback`** para memoizar `loadItems`, `submitReview`, `updateReview` y `deleteReview`.
> - **`useEffect`** que dispara `loadItems` cuando cambia el usuario o la página.
>
> Lo importante es por qué `loadItems` está en un `useCallback`: es **dependencia del `useEffect`** que la llama. Sin memoizar, el efecto correría en cada render — un bucle infinito potencial. Las dependencias son `[isAuthenticated, page]`, así que el hook recarga al loguearse o al cambiar de página.
>
> Las tres acciones —`submitReview`, `updateReview`, `deleteReview`— hacen lo mismo:
>
> 1. Llaman al cliente API.
> 2. Actualizan `items` con un **updater functional** (`setItems(prev => …)`).
>
> Usar el updater functional permite tener `useCallback` con dependencias vacías. Las funciones nunca cambian de referencia, los componentes hijos memoizados no se re-renderizan, y no hay riesgo de leer estado obsoleto."

---

## 4. `useProductReviews` — el hook de la vista pública (≈ 2 min)

> "Abrimos `features/reviews/hooks/useProductReviews.ts`. Este es el más sofisticado: alimenta `/producto/[id]`, donde cualquier usuario ve todas las reseñas aprobadas con filtros, paginación y botones de votar.
>
> Aquí el estado **ya no es plano**, así que cambiamos `useState` por **`useReducer`**. El reducer vive en `reducers/product-reviews.reducer.ts` y maneja acciones como `FETCH_START`, `FETCH_SUCCESS`, `SET_RATING`, `APPLY_VOTE`, `REVERT_VOTE_STATE`, etc. La regla: cambiar un filtro **resetea a página 1**; cambiar de página **mantiene los filtros**.
>
> El hook tiene **dos `useEffect` separados**:
>
> **El primero** carga las reseñas. Sus dependencias son `productId`, `page`, `limit`, `rating`, `date`, `helpful`. Usa el patrón **`let cancelled = false`** en el cleanup para evitar race conditions: si el usuario cambia de filtro rápido, las respuestas tardías no sobrescriben el estado nuevo.
>
> **El segundo** carga los votos del usuario sobre la página actual. Y aquí hay una decisión clave que está documentada en un comentario:
>
> ```ts
> const reviewIdsKey = state.reviews.map((r) => r.id).join(',');
> ```
>
> Depende **solo de `reviewIdsKey`**, no de `state.reviews`. ¿Por qué? Porque cuando el usuario vota, el reducer recrea `state.reviews` con los contadores actualizados. Si dependiéramos del array, cada voto optimista re-dispararía el fetch y `SET_MY_VOTES` con datos pre-commit sobrescribiría el voto optimista — al siguiente click se contaba doble. **Votos fantasma.** Por eso filtramos por una clave estable de IDs.
>
> Luego viene la parte que más me gusta: **votación optimista con rollback**. La función `runWithOptimisticUpdate` toma un snapshot del estado anterior, despacha `APPLY_VOTE` para que la UI reaccione **antes** de que el servidor responda, llama al endpoint, y si falla, despacha `REVERT_VOTE_STATE` para volver exactamente al snapshot. La UI se siente instantánea, pero los contadores siguen siendo correctos."

---

## 5. Componentes destacados (≈ 1 min)

> "En `components/` hay piezas pequeñas y reutilizables:
>
> - **`StarRating`** y **`StarRatingDisplay`** — uno interactivo con `useState` para el hover, otro de solo lectura.
> - **`ReviewForm`** — controla `formData` y `errors` localmente; las validaciones (rating 1–5, comentario 10–1000 chars) viven en `shared/reviews.validation.ts` y son las mismas que ejecuta el backend.
> - **`ReviewVotes`** — componente presentacional puro, sin hooks. Recibe contadores y pinta emojis con `aria-label` pluralizado en español.
> - **`ReviewCard`** — muestra el sufijo *"editada"* si `review.edited`, y *"Pendiente de moderación"* en color ámbar si `review.status === 'pending'`.
> - **`ConfirmDialog`** en `components/ui/` — diálogo modal accesible con `useId`, `useRef` y `useEffect` para auto-focus en *Cancelar* y cierre con ESC."

---

## 6. Backend — Express + Prisma (≈ 1 min 30 s)

> "El backend está en `backend/features/reviews/`. Las rutas en `reviews.routes.js` exponen:
>
> - `GET /reviews/me` — productos comprados con reseñas del usuario.
> - `GET /reviews/me/votes` — diccionario de votos del usuario.
> - `GET /reviews/product/:productId` — reseñas aprobadas, **público**.
> - `POST`, `PUT`, `DELETE /reviews[/:id]` — CRUD propio, autenticado.
> - `POST` y `DELETE /reviews/:id/vote` — votación.
>
> En `reviews.service.js` está la lógica crítica:
>
> **`verificarCompraCompletada`** — antes de permitir una reseña, hace un `prisma.order.findFirst` que valida que exista un pedido con `status: 'delivered'` cuyo `OrderItem.variant.productId` coincida. Sin compra entregada, **403**.
>
> **`verificarReviewNoExiste`** — garantiza una reseña por usuario y producto. Si ya existe, **409 Conflict**.
>
> **`buildRatingsSummary`** — corre dos queries en paralelo con `Promise.all`: un `aggregate` para promedio y total, y un `groupBy` para la distribución de estrellas. Solo cuenta reseñas `approved`, redondea a un decimal —consistente con el `Decimal(3,1)` del schema— y se devuelve junto con cada listado.
>
> **Votación** — cuando alguien vota, primero se verifica que **no sea reseña propia** (`VOTE_OWN_REVIEW`, 403). Después, una **transacción Prisma** cubre tres casos: voto nuevo (insert + increment), cambio de voto (decrement al anterior, increment al nuevo), o voto repetido (idempotente). La transacción mantiene los contadores denormalizados sincronizados con la tabla `ReviewVote`, evitando un `COUNT()` en cada lectura.
>
> **Eliminación** también es transaccional: borra primero los `ReviewVote` y después la `Review`, en una sola unidad atómica."

---

## 7. Cierre (≈ 20 s)

> "Resumiendo: los componentes son tontos y reutilizables, los hooks aíslan estado y efectos, los reducers manejan flujos complejos como votación con rollback, y el backend valida con Prisma todo lo que el frontend ya validó —porque el cliente nunca es la fuente de verdad—. Eso es la feature de reseñas. Gracias por ver el video."
