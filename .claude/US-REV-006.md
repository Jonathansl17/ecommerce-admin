# US-REV-006 — Moderación y eliminación de reseñas inapropiadas

## Información general

| Campo | Valor |
|---|---|
| **ID** | US-REV-006 |
| **Nombre** | Moderación y eliminación de reseñas inapropiadas |
| **Módulo** | Reseñas de productos |
| **Tipo** | Historia de usuario |

---

## Historia de usuario

**Como** un usuario con rol de moderador o administrador,
**necesito** revisar y eliminar reseñas que contengan contenido inapropiado, ofensivo o que viole las políticas de la plataforma,
**con la finalidad de** mantener un ambiente respetuoso y confiable en la sección de reseñas de la tienda.

---

## Descripción

El moderador o administrador tiene acceso a un panel donde puede visualizar todas las reseñas de la plataforma. Puede filtrar por producto, fecha o estado. Al identificar una reseña inapropiada, puede eliminarla indicando el motivo. El sistema registra la acción de moderación para auditoría y el usuario autor de la reseña eliminada no puede volver a publicar la misma reseña sin crear una nueva.

---

## Criterios de aceptación

- [ ] Solo usuarios con rol de moderador o administrador pueden acceder al panel de moderación de reseñas.
- [ ] El panel muestra un listado de todas las reseñas con filtros por: producto, fecha de publicación y calificación.
- [ ] Cada reseña en el panel muestra: producto asociado, autor, calificación, texto, fecha y cantidad de votos.
- [ ] Al eliminar una reseña, se requiere seleccionar un motivo de eliminación de una lista predefinida (contenido ofensivo, spam, información falsa, fuera de tema, otro).
- [ ] Se solicita confirmación antes de ejecutar la eliminación.
- [ ] Al eliminar la reseña, se recalcula el promedio de calificación y el contador de reseñas del producto.
- [ ] Se registra un log de auditoría con: reseña eliminada, moderador responsable, motivo y fecha de la acción.
- [ ] Si la reseña eliminada tenía una respuesta del administrador, esta también se elimina.
- [ ] Los votos de utilidad asociados a la reseña eliminada se eliminan.

---

## Tareas asociadas

| # | Tarea | Estado |
|---|---|---|
| 1 | Diseñar panel de moderación con listado y filtros | ☐ Pendiente |
| 2 | Implementar autorización por rol de moderador o administrador | ☐ Pendiente |
| 3 | Implementar filtros: producto, fecha de publicación, calificación | ☐ Pendiente |
| 4 | Implementar formulario de eliminación con motivos predefinidos | ☐ Pendiente |
| 5 | Implementar diálogo de confirmación antes de eliminar | ☐ Pendiente |
| 6 | Implementar eliminación en cascada (respuesta del administrador y votos) | ☐ Pendiente |
| 7 | Implementar recálculo del promedio y contador del producto | ☐ Pendiente |
| 8 | Implementar log de auditoría de moderación | ☐ Pendiente |

---

## Detalle de tareas

### 1. Diseñar panel de moderación con listado y filtros
Vista con tabla de reseñas (producto, autor, calificación, texto resumido, fecha, votos, acciones). Paginación obligatoria. Accesible solo en sesión de moderador/admin.

### 2. Implementar autorización por rol de moderador o administrador
Backend: middleware que valide el rol antes de permitir el acceso al endpoint. Frontend: guard de ruta que redirige si el usuario no tiene el rol requerido.

### 3. Implementar filtros: producto, fecha de publicación, calificación
- Producto: selector o búsqueda por nombre.
- Fecha: rango (desde/hasta).
- Calificación: 1★ a 5★.
Los filtros son combinables y se aplican vía query params.

### 4. Implementar formulario de eliminación con motivos predefinidos
Lista de motivos: `contenido_ofensivo`, `spam`, `informacion_falsa`, `fuera_de_tema`, `otro`. Si se selecciona "otro", habilitar campo de texto opcional para descripción.

### 5. Implementar diálogo de confirmación antes de eliminar
Diálogo modal que muestre un resumen de la reseña a eliminar y el motivo seleccionado. Acción destacada como destructiva.

### 6. Implementar eliminación en cascada (respuesta del administrador y votos)
Al eliminar la reseña:
- Eliminar todos los registros de `review_votes` asociados a la reseña.
- Eliminar la `ReviewResponse` asociada (si existe).
Implementar a nivel de transacción para garantizar consistencia.

### 7. Implementar recálculo del promedio y contador del producto
Tras eliminar, recalcular `RatingsSummary.average`, `totalReviews` y la distribución `stars1..stars5` del producto. Persistir en la tabla `ratings_summaries`.

### 8. Implementar log de auditoría de moderación
Persistir un registro con: ID de la reseña eliminada, ID del moderador, motivo, descripción adicional (si aplica), fecha. Este log no es accesible para clientes.

---

## Reglas de negocio

1. Solo usuarios con rol de **moderador** o **administrador** pueden acceder al panel y eliminar reseñas.
2. La eliminación requiere **motivo seleccionado** de una lista predefinida.
3. La eliminación de una reseña dispara una **eliminación en cascada** de:
   - Todos los votos (`review_votes`) asociados.
   - La respuesta del administrador (`ReviewResponse`) asociada, si existe.
4. La eliminación dispara el **recálculo** del promedio de calificación y el contador de reseñas del producto.
5. Toda acción de moderación queda registrada en un **log de auditoría** inmutable.
6. El usuario autor de la reseña eliminada **puede crear una nueva reseña** del mismo producto si cumple los requisitos (no es una restitución de la original).

---

## Motivos predefinidos de eliminación

| Código | Descripción |
|---|---|
| `contenido_ofensivo` | Lenguaje agresivo, ofensivo o discriminatorio |
| `spam` | Contenido publicitario o repetitivo |
| `informacion_falsa` | Afirmaciones verificablemente falsas sobre el producto |
| `fuera_de_tema` | Reseña no relacionada con el producto |
| `otro` | Otro motivo (requiere descripción) |

---

## Datos del log de auditoría (modelo sugerido)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | BigInt | Identificador único del registro |
| `review_id` | BigInt | ID de la reseña eliminada (no FK, queda como referencia histórica) |
| `moderator_user_id` | FK → AdminUser | Moderador responsable de la acción |
| `reason_code` | enum | Motivo de eliminación |
| `reason_detail` | text (opcional) | Descripción adicional cuando `reason_code = 'otro'` |
| `deleted_at` | datetime | Fecha de la acción |
