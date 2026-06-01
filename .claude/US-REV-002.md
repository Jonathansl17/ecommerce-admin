# US-REV-002 — Visualizar reseñas de un producto

## Información general

| Campo | Valor |
|---|---|
| **ID** | US-REV-002 |
| **Nombre** | Visualizar reseñas de un producto |
| **Módulo** | Reseñas de productos |
| **Tipo** | Historia de usuario |
| **Implementación** | Mock (alineado a `schema.prisma`) |

---

## Historia de usuario

**Como** un usuario (autenticado o no),
**necesito** ver las reseñas de un producto con su calificación promedio y poder filtrarlas,
**con la finalidad de** tomar una decisión informada antes de comprarlo.

---

## Descripción

La página pública de detalle de un producto incluye una sección de reseñas que muestra:
- El promedio de calificación y el total de reseñas (obtenido de `RatingsSummary`).
- La distribución de calificaciones (barras por nivel de estrellas).
- Todas las reseñas aprobadas del producto.
- Filtros por **Fecha**, **Calificación** y **Utilidad**.

Los datos provienen de un mock, pero los tipos respetan estrictamente los modelos del `schema.prisma` (`Review`, `RatingsSummary`, `ClientUser.fullName` proyectado).

---

## Criterios de aceptación

- [ ] Se muestra el promedio de calificación con 1 decimal (ej. 4.6), derivado de `RatingsSummary.average`.
- [ ] Se muestra el total de reseñas (`RatingsSummary.totalReviews`).
- [ ] Se muestra la distribución de estrellas (barras para stars1..stars5) con porcentaje correcto.
- [ ] Solo se muestran reseñas con `status === 'approved'`.
- [ ] El filtro de **Fecha** ordena por `createdAt` (más recientes / más antiguas).
- [ ] El filtro de **Calificación** filtra por `rating` exacto (todas / 5★ / 4★ / 3★ / 2★ / 1★).
- [ ] El filtro de **Utilidad** ordena por `helpfulVotes` desc; desempate por `createdAt` desc.
- [ ] Los filtros de Fecha y Utilidad son mutuamente excluyentes (solo un ordenamiento activo a la vez).
- [ ] El filtro de Calificación es combinable con cualquier ordenamiento.
- [ ] Cada reseña muestra: nombre del autor, fecha, calificación en estrellas, comentario, badge "Compra verificada".
- [ ] Se muestra un estado vacío amistoso si no hay reseñas aprobadas.
- [ ] Se muestra un skeleton o indicador de carga mientras se obtienen los datos.

---

## Reglas de negocio

1. El promedio proviene de `RatingsSummary` (ya materializado); no se recalcula en el cliente.
2. Las reseñas con `status` `pending` o `rejected` **no** se muestran en la vista pública.
3. La calificación del promedio se muestra con exactamente **1 decimal**.
4. Si dos reseñas tienen los mismos `helpfulVotes`, el desempate es por `createdAt` desc.
5. El filtro de Utilidad tiene precedencia sobre el de Fecha cuando ambos podrían colisionar.

---

## Estructura de datos (alineada a `schema.prisma`)

### Fuentes de datos

| Tipo | Modelo Prisma | Descripción |
|---|---|---|
| `RatingsSummary` | `model RatingsSummary` | Promedio, total y distribución por nivel. Ya tipado en `reviews.types.ts`. |
| `ProductReview` | `model Review` | Reseña individual. Ya tipado en `reviews.types.ts`. |
| `clientUserName` | Proyección de `ClientUser.fullName` | No existe como columna en `Review`; se incluye vía join (en mock, como campo directo). |

### Mock requerido

Archivo: `features/reviews/public/mocks/product-reviews.mock.ts`
- `RatingsSummary` para al menos un `productId` (ej. `prod-001`).
- ~12 `ProductReview` con `productId: 'prod-001'`, autores variados, `helpfulVotes`/`unhelpfulVotes` distribuidos, mezcla de `edited: true/false`, todas con `status: 'approved'`.

---

## Arquitectura

### Ruta

```
app/(public)/productos/[id]/page.tsx   ← contenedor mínimo, extrae productId
```

### Feature folder

```
features/reviews/public/
├── mocks/
│   └── product-reviews.mock.ts        ← datos estáticos del mock
├── shared/
│   └── product-reviews.api.ts         ← fetchProductRatingsSummary, fetchProductReviews
├── hooks/
│   └── useProductReviews.ts           ← hook personalizado
└── components/
    ├── ProductReviewsSection.tsx       ← orquestador
    ├── ProductRatingsHeader.tsx        ← promedio + distribución
    ├── ReviewFiltersBar.tsx            ← controles de filtros
    ├── PublicReviewCard.tsx            ← tarjeta de reseña (solo lectura)
    └── EmptyReviewsState.tsx           ← estado vacío
```

> Los componentes de `features/reviews/` (US-REV-001/004) **no se reutilizan directamente** porque están acoplados a la vista del autor (editar/eliminar). Se crean componentes separados en `public/` para mantener la separación de roles.

### Componentes reutilizados de US-REV-001

| Componente | Archivo |
|---|---|
| `StarRatingDisplay` | `features/reviews/components/StarRatingDisplay.tsx` |
| `ReviewVotes` | `features/reviews/components/ReviewVotes.tsx` (modo solo lectura) |
| `VerifiedBuyerBadge` | `features/reviews/components/VerifiedBuyerBadge.tsx` |

---

## Hook `useProductReviews(productId)`

