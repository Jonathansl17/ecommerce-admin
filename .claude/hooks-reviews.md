# Hooks utilizados en el módulo de reseñas (US-REV-001)

Este documento describe todos los hooks (de React, de Next.js y personalizados) que intervienen en el flujo de la funcionalidad de reseñas, para qué sirven y cómo se aplican en este caso específico.

---

## 1. Hooks de React

### `useState`
**Para qué sirve:** mantener estado local reactivo dentro de un componente. Cada vez que cambia, React vuelve a renderizar.

**Dónde se usa en reseñas:**

| Archivo | Estado que controla | Propósito |
|---|---|---|
| `app/(dashboard)/reviews/page.tsx` | `editingProductId`, `submittingProductId`, `toastMessage` | Saber qué tarjeta está en modo edición, cuál está enviando y qué mensaje mostrar en el toast. |
| `features/reviews/hooks/useReviews.ts` | `items`, `loading`, `error` | Guardar la lista de productos con su reseña, el estado de carga y los errores al cargar. |
| `features/reviews/components/ReviewForm.tsx` | `formData`, `errors` | Valores del rating y comentario mientras el usuario escribe, y errores de validación por campo. |
| `features/reviews/components/StarRating.tsx` | `hovered` | Cuál estrella está "en hover" para previsualizar la calificación antes de hacer click. |

---

### `useEffect`
**Para qué sirve:** ejecutar efectos secundarios después del render (cargar datos, suscribirse a eventos, timers, etc.). Se vuelve a ejecutar cuando cambian sus dependencias.

**Dónde se usa en reseñas:**

| Archivo | Efecto | Qué hace |
|---|---|---|
| `app/(dashboard)/reviews/page.tsx` | Redirección por sesión | Si el mock demo está apagado y no hay sesión, redirige a `/login`. Depende de `authLoading`, `isAuthenticated`, `router`. |
| `features/reviews/hooks/useReviews.ts` | Carga inicial | Al montar (y cuando cambia el usuario), dispara `loadItems()` para traer los productos y reseñas. |
| `features/reviews/components/ReviewToast.tsx` | Auto-dismiss | Programa un `setTimeout` de 4s para cerrar el toast automáticamente, y lo limpia si el componente se desmonta antes. |

---

### `useCallback`
**Para qué sirve:** memoizar una función para que mantenga la misma referencia entre renders mientras no cambien sus dependencias. Evita recrearla en cada render y rompe ciclos cuando la función es una dependencia de otro hook.

**Dónde se usa en reseñas:**

| Archivo | Función memoizada | Por qué |
|---|---|---|
| `features/reviews/hooks/useReviews.ts` | `loadItems` | Es dependencia del `useEffect` que la llama. Si no estuviera memoizada, el efecto correría en cada render. |
| `features/reviews/hooks/useReviews.ts` | `submitReview`, `updateReview` | Se exponen al consumidor del hook. Memoizarlas permite pasarlas como `onSubmit` sin forzar renders innecesarios en los componentes hijos. |

---

## 2. Hooks de Next.js

### `useRouter`
**Para qué sirve:** obtener el router del App Router para navegar imperativamente (`push`, `replace`, `back`).

**Dónde se usa en reseñas:**

- `app/(dashboard)/reviews/page.tsx` → se usa `router.replace(ROUTES.LOGIN)` para redirigir al login cuando el usuario entra sin sesión y el mock demo está apagado. `replace` en lugar de `push` para no dejar `/reviews` en el historial.

---

### `usePathname` *(indirecto)*
**Para qué sirve:** obtener la ruta actual.

**Dónde se usa en reseñas:**

- No se usa dentro del módulo de reseñas, pero sí en `components/layout/ClientSidebar.tsx`, que detecta cuando `pathname === '/reviews'` para resaltar visualmente el item del menú. Se menciona aquí porque es parte del layout heredado por la página.

---

## 3. Hooks personalizados

