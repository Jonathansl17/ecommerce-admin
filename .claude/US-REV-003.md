# US-REV-003 — Votación de utilidad de reseñas

## Información general

| Campo | Valor |
|---|---|
| **ID** | US-REV-003 |
| **Nombre** | Votación de utilidad de reseñas |
| **Módulo** | Reseñas de productos |
| **Tipo** | Historia de usuario |

---

## Historia de usuario

**Como** un usuario autenticado,
**necesito** marcar una reseña como útil o no útil,
**con la finalidad de** ayudar a que las reseñas más valiosas sean más visibles para otros compradores.

---

## Descripción

Cada reseña publicada cuenta con botones de voto de utilidad (útil / no útil). Los usuarios autenticados pueden emitir un voto por reseña. El sistema registra el voto, actualiza el contador de utilidad de la reseña y permite al usuario cambiar su voto en cualquier momento. Los votos se reflejan en el ordenamiento por utilidad.

---

## Criterios de aceptación

- [ ] Cada reseña muestra botones de voto "Útil" y "No útil" con sus contadores respectivos.
- [ ] Solo usuarios autenticados pueden votar; los visitantes no autenticados ven los contadores pero no pueden votar.
- [ ] Un usuario solo puede emitir un voto (útil o no útil) por reseña.
- [ ] Si el usuario ya votó, su selección se muestra resaltada visualmente.
- [ ] El usuario puede cambiar su voto de útil a no útil y viceversa en cualquier momento.
- [ ] El usuario puede retirar su voto haciendo clic nuevamente en su selección actual.
- [ ] Un usuario no puede votar su propia reseña.
- [ ] Los contadores de votos se actualizan en tiempo real tras cada acción.

---

## Tareas asociadas

| # | Tarea | Estado |
|---|---|---|
| 1 | Diseñar componente de botones de voto (útil / no útil) con contadores | ☐ Pendiente |
| 2 | Implementar restricción de voto único por usuario por reseña | ☐ Pendiente |
| 3 | Implementar bloqueo de voto para visitantes no autenticados | ☐ Pendiente |
| 4 | Implementar cambio y retiro de voto | ☐ Pendiente |
| 5 | Implementar restricción de voto sobre reseña propia | ☐ Pendiente |
| 6 | Implementar actualización en tiempo real de los contadores | ☐ Pendiente |
| 7 | Reflejar votos en el ordenamiento por utilidad (US-REV-002) | ☐ Pendiente |

---

## Detalle de tareas

### 1. Diseñar componente de botones de voto (útil / no útil) con contadores
Componente presentacional con dos botones (pulgar arriba / pulgar abajo) y sus contadores respectivos. Debe reflejar el estado del voto del usuario actual (no votado, útil, no útil) y ser accesible vía teclado.

### 2. Implementar restricción de voto único por usuario por reseña
Garantizar a nivel de base de datos (constraint único sobre `review_id + user_id` en la tabla `review_votes`) y a nivel de servicio que un usuario no pueda emitir más de un voto por reseña.

### 3. Implementar bloqueo de voto para visitantes no autenticados
Los visitantes no autenticados deben ver los contadores pero los botones deben estar deshabilitados o redirigir a login. No se exponen endpoints de voto sin autenticación.

### 4. Implementar cambio y retiro de voto
- Cambio: si el usuario emite el voto opuesto, se actualiza el `voteType` y se ajustan los contadores.
- Retiro: si el usuario hace clic sobre su voto actual, se elimina el registro y se decrementa el contador.

### 5. Implementar restricción de voto sobre reseña propia
A nivel de servicio, validar que `review.clientUserId !== currentUserId`. En UI, ocultar o deshabilitar los botones cuando el autor de la reseña es el usuario actual.

### 6. Implementar actualización en tiempo real de los contadores
Tras cada acción de voto, actualizar el estado local del contador inmediatamente (optimistic UI) y revertir si la petición al backend falla.

### 7. Reflejar votos en el ordenamiento por utilidad (US-REV-002)
El ordenamiento "Más útiles" debe consumir los contadores actualizados. Verificar que cambios en los votos se reflejen al re-cargar la lista o invalidar la caché.

---

## Reglas de negocio

1. Solo usuarios **autenticados** pueden votar reseñas.
2. **Un voto por usuario por reseña**: registro único en `review_votes` con constraint `(review_id, user_id)`.
3. El `voteType` admite dos valores: `helpful` o `unhelpful`.
4. El usuario puede **cambiar** o **retirar** su voto en cualquier momento.
5. Un usuario **no puede votar su propia reseña**.
6. Los contadores `helpfulVotes` y `unhelpfulVotes` en la reseña reflejan siempre el estado actual de los votos asociados.

---

## Datos del voto (modelo sugerido)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | BigInt | Identificador único del voto |
| `review_id` | FK → Review | Reseña votada |
| `client_user_id` | FK → ClientUser | Usuario que emite el voto |
| `vote_type` | enum (`helpful`/`unhelpful`) | Tipo de voto |
| `created_at` | datetime | Fecha del voto |

Constraint: `UNIQUE(review_id, client_user_id)`.