```ts
// Retorno
{
  summary: RatingsSummary | null,
  reviews: ProductReview[],   // ya filtradas y ordenadas
  loading: boolean,
  error: string | null,
  filters: ProductReviewFilters,
  setFilter: (key: keyof ProductReviewFilters, value: string) => void,
}

// Tipo de filtros
interface ProductReviewFilters {
  date: 'recent' | 'oldest';
  rating: 'all' | '5' | '4' | '3' | '2' | '1';
  helpful: 'none' | 'most_helpful';
}
```

**Hooks internos:**

| Hook | Uso |
|---|---|
| `useState` | Estado de `summary`, `rawReviews`, `loading`, `error`, `filters` |
| `useEffect` | Dispara `fetchProductRatingsSummary` y `fetchProductReviews` al montar (dep: `productId`) |
| `useMemo` | Deriva `reviews` filtradas/ordenadas a partir de `rawReviews` + `filters` (evita recomputar en cada render) |
| `useCallback` | `setFilter` estable para evitar re-renders innecesarios en `ReviewFiltersBar` |

---

## Mock API

Archivo: `features/reviews/public/shared/product-reviews.api.ts`

```ts
export async function fetchProductRatingsSummary(productId: string): Promise<RatingsSummary>
export async function fetchProductReviews(productId: string): Promise<ProductReview[]>
// Solo devuelve reviews con status === 'approved'
```

- Delay artificial: **350 ms** (consistente con `reviews.api.ts`).
- La lista de reseñas viene del mock estático; no se persiste en `localStorage` (datos de producto son de solo lectura en esta HU).

---

## Filtros — lógica de combinación

```
Input: rawReviews (approved)
  ↓
[1] Filtrar por rating: si filters.rating !== 'all', quedar solo con r.rating === Number(filters.rating)
  ↓
[2] Ordenar:
    - Si filters.helpful === 'most_helpful' → sort por helpfulVotes desc, luego createdAt desc
    - Else → sort por createdAt (desc si 'recent', asc si 'oldest')
  ↓
Output: reviews (para render)
```

**Restricción UI:** Fecha y Utilidad son mutuamente excluyentes. Al seleccionar `most_helpful`, el toggle de fecha se deshabilita visualmente (pero `filters.date` mantiene su valor para restaurarlo si el usuario vuelve a `none`).

---

## Diseño de `ProductRatingsHeader`

```
┌─────────────────────────────────────────────────────────┐
│  ★ 4.6          ■■■■■■■■■■■■■■■■□□□□  5★  (8)  73%    │
│  28 reseñas     ■■■■■■□□□□□□□□□□□□□□  4★  (3)  27%    │
│                 ■□□□□□□□□□□□□□□□□□□□  3★  (1)   9%    │
│                 □□□□□□□□□□□□□□□□□□□□  2★  (0)   0%    │
│                 □□□□□□□□□□□□□□□□□□□□  1★  (0)   0%    │
└─────────────────────────────────────────────────────────┘
```

- El `%` de cada nivel = `starsN / totalReviews * 100`, redondeado.
- Las barras son elementos `<div>` con `width` como estilo inline (porcentaje).

---

## Tareas

| # | Tarea | Estado |
|---|---|---|
| 1 | Crear ruta `app/(public)/productos/[id]/page.tsx` (contenedor mínimo) | ☐ Pendiente |
| 2 | Crear mocks: `RatingsSummary` + ~12 `ProductReview` para `prod-001` | ☐ Pendiente |
| 3 | Implementar `product-reviews.api.ts` (summary + list, con delay, solo approved) | ☐ Pendiente |
| 4 | Implementar `useProductReviews(productId)` con filtros y `useMemo` | ☐ Pendiente |
| 5 | Implementar `ProductRatingsHeader` (promedio + total + barras de distribución) | ☐ Pendiente |
| 6 | Implementar `ReviewFiltersBar` (Date, Rating, Helpfulness) | ☐ Pendiente |
| 7 | Implementar `PublicReviewCard` (presentacional puro, solo lectura) | ☐ Pendiente |
| 8 | Implementar `EmptyReviewsState` y skeleton/loading | ☐ Pendiente |
| 9 | Componer `ProductReviewsSection` y conectar en la página de producto | ☐ Pendiente |
| 10 | A11y: `aria-label` en filtros, `role="radiogroup"` para Calificación, foco visible | ☐ Pendiente |

---

## Definition of Done

- [ ] Promedio mostrado = `summary.average` (1 decimal).
- [ ] Total mostrado = `summary.totalReviews`.
- [ ] Distribución refleja `stars1..stars5` con `%` correcto.
- [ ] Filtro de Calificación reduce la lista correctamente.
- [ ] Ordenamiento por Fecha funciona (más recientes / más antiguas).
- [ ] Ordenamiento por Utilidad funciona (`helpfulVotes` desc, desempate `createdAt` desc).
- [ ] Filtros de Fecha y Utilidad se comportan como mutuamente excluyentes en UI.
- [ ] Solo reseñas `status === 'approved'` aparecen.
- [ ] Estado vacío y skeleton visibles en los estados correspondientes.
- [ ] Compila sin `any`; sin warnings de React.
- [ ] Sigue los patrones de naming, hooks y separación de responsabilidades de `features/reviews/`.

---

## Fuera de alcance

- Votar en reseñas ajenas (helpful/unhelpful interactivos) — otra HU.
- Paginación / "Ver más" — cuando se conecte el backend.
- Filtro por "compra verificada" — solo se muestra el badge informativo.
- Moderación / aprobación de reseñas — dominio de admin.