### `useAuth`
**Archivo:** `features/auth/hooks/AuthContext.tsx`
**Para qué sirve:** exponer el contexto de autenticación (usuario, token, `isAuthenticated`, `isLoading`, `login`, `logout`).

**Dónde se usa en reseñas:**

| Archivo | Qué consume | Uso |
|---|---|---|
| `app/(dashboard)/reviews/page.tsx` | `isAuthenticated`, `isLoading` | Decide si bloquear el render con loading o redirigir a login (cuando el mock demo está apagado). |
| `features/reviews/hooks/useReviews.ts` | `user` | Obtiene `user.id` y `user.fullName` para cargar y etiquetar las reseñas. Si no hay sesión y el mock demo está activo, se sustituye por `REVIEWS_MOCK.user`. |

---

### `useReviews`
**Archivo:** `features/reviews/hooks/useReviews.ts`
**Para qué sirve:** encapsular toda la lógica del feature de reseñas en un solo hook reutilizable. Internamente combina `useAuth`, `useState`, `useEffect` y `useCallback`.

**Qué expone:**
```ts
{
  items: PurchasedProductWithReview[]; // productos comprados con su reseña (o null)
  loading: boolean;                     // está cargando la lista
  error: string | null;                 // error al cargar
  submitReview: (productId, data) => Promise<ProductReview>; // crear reseña
  updateReview: (reviewId, data) => Promise<ProductReview>;  // editar reseña
}
```

**Cómo se usa:**
- La página `/reviews` lo invoca en el nivel superior para obtener los datos y las acciones.
- Los componentes hijos (`PurchasedProductCard`, `ReviewForm`) reciben esas acciones vía props, sin conocer el hook.
- La integración con el mock demo ocurre dentro del hook: resuelve el usuario como `authUser ?? REVIEWS_MOCK.user` cuando `REVIEWS_MOCK.enabled` es `true`.

---

## Resumen visual del flujo con hooks

```
/reviews (page.tsx)
├── useRouter()            → redirección a /login si no hay sesión (solo con mock apagado)
├── useAuth()              → isAuthenticated, isLoading
├── useReviews()           ← hook personalizado
│     ├── useAuth()        → user (o mock user)
│     ├── useState()       → items, loading, error
│     ├── useCallback()    → loadItems, submitReview, updateReview
│     └── useEffect()      → dispara loadItems al montar
├── useState()             → editingProductId, submittingProductId, toastMessage
└── useEffect()            → redirección condicional

PurchasedProductCard
└── ReviewForm
      ├── useState()       → formData, errors
      └── StarRating
            └── useState() → hovered

ReviewToast
└── useEffect()            → timer de auto-dismiss (4s)
```

---

## Por qué esta separación

- **`useReviews` aísla la capa de datos** de los componentes: los componentes solo renderizan y llaman callbacks; no saben de `localStorage`, del mock o del backend.
- **`useCallback` en `useReviews`** garantiza que las funciones expuestas no cambien de referencia, así los componentes memoizados no se re-renderizan de más.
- **`useState` local en `ReviewForm` y `StarRating`** mantiene el estado de UI dentro del componente, sin contaminar el estado global del feature.
- **`useEffect` con dependencias explícitas** en `ReviewToast` (auto-cierre) y en la carga inicial evita fugas de timers y cargas dobles.

---

# Cambios técnicos adicionales al feature de reseñas

Esta sección documenta, en orden cronológico, las tres iteraciones realizadas después de la implementación base de US-REV-001:

1. Alineación del frontend con `schema.prisma` del backend.
2. Visualización de votos y estado de moderación.
3. HU de Edición y Eliminación de reseña propia.

El objetivo es dejar trazabilidad técnica: qué interfaces cambiaron, qué hooks se aplicaron y qué decisiones arquitectónicas se tomaron.

---

## 1. Alineación del frontend con `schema.prisma`

### Contexto
El archivo `backend/prisma/schema.prisma` define los modelos definitivos del dominio (PostgreSQL). El frontend tenía tipos construidos *ad hoc* durante la fase de prototipo, con divergencias en nombres y campos. La alineación elimina esa deuda y prepara el frontend para consumir la API real sin reescrituras.

