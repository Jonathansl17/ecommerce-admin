# Hooks utilizados en US-REV-002 — Visualizar reseñas de un producto

Este documento describe todos los hooks aplicados en la funcionalidad de visualización pública de reseñas, por qué se eligió cada uno y cómo interactúan entre sí.

---

## Arquitectura de hooks en `useProductReviews`

El hook personalizado `useProductReviews(productId)` centraliza toda la lógica de la sección. Internamente combina `useReducer`, `useEffect` y dos llamadas a `useMemo`. No hay `useState` en el hook: todo el estado vive en el reducer.

```
useProductReviews(productId)
├── useReducer(reducer, INITIAL_STATE)   → estado unificado (rawReviews + loading + error + filters)
├── useEffect                            → dispara el fetch y despacha acciones al reducer
├── useMemo #1                           → deriva summary (promedio + distribución) de rawReviews
└── useMemo #2                           → deriva reviews filtradas y ordenadas
```

---

## 1. `useReducer`

**Archivo:** `features/reviews/public/hooks/useProductReviews.ts`

### ¿Para qué sirve?

`useReducer` reemplaza múltiples `useState` independientes cuando el estado tiene piezas que cambian juntas o necesitan transiciones controladas. En esta HU, el estado tiene tres responsabilidades que se entrelazan:

1. **Datos de fetch** (`rawReviews`, `loading`, `error`): cambian en secuencia predecible (`FETCH_START → FETCH_SUCCESS | FETCH_ERROR`).
2. **Filtros** (`date`, `rating`, `helpful`): cada filtro puede afectar a otro (p.ej. activar `helpful = most_helpful` debe desactivar el ordenamiento por `date`).

Con `useState` individual por cada pieza, esa lógica cruzada quedaría dispersa en handlers. El reducer la centraliza y la hace testeable en aislamiento.

### State

```ts
interface ProductReviewsState {
  rawReviews: ProductReview[];
  loading: boolean;
  error: string | null;
  filters: {
    date: 'recent' | 'oldest';
    rating: 'all' | '5' | '4' | '3' | '2' | '1';
    helpful: 'none' | 'most_helpful';
  };
}
```

### Acciones (events del reducer)

| Acción | Cuándo se despacha | Qué produce |
|---|---|---|
| `FETCH_START` | Al iniciar el fetch | `loading: true`, `error: null` |
| `FETCH_SUCCESS` | Al recibir datos | `loading: false`, `rawReviews: payload` |
| `FETCH_ERROR` | Si el fetch falla | `loading: false`, `error: mensaje` |
| `SET_DATE` | Usuario cambia filtro Fecha | Actualiza `date` y resetea `helpful → 'none'` (exclusión mutua) |
| `SET_RATING` | Usuario cambia filtro Calificación | Actualiza `rating` sin tocar el ordenamiento |
| `SET_HELPFUL` | Usuario cambia filtro Utilidad | Actualiza `helpful` (Fecha queda en su valor pero se deshabilita en UI) |
| `RESET_FILTERS` | Futuro uso / botón "Limpiar" | Restaura `filters` al estado inicial |

### Lógica de exclusión mutua en el reducer

```ts
case 'SET_DATE':
  // Al elegir un orden de fecha, se limpia el ordenamiento por utilidad
  return {
    ...state,
    filters: { ...state.filters, date: action.payload, helpful: 'none' },
  };
```

Esta regla vive en el reducer, no en el componente. El componente solo despacha `SET_DATE`; el reducer decide el efecto colateral. Esto hace que la UI sea un emisor de eventos, no un orquestador de estado.

---

## 2. `useEffect`

**Archivo:** `features/reviews/public/hooks/useProductReviews.ts`

### ¿Para qué sirve?

Ejecuta el efecto secundario de carga de datos al montar el hook (o cuando cambia `productId`). Se usa **uno solo**: no hay efectos separados por filtro, porque los filtros son procesados por `useMemo` de forma síncrona, sin necesitar efectos adicionales.

```ts
useEffect(() => {
  let cancelled = false;

  dispatch({ type: 'FETCH_START' });
  fetchProductReviews(productId)
    .then((data) => {
      if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', payload: data });
    })
    .catch((err: unknown) => {
      if (!cancelled) dispatch({ type: 'FETCH_ERROR', payload: message });
    });

  return () => { cancelled = true; };
}, [productId]);
```

**Puntos técnicos:**
- **Flag `cancelled`:** evita despachar acciones sobre un componente desmontado si el `productId` cambia rápido (race condition). Es el patrón de cancelación más simple sin necesitar AbortController para llamadas síncronas al mock.
- **Dependencia `[productId]`:** el efecto corre solo al montar y si el ID del producto cambia. Los filtros no son dependencia porque no disparan un re-fetch; son procesados localmente.
- **No hay `useEffect` por filtro:** en la arquitectura anterior del planning se mencionaban varios `useEffect`. Aquí se elimina esa idea: los filtros solo reordenan/reducen datos ya cargados, lo cual es trabajo para `useMemo`, no para efectos.

---

## 3. `useMemo` — Summary (promedio + distribución)

**Archivo:** `features/reviews/public/hooks/useProductReviews.ts`

### ¿Para qué sirve?

Calcula el promedio de calificación, el total de reseñas y la distribución por nivel de estrellas a partir de `state.rawReviews`. **No se obtiene de un campo pre-calculado en el mock**: `useMemo` lo computa en el cliente cada vez que cambia el array de reseñas.

