# US-REV-001 — Crear reseña de producto comprado

## Información general

| Campo | Valor |
|---|---|
| **ID** | US-REV-001 |
| **Nombre** | Crear reseña de producto comprado |
| **Módulo** | Reseñas de productos |
| **Tipo** | Historia de usuario |

---

## Historia de usuario

**Como** un usuario autenticado que ha comprado un producto,
**necesito** escribir una reseña con calificación por estrellas y un comentario sobre el producto adquirido,
**con la finalidad de** compartir mi experiencia de compra y ayudar a otros usuarios a tomar decisiones informadas.

---

## Descripción

El usuario accede a la página de detalle de un producto que ha comprado previamente, donde encuentra la opción de escribir una reseña. El formulario solicita una calificación obligatoria de 1 a 5 estrellas y un campo de texto para el comentario.

El sistema verifica que el usuario tenga al menos un pedido completado que incluya ese producto antes de permitirle publicar la reseña. Una vez enviada, la reseña queda asociada al producto y al usuario, y se actualiza el promedio de calificación del producto.

---

## Criterios de aceptación

- [ ] La opción de escribir reseña solo es visible para usuarios autenticados con al menos una compra completada del producto.
- [ ] Si el usuario no ha comprado el producto, se muestra un mensaje indicando que solo compradores verificados pueden dejar reseñas.
- [ ] El formulario contiene un selector de calificación de 1 a 5 estrellas, obligatorio.
- [ ] El formulario contiene un campo de texto para el comentario, obligatorio, con un mínimo de 10 caracteres y un máximo de 1000 caracteres.
- [ ] Un usuario solo puede publicar una reseña por producto comprado.
- [ ] Si el usuario ya dejó una reseña para ese producto, se muestra la reseña existente con opción de editarla.
- [ ] Al enviar la reseña, se recalcula y actualiza el promedio de calificación del producto.
- [ ] Se muestra un mensaje de confirmación al usuario tras publicar la reseña exitosamente.
- [ ] La reseña queda asociada al nombre del usuario y la fecha de publicación.

---

## Tareas asociadas

| # | Tarea | Estado |
|---|---|---|
| 1 | Diseñar formulario de creación de reseña | ☐ Pendiente |
| 2 | Implementar verificación de compra del producto para dejar una reseña | ☐ Pendiente |
| 3 | Implementar selector de calificación de 1 a 5 estrellas obligatorio | ☐ Pendiente |
| 4 | Implementar campo de texto con validaciones de longitud (10–1000 caracteres) | ☐ Pendiente |
| 5 | Implementar restricción de una reseña por producto por usuario | ☐ Pendiente |
| 6 | Implementar recálculo del promedio de calificación del producto | ☐ Pendiente |
| 7 | Implementar mensaje de confirmación de publicación exitosa | ☐ Pendiente |

---

## Detalle de tareas

### 1. Diseñar formulario de creación de reseña
Diseñar la interfaz del formulario en la página de detalle del producto, incluyendo el selector de estrellas, el campo de comentario y el botón de envío. Debe ser responsive y accesible.

### 2. Implementar verificación de compra del producto para dejar una reseña
Validar en el backend que el usuario autenticado tenga al menos un pedido en estado *completado* que incluya el producto. En caso contrario, ocultar el formulario y mostrar el mensaje informativo correspondiente.

### 3. Implementar selector de calificación de 1 a 5 estrellas obligatorio
Componente interactivo de estrellas (1 a 5), con estado visual claro y validación obligatoria. No permite envío sin calificación seleccionada.

### 4. Implementar campo de texto con validaciones de longitud (10–1000 caracteres)
Validación tanto en frontend como en backend:
- Mínimo: 10 caracteres.
- Máximo: 1000 caracteres.
- Mostrar contador de caracteres en tiempo real y mensajes de error claros.

### 5. Implementar restricción de una reseña por producto por usuario
Garantizar a nivel de base de datos (constraint único sobre `user_id + product_id`) y a nivel de servicio que un usuario no pueda crear más de una reseña por producto. Si ya existe, mostrar la reseña con opción de edición.

### 6. Implementar recálculo del promedio de calificación del producto
Al publicar o editar una reseña, recalcular el promedio y el total de reseñas del producto. Evaluar si se actualiza en tiempo real o mediante un job, según volumen esperado.

### 7. Implementar mensaje de confirmación de publicación exitosa
Mostrar un toast o notificación visible tras la publicación exitosa, confirmando al usuario que su reseña fue registrada correctamente.

---

## Reglas de negocio

1. Solo usuarios **autenticados** pueden publicar reseñas.
2. Solo usuarios con **al menos un pedido completado** que incluya el producto pueden dejar reseña (comprador verificado).
3. **Una reseña por usuario por producto**; las reseñas existentes son editables.
4. La reseña debe incluir **calificación (1–5)** y **comentario (10–1000 caracteres)**, ambos obligatorios.
5. Cada reseña queda asociada al **nombre del usuario** y la **fecha de publicación**.
6. El **promedio de calificación** del producto debe reflejar siempre el estado actual de sus reseñas.

---

## Datos de la reseña (modelo sugerido)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID / int | Identificador único de la reseña |
| `product_id` | FK | Producto reseñado |
| `user_id` | FK | Usuario autor de la reseña |
| `rating` | int (1–5) | Calificación en estrellas |
| `comment` | text (10–1000) | Comentario del usuario |
| `created_at` | datetime | Fecha de publicación |
| `updated_at` | datetime | Fecha de última edición |