### Mapeo de campos: tipo frontend → modelo Prisma

#### `ProductReview` ↔ `Review`

| Frontend anterior | Frontend alineado | Campo Prisma | Notas |
|---|---|---|---|
| `userId: string` | `clientUserId: string` | `clientUserId @map("client_user_id")` | El backend usa FK a `ClientUser`; el nombre refleja esa semántica. |
| `userName: string` | `clientUserName: string` | *(derivado)* | Proyección de `ClientUser.fullName` via join; no existe como columna en `Review`. |
| — | `status: ReviewStatus` | `status ReviewStatus @default(pending)` | Enum Prisma: `pending | approved | rejected`. Habilita flujo de moderación. |
| — | `edited: boolean` | `edited Boolean @default(false)` | Se marca en `updateReview` (ver sección 3). |
| — | `helpfulVotes: number` | `helpfulVotes Int @default(0)` | Denormalización para evitar `COUNT()` en cada lectura. |
| — | `unhelpfulVotes: number` | `unhelpfulVotes Int @default(0)` | Idem anterior. |

**Punto técnico:** Los IDs en Prisma son `BigInt`. En TypeScript se representan como `string` para evitar pérdida de precisión (`Number.MAX_SAFE_INTEGER = 2^53 - 1`, mientras BigInt PostgreSQL llega a `2^63 - 1`). La serialización JSON preserva `string` sin drama; cualquier conversión a `bigint` nativo se haría solo al consumir.

#### `PurchasedProduct` — reestructuración completa

El tipo anterior era un placeholder con `id`, `price`, `orderCompleted: boolean`. Se rediseñó para reflejar la triada **Order → OrderItem → Product/ProductVariant** del schema:

```ts
export interface PurchasedProduct {
  orderId: string;          // Order.id
  orderStatus: OrderStatus; // Order.status (enum del schema)
  itemId: string;           // Product.itemId (PK heredada de Item)
  variantId: string;        // OrderItem.variantId → ProductVariant.id
  name: string;             // Item.name
  imageUrl: string;         // Product.imageUrl
  price: string;            // derivado de OrderItem.unitPriceSnap
  purchasedAt: string;      // Order.createdAt
  variant: PurchasedProductVariant; // { color, size, price }
}
```

**Decisiones:**
- `orderStatus: OrderStatus` reemplaza el booleano `orderCompleted`. Ahora la lógica de visibilidad en `fetchPurchasedProductsWithReviews` usa `orderStatus === 'delivered'`, que es la semántica correcta según el schema (`OrderStatus.delivered`).
- El tipo `PurchasedProductVariant` anidado espeja `ProductVariant` (solo los campos relevantes para UI: `color`, `size`, `price`). Se evita inflar el tipo con `currentStock`, `minThreshold`, `reservedStock`, que son de dominio de inventario.
- `itemId` (no `id`) porque en Prisma `Product` hereda la PK de `Item` (`itemId BigInt @id`). El renombre fue mecánico pero tocó 7 sitios: `page.tsx`, `useReviews.ts`, `PurchasedProductCard.tsx`, `reviews.api.ts` y el mock.

#### Nuevos tipos espejo del schema

```ts
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type VoteType = 'helpful' | 'unhelpful';
export type OrderStatus = 'pending_payment' | 'confirmed' | ... | 'cancelled';

export interface ReviewVote {           // model ReviewVote
  id: string;
  reviewId: string;
  clientUserId: string;
  voteType: VoteType;
  createdAt: string;
}

export interface RatingsSummary {       // model RatingsSummary
  productId: string;
  average: number;
  totalReviews: number;
  stars1..stars5: number;
}
```

Estos tipos todavía no tienen UI dedicada (excepto `RatingsSummary` en capa mock, ver sección 3), pero existen como contrato para cuando se agreguen las pantallas.

#### `AuthUser` ↔ `ClientUser`

