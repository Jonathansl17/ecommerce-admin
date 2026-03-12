# Prisma - Guia de uso

## Setup inicial (primera vez)

1. Asegurate de tener las credenciales correctas en `.env`:
```
DATABASE_URL="postgresql://usuario:password@localhost:5432/ecommerce"
```

2. Genera el cliente de Prisma:
```bash
npx prisma generate
```

3. Crea la base de datos y aplica el schema:
```bash
npx prisma migrate dev --name init
```

Esto crea las tablas en PostgreSQL y genera la carpeta `prisma/migrations/`.

## Cuando modificas un modelo

Si cambias algo en `prisma/schema.prisma` (agregar campo, tabla, relacion, etc):

```bash
npx prisma migrate dev --name descripcion_del_cambio
```

Ejemplo: si agregas un campo `phone` al modelo `Client`:
```bash
npx prisma migrate dev --name add_phone_to_client
```

Esto hace dos cosas:
- Crea un archivo SQL de migracion en `prisma/migrations/`
- Regenera el cliente de Prisma automaticamente

## Comandos utiles

| Comando | Que hace |
|---------|----------|
| `npx prisma generate` | Regenera el cliente (sin tocar la DB) |
| `npx prisma migrate dev --name nombre` | Crea migracion y la aplica |
| `npx prisma migrate reset` | Borra todo y re-aplica las migraciones |
| `npx prisma db push` | Aplica el schema directo sin crear migracion (solo dev) |
| `npx prisma studio` | Abre un panel web para ver/editar datos |
| `npx prisma db pull` | Genera el schema a partir de una DB existente |

## Flujo de trabajo

```
Editar schema.prisma → npx prisma migrate dev --name cambio → Listo
```

## Notas

- Nunca edites los archivos dentro de `prisma/migrations/` manualmente.
- Si solo necesitas regenerar el cliente sin migrar, usa `npx prisma generate`.
- `npx prisma db push` es rapido para prototipar, pero no guarda historial de migraciones.
- En produccion se usa `npx prisma migrate deploy` (no `dev`).
