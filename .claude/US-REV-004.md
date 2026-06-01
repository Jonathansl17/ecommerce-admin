# Historia de Usuario: Edición y Eliminación de Reseña Propia

## Historia de Usuario

> **Como** un usuario autenticado que ha publicado una reseña,
> **necesito** editar o eliminar mi reseña previamente publicada,
> **con la finalidad de** corregir o actualizar mi opinión sobre un producto si mi experiencia cambió.

---

## Descripción

El usuario puede acceder a su reseña publicada desde la página del producto o desde su perfil. Tiene la opción de editar tanto la calificación como el texto del comentario, o de eliminar la reseña completamente.

Al editar, se aplican las mismas validaciones que al crear. Al eliminar, se solicita confirmación y se recalcula el promedio de calificación del producto.

---

## Criterios de Aceptación

| # | Criterio |
|---|----------|
| 1 | El usuario ve opciones de **"Editar"** y **"Eliminar"** únicamente en sus propias reseñas. |
| 2 | Al editar, se abre el formulario precargado con la calificación y el texto actuales. |
| 3 | La edición aplica las mismas validaciones de creación: calificación obligatoria (1-5 estrellas), texto obligatorio (10-1000 caracteres). |
| 4 | Al guardar la edición, se actualiza la fecha de modificación y se muestra una indicación de **"Editada"**. |
| 5 | Al guardar la edición, se recalcula el promedio de calificación del producto. |
| 6 | Al eliminar, se muestra un diálogo de confirmación antes de proceder. |
| 7 | Tras eliminar la reseña, se recalcula el promedio de calificación y se actualiza el contador de reseñas del producto. |
| 8 | Si la reseña tenía una respuesta del administrador, la respuesta también se elimina junto con la reseña. |

---

## Reglas de Negocio

- **Autorización:** Solo el autor original de la reseña puede editarla o eliminarla.
- **Validaciones en edición:**
  - Calificación: obligatoria, rango de 1 a 5 estrellas.
  - Texto: obligatorio, longitud entre 10 y 1000 caracteres.
- **Trazabilidad:** Toda reseña editada debe mostrar una marca visible de "Editada" junto con la fecha de última modificación.
- **Integridad referencial:** La eliminación de una reseña implica la eliminación en cascada de su respuesta administrativa asociada (si existe).
- **Recalculo de métricas:** Cualquier operación de edición (con cambio de calificación) o eliminación debe disparar el recálculo del promedio de calificación y el contador de reseñas del producto.

---

## Flujos Principales

### Flujo 1: Edición de Reseña

1. El usuario accede a su reseña desde la página del producto o su perfil.
2. El sistema muestra el botón **"Editar"** únicamente si el usuario es el autor.
3. El usuario presiona **"Editar"**.
4. El sistema abre el formulario con los datos actuales precargados (calificación y texto).
5. El usuario modifica los campos deseados.
6. El sistema valida los datos ingresados.
7. El usuario guarda los cambios.
8. El sistema actualiza la reseña, marca la fecha de modificación y muestra la indicación **"Editada"**.
9. El sistema recalcula el promedio de calificación del producto.

### Flujo 2: Eliminación de Reseña

1. El usuario accede a su reseña desde la página del producto o su perfil.
2. El sistema muestra el botón **"Eliminar"** únicamente si el usuario es el autor.
3. El usuario presiona **"Eliminar"**.
4. El sistema muestra un diálogo de confirmación.
5. El usuario confirma la eliminación.
6. El sistema elimina la reseña y, si aplica, la respuesta del administrador asociada.
7. El sistema recalcula el promedio de calificación y actualiza el contador de reseñas del producto.

---

## Flujos Alternativos / Excepciones

| Escenario | Comportamiento esperado |
|-----------|-------------------------|
| El usuario cancela el diálogo de confirmación de eliminación | La reseña permanece sin cambios. |
| Las validaciones de edición fallan | Se muestran los errores correspondientes y no se guardan los cambios. |
| El usuario intenta editar/eliminar una reseña que no le pertenece | El sistema no debe mostrar las opciones; si se intenta por otra vía, debe rechazarse la operación. |
| La reseña ya fue eliminada previamente | El sistema informa que la reseña no existe. |

---

## Validaciones

| Campo | Regla |
|-------|-------|
| Calificación | Obligatoria. Valor entero entre 1 y 5. |
| Texto del comentario | Obligatorio. Longitud mínima de 10 y máxima de 1000 caracteres. |

---

## Definición de Terminado (Definition of Done)

- [ ] Los botones de editar y eliminar se muestran solo al autor de la reseña.
- [ ] El formulario de edición precarga los datos actuales correctamente.
- [ ] Las validaciones de creación se aplican también en edición.
- [ ] La reseña editada muestra la marca "Editada" y la fecha de modificación.
- [ ] El diálogo de confirmación aparece antes de eliminar.
- [ ] La eliminación remueve la respuesta del administrador si existe.
- [ ] El promedio de calificación y el contador de reseñas del producto se recalculan correctamente en ambos casos.
- [ ] Se han implementado pruebas unitarias y de integración para los flujos principales y alternativos.
- [ ] La historia ha sido validada por el Product Owner.