Se añadió un enum `AccountStatus` y tres campos opcionales (`accountStatus`, `createdAt`, `updatedAt`). Son opcionales porque el backend actual no los expone en `LoginResponse`, pero el tipo queda listo para cuando se incluyan.

#### `ClientNotification` ↔ `ClientNotification`

Se añadió:
- `type: NotificationType` (`'internal' | 'email' | 'both'`): el canal por el que se envía la notificación. Relevante cuando se implemente filtrado o preferencias del usuario.
- `sendAttempts: number`: contador de intentos de envío (usado por el job de reintentos del backend).
- `clientUserId: string`: FK a `ClientUser`, requerida para el contrato tipo aun cuando el frontend ya recibe la notificación filtrada por su propio usuario.

### Cosas a destacar de la alineación

- **Contrato antes que implementación:** alinear tipos *antes* de conectar el backend real reduce el blast radius de errores de tipo en tiempo de integración. El compilador sirve como test de contrato.
- **No se tocó el backend:** la alineación fue unidireccional (front → schema). Si el schema cambia, el frontend debe seguirle.
- **Mock sigue siendo mock:** ningún `fetch` real se agregó; la sustitución mock/backend ocurre en un único lugar (`shared/reviews.api.ts`), preservando el aislamiento establecido en US-REV-001.

---

## 2. Visualización de votos y estado de moderación

### Motivación
Al añadir `helpfulVotes`, `unhelpfulVotes`, `edited` y `status` a `ProductReview` en la sección anterior, ninguno quedó visible en UI. Esta iteración cierra ese hueco.

### Componente `ReviewVotes` (nuevo)

Archivo: `features/reviews/components/ReviewVotes.tsx`

```ts
interface ReviewVotesProps {
  helpfulVotes: number;
  unhelpfulVotes: number;
}
```

- Componente *presentacional puro*: sin estado, sin hooks. Recibe contadores y renderiza emojis + números + `aria-label` dinámicos.
- Las etiquetas ARIA usan funciones en `REVIEW_STRINGS`:
  ```ts
  helpfulAriaLabel: (count) => `${count} ${count === 1 ? 'voto útil' : 'votos útiles'}`
  ```
  Esto resuelve pluralización en español evitando una librería i18n para un caso tan acotado.
- **No expone acción de votar**: esta tarjeta es la vista del autor sobre su propia reseña; votar sobre reseñas ajenas vive en la ficha de producto (fuera de alcance).

### `ReviewCard` extendido

Nuevos bloques renderizados:
- Si `review.edited` → sufijo ` · editada` después de la fecha (concatenado en el mismo `<p>` para no añadir jerarquía visual innecesaria).
- Si `review.status === 'pending'` → párrafo con clase `text-amber-600 dark:text-amber-400` con la leyenda "Pendiente de moderación". Usa tokens Tailwind directos (no hay `--warning` en el theme todavía).
- `ReviewVotes` integrado en la fila inferior junto al botón de editar (después de la sección 3 también junto al de eliminar), en un `flex justify-between` para separar métricas de acciones.

### Invalidación del seed mock (`_v2`)

**Problema:** `seedMockReviewsIfNeeded` sembraba `MOCK_SEEDED_REVIEWS` en `localStorage` solo la primera vez (flag `reviews_mock_seeded`). Al cambiar los mocks (añadir `status`, `edited`, `helpfulVotes`, etc.), los usuarios que ya tenían el seed viejo no veían los nuevos campos.

**Solución:** cambio de versión en ambas claves:
```ts
const REVIEWS_STORAGE_KEY = 'reviews_by_user_v2';
const MOCK_SEED_FLAG_KEY = 'reviews_mock_seeded_v2';
```

- Las claves viejas (`reviews_by_user`, `reviews_mock_seeded`) quedan huérfanas en el navegador del usuario, pero el código ya no las lee. No se limpian activamente porque no hay información sensible y el coste es irrelevante.
- Patrón reutilizable: **cualquier cambio de shape en datos persistidos en localStorage debe acompañarse de bump de versión en la clave.** Sin esto, arrastras datos corruptos que rompen al consumir.

