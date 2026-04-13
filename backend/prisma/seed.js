import pkg from '@prisma/client';

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const SEED_CONFIG = {
  ROL_POR_DEFECTO: 'administrador',
  ROL_DESCRIPCION: 'Rol por defecto para administradores del panel',
};

async function main() {
  await prisma.role.upsert({
    where: { name: SEED_CONFIG.ROL_POR_DEFECTO },
    update: {},
    create: {
      name: SEED_CONFIG.ROL_POR_DEFECTO,
      description: SEED_CONFIG.ROL_DESCRIPCION,
    },
  });

  console.log(`Seed completado: rol '${SEED_CONFIG.ROL_POR_DEFECTO}' creado`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('Error al ejecutar el seed:', error);
    prisma.$disconnect();
    process.exit(1);
  });
