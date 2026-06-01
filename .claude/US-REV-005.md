# US-REV-005 — Respuesta del administrador a reseñas

## Información general

| Campo | Valor |
|---|---|
| **ID** | US-REV-005 |
| **Nombre** | Respuesta del administrador a reseñas |
| **Módulo** | Reseñas de productos |
| **Tipo** | Historia de usuario |

---

## Historia de usuario

**Como** un usuario con rol de administrador,
**necesito** responder públicamente a las reseñas de los usuarios,
**con la finalidad de** atender comentarios, agradecer retroalimentación positiva o aclarar situaciones reportadas en reseñas negativas.

---

## Descripción

El administrador puede responder a cualquier reseña publicada desde el panel de administración o directamente desde la página del producto. Cada reseña admite una única respuesta oficial del administrador. La respuesta se muestra públicamente debajo de la reseña correspondiente, identificada como respuesta oficial de la tienda.

---

## Criterios de aceptación

- [ ] Solo usuarios con rol de administrador pueden responder reseñas.
- [ ] Cada reseña admite una única respuesta del administrador.
- [ ] El formulario de respuesta contiene un campo de texto obligatorio con un máximo de 500 caracteres.
- [ ] La respuesta se muestra públicamente debajo de la reseña, identificada visualmente como "Respuesta oficial de la tienda".
- [ ] La respuesta muestra la fecha de publicación.
- [ ] El administrador puede editar su respuesta después de publicarla.
- [ ] El administrador puede eliminar su respuesta si lo considera necesario.
- [ ] El usuario autor de la reseña no recibe notificación de la respuesta (fuera del alcance actual, a considerar en iteraciones futuras).

---

## Tareas asociadas

| # | Tarea | Estado |
|---|---|---|
| 1 | Diseñar formulario de respuesta administrativa (texto + envío) | ☐ Pendiente |
| 2 | Implementar autorización por rol de administrador | ☐ Pendiente |
| 3 | Implementar restricción de una respuesta única por reseña | ☐ Pendiente |
| 4 | Implementar validación de longitud máxima del texto (500 caracteres) | ☐ Pendiente |
| 5 | Renderizar la respuesta debajo de la reseña con el identificador "Respuesta oficial de la tienda" | ☐ Pendiente |
| 6 | Implementar edición de respuesta publicada | ☐ Pendiente |
| 7 | Implementar eliminación de respuesta con confirmación | ☐ Pendiente |

---

## Detalle de tareas

### 1. Diseñar formulario de respuesta administrativa
Componente con campo de texto, contador de caracteres en tiempo real y botón de envío. Visible solo en sesión de administrador. Debe ser accesible y responsive.

### 2. Implementar autorización por rol de administrador
Backend: middleware que valide que el usuario autenticado tiene rol de administrador antes de permitir crear, editar o eliminar respuestas. Frontend: ocultar el formulario en sesiones de cliente.

### 3. Implementar restricción de una respuesta única por reseña
Constraint a nivel de base de datos: relación 1:1 (o 0:1) entre `Review` y `ReviewResponse`. A nivel de servicio, rechazar la creación si ya existe una respuesta para esa reseña.

### 4. Implementar validación de longitud máxima del texto (500 caracteres)
Validación en frontend (contador en tiempo real, bloqueo del envío) y en backend (rechazo con mensaje claro). Mínimo: 1 carácter no vacío.

### 5. Renderizar la respuesta debajo de la reseña
La respuesta debe mostrarse con un estilo visualmente diferenciado (fondo distinto, indentación, ícono o badge), con el texto "Respuesta oficial de la tienda" y la fecha de publicación. Si fue editada, mostrar marca "Editada" con la fecha.

### 6. Implementar edición de respuesta publicada
El administrador autor puede modificar el texto. Aplica las mismas validaciones que la creación. Actualiza la fecha de modificación.

### 7. Implementar eliminación de respuesta con confirmación
Diálogo de confirmación antes de proceder. Tras eliminar, la reseña queda sin respuesta y puede recibir una nueva si así se decide.

---

## Reglas de negocio

1. Solo usuarios con rol de **administrador** pueden crear, editar o eliminar respuestas a reseñas.
2. **Una sola respuesta por reseña**: relación 0:1 entre `Review` y `ReviewResponse`.
3. El texto de la respuesta es obligatorio con un **máximo de 500 caracteres**.
4. La respuesta se muestra **públicamente** debajo de la reseña, sin importar el estado de autenticación del visitante.
5. Toda respuesta debe estar identificada visualmente como **"Respuesta oficial de la tienda"**.
6. Si la reseña asociada se elimina, la respuesta también debe eliminarse en cascada (ver US-REV-004 y US-REV-006).
7. La notificación al autor de la reseña queda **fuera del alcance** de esta historia.

---

## Datos de la respuesta (modelo sugerido)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | BigInt | Identificador único de la respuesta |
| `review_id` | FK → Review (UNIQUE) | Reseña a la que se responde |
| `admin_user_id` | FK → AdminUser | Administrador autor |
| `content` | text (1–500) | Texto de la respuesta |
| `created_at` | datetime | Fecha de publicación |
| `updated_at` | datetime | Fecha de última edición |