---

## 3. HU de Edición y Eliminación de reseña propia

### Alcance
La HU (ver `.claude/HU-Edicion-Eliminacion-Resena-Propia.md`) tiene 8 criterios de aceptación. CA-1 a CA-4 ya estaban cubiertos por US-REV-001 + la alineación (`edited` + tag visible). CA-8 (cascada de respuesta admin) queda fuera porque no existe aún el feature de respuestas admin. Esta iteración cubre CA-5, CA-6 y CA-7.

### 3.1 Capa API: `deleteReview` + recálculo de `RatingsSummary`

Archivo: `features/reviews/shared/reviews.api.ts`

#### Función `deleteReview(clientUserId, reviewId)`

```ts
export async function deleteReview(
  clientUserId: string,
  reviewId: string,
): Promise<void> {
  await delay(REVIEW_ARTIFICIAL_DELAY_MS);

  const reviews = getUserReviews(clientUserId);
  const target = reviews.find((r) => r.id === reviewId);
  if (!target) throw new Error(REVIEW_STRINGS.errors.deleteNotFound);
  if (target.clientUserId !== clientUserId) {
    throw new Error(REVIEW_STRINGS.errors.notOwner);
  }

  saveUserReviews(clientUserId, reviews.filter((r) => r.id !== reviewId));
  recalculateSummary(target.productId);
}
```

**Guardias defensivas:**
- `deleteNotFound`: cubre el flujo alternativo "la reseña ya fue eliminada previamente" del HU. Permite UX clara (toast de error descriptivo).
- `notOwner`: redundante en la capa mock (las reseñas ya están particionadas por `clientUserId` en localStorage), pero deja el *contrato* listo para cuando conecte al backend, donde la guardia sí es load-bearing.

La misma guardia `notOwner` se añadió a `updateReview` por simetría.

#### `recalculateSummary(productId)`

Función interna pura (toma producto, escribe en storage). Se invoca al final de `submitReview`, `updateReview` y `deleteReview`:

```ts
function recalculateSummary(productId: string): RatingsSummary {
  const allReviews = Object.values(readStoredReviews()).flat();
  const productReviews = allReviews.filter(
    (r) => r.productId === productId && r.status !== 'rejected',
  );

  const summary = emptySummary(productId);
  for (const review of productReviews) {
    summary.totalReviews += 1;
    const key = `stars${review.rating}` as keyof Pick<RatingsSummary, 'stars1' | ...>;
    summary[key] += 1;
  }

  if (summary.totalReviews > 0) {
    const totalScore = productReviews.reduce((acc, r) => acc + r.rating, 0);
    summary.average = Math.round((totalScore / summary.totalReviews) * 10) / 10;
  }

  // persist & return
}
```

**Detalles técnicos:**
- `Object.values(readStoredReviews()).flat()` consolida las reseñas de *todos* los usuarios en memoria. En mock es barato; en producción real la responsabilidad pasa al backend (trigger o job de agregación), no al cliente.
- `status !== 'rejected'`: las reseñas rechazadas no deben contar en el promedio. Coincide con la semántica esperada del enum `ReviewStatus`.
- `Math.round(x * 10) / 10` para truncar a 1 decimal, consistente con `Decimal(3,1)` del schema.
- **Cumple CA-5 y CA-7** (recálculo tras editar y tras eliminar) en la capa mock.

#### `getRatingsSummary(productId)` (público)

Función *read-only* expuesta para consumo futuro (detalle de producto, catálogo). No se usa todavía en `/reviews` pero el contrato queda listo, evitando cambios retrocompatibles cuando se agregue la UI.

### 3.2 Hook `useReviews` extendido

```ts
const deleteReview = useCallback(
  async (productId: string, reviewId: string): Promise<void> => {
    if (!user) throw new Error(REVIEW_STRINGS.errors.deleteFailed);
    await apiDeleteReview(user.id, reviewId);
    setItems((prev) =>
      prev.map((item) =>
        item.product.itemId === productId ? { ...item, review: null } : item,
      ),
    );
  },
  [user],
);
```