```ts
const summary = useMemo<RatingsSummary>(() => {
  const totalReviews = reviews.length;
  if (totalReviews === 0) return emptySummary(productId);

  const totalScore = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = Math.round((totalScore / totalReviews) * 10) / 10;

  const distribution = reviews.reduce(
    (acc, r) => { acc[`stars${r.rating}`] += 1; return acc; },
    { stars1: 0, stars2: 0, stars3: 0, stars4: 0, stars5: 0 },
  );

  return { productId, average, totalReviews, ...distribution };
}, [state.rawReviews, productId]);
```

**Por qué `useMemo` aquí:**
- `state.rawReviews` cambia solo cuando llega el fetch (una vez por carga). La derivación no necesita correr en cada render.
- `Math.round(x * 10) / 10` garantiza exactamente 1 decimal, consistente con `Decimal(3,1)` del schema Prisma.
- El tipo de retorno respeta `RatingsSummary` del schema (`stars1..stars5`), sin agregar campos nuevos.

---

## 4. `useMemo` — Reviews filtradas y ordenadas

**Archivo:** `features/reviews/public/hooks/useProductReviews.ts`

### ¿Para qué sirve?

Deriva la lista de reseñas ya procesada (filtrada por calificación + ordenada por fecha o utilidad) a partir de `state.rawReviews` y `state.filters`. Se recalcula solo cuando alguna de esas dos dependencias cambia.

```ts
const reviews = useMemo<ProductReview[]>(() => {
  let result = [...state.rawReviews];

  // Paso 1: filtrar por rating (no toca el orden)
  if (state.filters.rating !== 'all') {
    const ratingNum = Number(state.filters.rating);
    result = result.filter((r) => r.rating === ratingNum);
  }

  // Paso 2: ordenar (utilidad tiene precedencia sobre fecha)
  if (state.filters.helpful === 'most_helpful') {
    result.sort((a, b) => {
      if (b.helpfulVotes !== a.helpfulVotes) return b.helpfulVotes - a.helpfulVotes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } else {
    const dir = state.filters.date === 'recent' ? -1 : 1;
    result.sort((a, b) => dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  }

  return result;
}, [state.rawReviews, state.filters]);
```

**Por qué dos `useMemo` separados (summary / reviews) y no uno:**
- `summary` depende solo de `rawReviews`. Si el usuario cambia un filtro, `summary` **no debe recalcularse**: el promedio es del producto completo, no del subconjunto filtrado.
- `reviews` depende de `rawReviews` + `filters`. Cambia con cada interacción del usuario.
- Unirlos en un solo `useMemo` haría que el promedio se recalcule cada vez que el usuario toca un filtro, lo cual es incorrecto semánticamente y más caro.

---

## Resumen visual del flujo

```
app/productos/[id]/page.tsx
└── ProductReviewsSection (productId)
      └── useProductReviews(productId)
            ├── useReducer(reducer, INITIAL_STATE)
            │     Estado: { rawReviews, loading, error, filters }
            │     Acciones: FETCH_START | FETCH_SUCCESS | FETCH_ERROR
            │               SET_DATE | SET_RATING | SET_HELPFUL | RESET_FILTERS
            │
            ├── useEffect([productId])
            │     → dispatch(FETCH_START)
            │     → fetchProductReviews(productId)
            │     → dispatch(FETCH_SUCCESS | FETCH_ERROR)
            │
            ├── useMemo([rawReviews, productId])
            │     → summary { average, totalReviews, stars1..5 }
            │        calculado desde rawReviews, no desde campo pre-existente
            │
            └── useMemo([rawReviews, filters])
                  → reviews[] filtradas y ordenadas
                     [1] filter por rating
                     [2] sort por helpful | date

      Componentes hijos (presentacionales puros):
      ├── ProductRatingsHeader  ← recibe summary
      ├── ReviewFiltersBar      ← recibe filters + handlers dispatch
      ├── PublicReviewCard[]    ← recibe cada ProductReview
      └── EmptyReviewsState     ← recibe filtered: boolean
```

---

## Tabla de hooks por archivo

| Archivo | Hook | Propósito |
|---|---|---|
| `useProductReviews.ts` | `useReducer` | Estado unificado: fetch + filtros |
| `useProductReviews.ts` | `useEffect` | Fetch de reseñas al montar / cambiar productId |
| `useProductReviews.ts` | `useMemo` #1 | Calcular promedio y distribución desde rawReviews |
| `useProductReviews.ts` | `useMemo` #2 | Filtrar y ordenar reseñas según estado de filtros |

---

## Por qué esta separación

### `useReducer` sobre múltiples `useState`
- Centraliza la lógica de transición de estado (p.ej. exclusión mutua entre Fecha y Utilidad).
- El componente despacha eventos semánticos (`SET_DATE`), no manipula estado directamente.
- Facilita razonar sobre los estados posibles: cada acción tiene un efecto único y predecible.

### `useMemo` sobre `useEffect` para filtros
- Los filtros no necesitan efectos porque no producen efectos secundarios (no hay fetch adicional, no hay escritura en storage). Solo transforman datos en memoria.
- `useMemo` garantiza que la transformación solo ocurre cuando cambian sus dependencias, evitando trabajo innecesario en cada render.
- Si se usara `useEffect` para actualizar un `useState` de reviews filtradas, se produciría un render adicional por cada cambio de filtro: `render (filtro cambia) → efecto → setState → render`. Con `useMemo` es `render (filtro cambia) → memo recalcula → mismo render`. Un render menos por interacción.

### Un `useEffect`, no varios
- La única operación asíncrona es el fetch inicial. No hay razón para tener efectos separados por filtro.
- Esta decisión es la razón de existir del `useReducer`: si los filtros no disparan efectos, su estado puede vivir junto al estado de fetch en el mismo reducer, sin necesidad de sincronizarlos con efectos.