**Por qué `(productId, reviewId)` y no solo `reviewId`:**
- Sin `productId`, el hook tendría que *buscar* qué item actualizar (O(n) sobre `items`), lo que exigiría agregar `items` a las dependencias del `useCallback` → la función cambiaría en cada render con nuevos items → invalidación en cascada del memoizing.
- Pasar ambos IDs desde el consumidor (que ya conoce el `productId` por el rendering) hace la callback estable y la actualización de estado O(n) pero con set literal.

### 3.3 Componente `ConfirmDialog`

Archivo: `components/ui/ConfirmDialog.tsx`. Reutilizable (no es específico de reseñas, por eso vive en `components/ui/` y no en `features/reviews/`).

#### Interface

```ts
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  destructive?: boolean;
}
```

- **Componente *controlado***: el consumidor maneja `open`. No hay `defaultOpen` ni ref imperativa. Esto facilita composición con estado elevado y testing.
- `destructive` agrega una clase visual (rojo) al botón de confirmar. No cambia comportamiento — es signaling para el usuario.
- `loading` bloquea ESC, click en backdrop y el botón cancelar, para evitar double-submit.

#### Hooks aplicados

| Hook | Uso | Justificación |
|---|---|---|
| `useId()` | Generar IDs únicos para `aria-labelledby` y `aria-describedby` | En React 19 es la forma canónica. Evita colisiones si el diálogo se instancia varias veces en la misma página. |
| `useRef<HTMLButtonElement>` | Referenciar el botón Cancelar para hacer `.focus()` | Primer elemento focusable debe ser una acción no-destructiva, por convención de a11y (WCAG, patrón AAA dialog). |
| `useEffect` | Dos responsabilidades: (1) auto-focus al abrir, (2) registro/limpieza del listener `keydown` para ESC | Listener registrado en `window` (no en el diálogo) porque el foco puede moverse fuera del nodo del diálogo durante animaciones. Se desmonta en cleanup para evitar fugas. |

#### Accesibilidad (decisiones)

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + `aria-describedby` = contrato completo de diálogo modal ARIA.
- **Cierre por ESC:** solo si `!loading`. Durante operación no se puede abandonar.
- **Cierre por backdrop:** comparación `e.target === e.currentTarget` para distinguir click en el fondo vs. click en hijos del diálogo. También respeta `!loading`.
- **Foco inicial en Cancelar** (no en Confirmar): en diálogos destructivos es estándar para evitar eliminaciones accidentales al pulsar Enter sin leer.
- **No hay focus trap real**: al ser una HU acotada y tener solo dos botones, el tab natural del browser es aceptable. Si se escalara a diálogos con más elementos, convendría añadir trap (librería externa o implementación manual).

#### Anti-patrón evitado: `ref` en `Button`

El componente `Button` interno no usa `forwardRef`. Intentar `ref={cancelRef}` sobre `<Button>` lanzaría warning en React 19 (el ref no se propagaría al `<button>` subyacente). Se resolvió usando un `<button>` nativo con las mismas clases para el botón Cancelar. Alternativa descartada: refactorizar `Button` a `forwardRef` — decidido *no* hacerlo para evitar scope creep.

### 3.4 `PurchasedProductCard`: estado local del diálogo

```ts
const [confirmingDelete, setConfirmingDelete] = useState(false);

const handleConfirmDelete = async () => {
  try { await onDelete(); } finally { setConfirmingDelete(false); }
};
```

**Decisión de diseño:** el estado `confirmingDelete` vive en el card (no en `page.tsx`). Razonamiento:
- Cada card tiene su propio diálogo. Lift-up implicaría un `confirmingProductId: string | null` en el page — más estado, más acople.
- La página *sí* posee `deletingProductId` (en curso de la llamada), porque ese sí es estado *compartido* (para marcar loading y disparar el toast).
- El patrón resultante: **abrir/cerrar** es local; **ejecutar** cruza al padre. Esto sigue el principio de *lift state only as far as needed*.

El diálogo se cierra automáticamente al finalizar `onDelete()` gracias al `finally`. Si falla, el error se propaga hasta `page.tsx` que lo pinta en el toast.

### 3.5 Orquestación en `page.tsx`

```ts
const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

const handleDelete = async (productId: string) => {
  const item = items.find((i) => i.product.itemId === productId);
  if (!item?.review) return;

  setDeletingProductId(productId);
  try {
    await deleteReview(productId, item.review.id);
    setToastMessage(REVIEW_STRINGS.successDeleted);
    if (editingProductId === productId) setEditingProductId(null);
  } catch (err) {
    setToastMessage(err instanceof Error ? err.message : REVIEW_STRINGS.errors.deleteFailed);
  } finally {
    setDeletingProductId(null);
  }
};
```

**Puntos técnicos:**
- `deletingProductId` se comporta igual que `submittingProductId`: solo un card en operación a la vez (se expone vía prop `deleting` al card correspondiente).
- Si el usuario estaba editando la reseña que elimina, `setEditingProductId(null)` evita dejar el formulario huérfano.
- El `try/catch` captura errores de la cadena API → hook → page y los transforma en mensaje de toast. `instanceof Error` es la forma segura en TS estricto (no se asume `.message` sobre `unknown`).

### 3.6 Interfaces nuevas o modificadas

| Interface | Cambio |
|---|---|
| `UseReviewsResult` | + `deleteReview: (productId, reviewId) => Promise<void>` |
| `ReviewCardProps` | + `onDelete: () => void` |
| `PurchasedProductCardProps` | + `deleting: boolean`, + `onDelete: () => Promise<void>` |
| `ConfirmDialogProps` | Nueva (ver 3.3) |

---

## Resumen de hooks aplicados en esta iteración

| Hook | Dónde | Propósito |
|---|---|---|
| `useState` | `PurchasedProductCard` | Toggle `confirmingDelete` local |
| `useState` | `page.tsx` | Nuevo `deletingProductId` |
| `useCallback` | `useReviews.ts` | `deleteReview` estable (`[user]`) |
| `useId` | `ConfirmDialog` | IDs estables para ARIA |
| `useRef` | `ConfirmDialog` | Referencia al botón Cancelar para focus |
| `useEffect` | `ConfirmDialog` | Focus inicial + registro/cleanup de listener ESC |

---

## Decisiones arquitectónicas a destacar

1. **`RatingsSummary` se persiste aparte de `reviews`.** Aunque en mock se podría recalcular *on-the-fly* en cada lectura, se persiste en localStorage para espejar el modelo Prisma (donde sí es una tabla materializada) y probar el contrato `getRatingsSummary`.

2. **Autorización defensiva en capa API.** Las guardias `notOwner` son redundantes en mock pero imprescindibles cuando se conecte el backend. Se implementan ahora para no tener que reescribir los call sites después.

3. **El diálogo no es un feature del módulo de reseñas.** Vive en `components/ui/ConfirmDialog.tsx` para habilitar reutilización (ej.: confirmación al cerrar cuenta, cancelar pedido, eliminar dirección). Queda como pieza de UI genérica.

4. **`useCallback` con dependencias mínimas.** `deleteReview` solo depende de `user`, no de `items`. La actualización del estado `items` se hace con *updater function* (`setItems(prev => ...)`) que no requiere leer el valor actual desde la clausura.

5. **Toast como canal de error unificado.** En lugar de un `errorMessage` aparte, el toast reutilizado muestra tanto éxito como error. Se diferencia por contenido, no por componente. Costo: el toast no tiene variante visual distinta para error; aceptable para el alcance actual.

6. **Versionado de claves en localStorage.** Patrón reutilizable: cualquier storage local que pueda quedar obsoleto debe usar sufijo `_vN`. Se aplicó a `reviews_by_user_v2`, `reviews_mock_seeded_v2` y al nuevo `ratings_summary_by_product_v1`.

