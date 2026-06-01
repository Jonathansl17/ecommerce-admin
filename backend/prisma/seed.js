// ──────────────────────────────────────────────────────────────────────────────
// Database seed — populates every table with realistic data for local development.
//
// Test credentials seeded by this script:
//   email:    admin@gmail.com
//   password: Admin12345
// ──────────────────────────────────────────────────────────────────────────────

import 'dotenv/config';
import bcrypt from 'bcrypt';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const TEST_ADMIN = {
  email: 'admin@gmail.com',
  password: 'Admin12345',
  fullName: 'Administrador Principal',
};

const SALT_ROUNDS = 10;
const RECORDS_PER_TABLE = 20;
const TAX_RATE = 0.13;

const ROLE_NAME = 'administrador';
const ROLE_DESCRIPTION = 'Rol por defecto para administradores registrados';

const PERMISSIONS = [
  { code: 'inventory.view', description: 'Ver inventario' },
  { code: 'inventory.manage', description: 'Gestionar inventario' },
  { code: 'products.view', description: 'Ver productos' },
  { code: 'products.manage', description: 'Gestionar productos' },
  { code: 'sales.view', description: 'Ver ventas' },
  { code: 'sales.manage', description: 'Gestionar ventas' },
  { code: 'invoices.issue', description: 'Emitir facturas' },
  { code: 'invoices.void', description: 'Anular facturas' },
  { code: 'reviews.view', description: 'Ver reseñas' },
  { code: 'reviews.moderate', description: 'Moderar reseñas' },
  { code: 'reviews.respond', description: 'Responder reseñas' },
  { code: 'orders.view', description: 'Ver pedidos personalizados' },
  { code: 'orders.manage', description: 'Gestionar pedidos personalizados' },
  { code: 'users.view', description: 'Ver usuarios administradores' },
  { code: 'users.manage', description: 'Gestionar usuarios administradores' },
  { code: 'reports.view', description: 'Ver reportes' },
  { code: 'alerts.view', description: 'Ver alertas' },
  { code: 'alerts.manage', description: 'Gestionar alertas' },
  { code: 'notifications.view', description: 'Ver notificaciones' },
  { code: 'notifications.preferences', description: 'Configurar preferencias de notificación' },
];

const SUPPLY_NAMES = [
  'Resina epóxica transparente', 'Tinte azul ultramarino', 'Tinte rojo carmín',
  'Perlitas decorativas oro', 'Perlitas decorativas plata', 'Cuero curtido café',
  'Cuero curtido negro', 'Cuero curtido camel', 'Hilo encerado negro',
  'Hilo encerado blanco', 'Forro de algodón crudo', 'Forro de lona beige',
  'Herrajes metálicos dorados', 'Herrajes metálicos plateados',
  'Cremalleras YKK', 'Pegamento de contacto industrial',
  'Tinte verde esmeralda', 'Catalizador resina', 'Lijas grano 600',
  'Cera de acabado natural',
];

const UNITS = ['grams', 'kilograms', 'milliliters', 'liters', 'units'];

const PRODUCT_NAMES = [
  'Bolso artesanal de cuero café', 'Cartera elegante negra',
  'Mochila vintage marrón', 'Riñonera urbana azul',
  'Bolso de noche dorado', 'Bandolera de cuero camel',
  'Tote bag minimalista beige', 'Bolso de viaje verde oliva',
  'Cartera de mano gris perla', 'Bolso de fiesta plateado',
  'Bolso tejido natural', 'Mochila infantil rosa',
  'Bolso deportivo negro', 'Bolso minimalista blanco',
  'Bolso vintage rojo', 'Bolso eco de yute',
  'Cartera de tela floreada', 'Maletín de cuero negro',
  'Clutch metalizado', 'Bolso de lona crudo',
];

const VARIANT_LABELS = ['Estándar', 'Edición especial', 'Versión premium'];
const FIRST_NAMES = ['Mariana', 'Carlos', 'Sofía', 'Andrés', 'Valentina', 'Luis', 'Ana', 'Diego', 'Laura', 'Mateo', 'Camila', 'Javier', 'Isabella', 'Sebastián', 'Fernanda', 'Daniel', 'Gabriela', 'Joaquín', 'Renata', 'Esteban'];
const LAST_NAMES = ['Solís', 'Rojas', 'Méndez', 'Vargas', 'Castro', 'Jiménez', 'Mora', 'Hernández', 'Quesada', 'Picado', 'Soto', 'Brenes', 'Calderón', 'Murillo', 'Salas', 'Arce', 'Chacón', 'Fonseca', 'Granados', 'Loría'];

const PAYMENT_METHODS = ['SINPE', 'cash', 'card', 'other'];
const INVOICE_STATUSES = ['issued', 'voided'];
const STOCK_MOVEMENT_TYPES = ['sale', 'manual_adjustment'];
const PRODUCT_STOCK_TYPES = ['sale', 'manual_adjustment', 'production'];
const STOCK_REASONS = ['manual_adjustment', 'error_correction', 'damaged_product', 'return'];
const CUSTOM_ORDER_STATUSES = ['received', 'in_process', 'ready', 'sold', 'rejected'];
const INVENTORY_MOVEMENT_TYPES = ['entry', 'consumption'];
const ALERT_TYPES = ['low_stock', 'out_of_stock'];
const MODERATION_REASONS = ['offensive_content', 'spam', 'false_information', 'off_topic', 'other'];
const REVIEW_STATUSES = ['pending', 'approved', 'rejected'];
const NOTIFICATION_TYPES = ['internal', 'email', 'both'];

const REVIEW_COMMENTS = [
  'Excelente calidad, superó mis expectativas.',
  'El acabado es muy fino y elegante.',
  'Espacioso y cómodo, lo uso a diario.',
  'Llegó rápido y bien empacado.',
  'El cuero es suave y resistente.',
  'Diseño hermoso y original.',
  'Calidad-precio inmejorable.',
  'Combina con todo, me encanta.',
  'Las costuras son perfectas.',
  'Muy recomendado para regalo.',
  'Es un poco más pequeño de lo que esperaba.',
  'La entrega tardó más de lo esperado.',
  'El color es diferente al de la foto.',
  'Calidad regular para el precio.',
  'El cierre se siente algo frágil.',
];

const daysAgo = (n) => new Date(Date.now() - n * 86_400_000);

async function limpiarBaseDeDatos() {
  await prisma.moderationRecord.deleteMany();
  await prisma.adminResponse.deleteMany();
  await prisma.review.deleteMany();
  await prisma.adminNotification.deleteMany();
  await prisma.productStockMovement.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.customOrder.deleteMany();
  await prisma.supplyAlert.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supply.deleteMany();
  await prisma.item.deleteMany();
  await prisma.adminRecoveryToken.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.revokedToken.deleteMany();
  await prisma.adminUser.deleteMany();
}

async function sembrarRolYPermisos() {
  const role = await prisma.role.create({
    data: { name: ROLE_NAME, description: ROLE_DESCRIPTION },
  });

  const permisos = [];
  for (const p of PERMISSIONS) {
    permisos.push(await prisma.permission.create({ data: p }));
  }

  for (const permiso of permisos) {
    await prisma.rolePermission.create({
      data: { roleId: role.id, permissionId: permiso.id },
    });
  }
  return { role, permisos };
}

async function sembrarAdmins(role) {
  const passwordHashAdmin = await bcrypt.hash(TEST_ADMIN.password, SALT_ROUNDS);
  const admins = [];

  const principal = await prisma.adminUser.create({
    data: {
      fullName: TEST_ADMIN.fullName,
      email: TEST_ADMIN.email,
      passwordHash: passwordHashAdmin,
      accountStatus: 'active',
    },
  });
  await prisma.admin.create({ data: { adminUserId: principal.id, roleId: role.id } });
  await prisma.notificationPreference.create({
    data: { adminUserId: principal.id, receiveOrderNotifications: true, receiveReviewNotifications: true },
  });
  admins.push(principal);

  for (let i = 0; i < RECORDS_PER_TABLE - 1; i++) {
    const fullName = `${FIRST_NAMES[i]} ${LAST_NAMES[i]}`;
    const email = `admin${i + 1}@example.com`;
    const hash = await bcrypt.hash(`Admin${i + 1}!`, SALT_ROUNDS);
    const status = i === RECORDS_PER_TABLE - 2 ? 'inactive' : 'active';
    const adminUser = await prisma.adminUser.create({
      data: { fullName, email, passwordHash: hash, accountStatus: status },
    });
    await prisma.admin.create({ data: { adminUserId: adminUser.id, roleId: role.id } });
    await prisma.notificationPreference.create({
      data: {
        adminUserId: adminUser.id,
        receiveOrderNotifications: i % 2 === 0,
        receiveReviewNotifications: i % 3 === 0,
      },
    });
    admins.push(adminUser);
  }
  return admins;
}

async function sembrarRecoveryTokens(admins) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const admin = admins[i];
    await prisma.adminRecoveryToken.create({
      data: {
        adminUserId: admin.id,
        tokenHash: `seed-admin-recovery-token-${i}-${admin.id}`,
        expiresAt: new Date(Date.now() + 3600_000),
        usedAt: i % 4 === 0 ? daysAgo(i) : null,
      },
    });
  }
}

async function sembrarInsumos() {
  const supplies = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const name = SUPPLY_NAMES[i];
    const item = await prisma.item.create({
      data: { name, itemType: 'supply', status: i === 19 ? 'inactive' : 'active' },
    });
    const supply = await prisma.supply.create({
      data: {
        itemId: item.id,
        unitOfMeasure: UNITS[i % UNITS.length],
        currentStock: 50 + i * 5,
        minThreshold: 10,
      },
    });
    supplies.push({ item, supply });
  }
  return supplies;
}

async function sembrarMovimientosInventario(supplies, admins) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const { supply } = supplies[i];
    const admin = admins[i % admins.length];
    const previousStock = 100;
    const quantity = 10 + (i % 7);
    const isEntry = i % 2 === 0;
    const newStock = isEntry ? previousStock + quantity : previousStock - quantity;

    await prisma.inventoryMovement.create({
      data: {
        supplyId: supply.itemId,
        adminId: admin.id,
        type: isEntry ? 'entry' : 'consumption',
        quantity,
        previousStock,
        newStock,
        reference: `MOV-${1000 + i}`,
      },
    });
  }
}

async function sembrarAlertasInsumos(supplies) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const { supply } = supplies[i];
    await prisma.supplyAlert.create({
      data: {
        supplyId: supply.itemId,
        type: ALERT_TYPES[i % ALERT_TYPES.length],
        threshold: 10,
        active: i % 3 !== 0,
      },
    });
  }
}

async function sembrarProductos() {
  const productos = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const product = await prisma.product.create({
      data: {
        name: PRODUCT_NAMES[i],
        description: `${PRODUCT_NAMES[i]}. Pieza artesanal hecha a mano.`,
        price: 15000 + i * 1500,
        status: i === 19 ? 'inactive' : 'active',
        currentStock: 30 - (i % 10),
        isCustomizable: i % 4 === 0,
      },
    });

    const variantes = [];
    for (let v = 0; v < 3; v++) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: `${PRODUCT_NAMES[i]} — ${VARIANT_LABELS[v]}`,
          priceOverride: v === 0 ? null : 15000 + i * 1500 + v * 2500,
        },
      });
      variantes.push(variant);
    }
    productos.push({ product, variantes });
  }
  return productos;
}

async function sembrarVentasYFacturas(admins, productos) {
  const ventas = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const admin = admins[i % admins.length];
    const numItems = 1 + (i % 3);
    const items = [];
    let subtotal = 0;
    for (let k = 0; k < numItems; k++) {
      const { product, variantes } = productos[(i + k) % productos.length];
      const variant = variantes[k % 3];
      const quantity = 1 + (k % 2);
      const unitPrice = variant.priceOverride ?? product.price;
      subtotal += Number(unitPrice) * quantity;
      items.push({ variant, quantity, unitPrice, product });
    }
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes;

    const sale = await prisma.sale.create({
      data: {
        clientId: BigInt(1000 + i),
        adminId: admin.id,
        orderId: BigInt(2000 + i),
        paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
        totalAmount: total,
        createdAt: daysAgo(i + 2),
      },
    });

    for (const item of items) {
      await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          variantId: item.variant.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
      });
    }

    await prisma.invoice.create({
      data: {
        saleId: sale.id,
        invoiceNumber: `INV-${String(10001 + i).padStart(5, '0')}`,
        clientId: BigInt(1000 + i),
        issueDate: daysAgo(i + 2),
        subtotal,
        taxes,
        total,
        pdfPath: `/invoices/INV-${10001 + i}.pdf`,
        status: INVOICE_STATUSES[i % INVOICE_STATUSES.length],
      },
    });

    ventas.push({ sale, items, admin });
  }
  return ventas;
}

async function sembrarStockMovements(ventas, admins, productos) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const venta = ventas[i];
    const variantId = venta.items[0].variant.id;
    const admin = admins[i % admins.length];
    const previousQuantity = 30;
    const newQuantity = 28;

    await prisma.stockMovement.create({
      data: {
        variantId,
        adminId: admin.id,
        saleId: venta.sale.id,
        type: STOCK_MOVEMENT_TYPES[i % STOCK_MOVEMENT_TYPES.length],
        previousQuantity,
        newQuantity,
        reason: i % 2 === 0 ? null : STOCK_REASONS[i % STOCK_REASONS.length],
        note: i % 3 === 0 ? `Movimiento ${i + 1} registrado por seed.` : null,
      },
    });

    const { product } = productos[i % productos.length];
    await prisma.productStockMovement.create({
      data: {
        productId: product.id,
        adminId: admin.id,
        saleId: venta.sale.id,
        type: PRODUCT_STOCK_TYPES[i % PRODUCT_STOCK_TYPES.length],
        previousQuantity,
        newQuantity,
        reason: i % 2 === 0 ? null : STOCK_REASONS[i % STOCK_REASONS.length],
        note: i % 4 === 0 ? `Producción interna ${i + 1}.` : null,
      },
    });
  }
}

async function sembrarPedidosPersonalizados(admins, productos) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const admin = admins[i % admins.length];
    const { product } = productos[i % productos.length];
    const status = CUSTOM_ORDER_STATUSES[i % CUSTOM_ORDER_STATUSES.length];
    await prisma.customOrder.create({
      data: {
        clientId: BigInt(1000 + i),
        productId: product.id,
        adminId: admin.id,
        customizationDetails: {
          color: `Color ${i + 1}`,
          notas: `Detalles especiales solicitados por el cliente ${i + 1}.`,
          tamaño: i % 2 === 0 ? 'Mediano' : 'Grande',
        },
        status,
        rejectionReason: status === 'rejected' ? 'No se puede cumplir con la fecha solicitada.' : null,
      },
    });
  }
}

async function sembrarAdminNotifications(admins) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const admin = admins[i % admins.length];
    await prisma.adminNotification.create({
      data: {
        adminId: admin.id,
        type: NOTIFICATION_TYPES[i % NOTIFICATION_TYPES.length],
        title: `Notificación administrativa #${i + 1}`,
        content: `Detalle de la notificación administrativa ${i + 1}.`,
        entityType: i % 2 === 0 ? 'order' : 'inventory',
        entityId: BigInt(i + 1),
        read: i % 3 === 0,
        sentAt: daysAgo(i),
        sendAttempts: 1,
      },
    });
  }
}

async function sembrarAuthSecurity(admins) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const admin = admins[i % admins.length];
    await prisma.refreshToken.create({
      data: {
        userId: admin.id,
        tokenHash: `admin-refresh-hash-${i}-${admin.id}`.padEnd(64, '0').slice(0, 64),
        jti: `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
        expiresAt: new Date(Date.now() + 7 * 86_400_000),
        lastUsedAt: i % 2 === 0 ? daysAgo(i) : null,
      },
    });

    await prisma.revokedToken.create({
      data: {
        jti: `revoked-${String(i).padStart(8, '0')}-0000-0000-0000-000000000000`.slice(0, 36),
        expiresAt: new Date(Date.now() + 86_400_000),
      },
    });
  }
}

const REVIEWS_PER_PRODUCT = 4;
const RESPONSE_TEXTS = [
  '¡Gracias por tu reseña! Nos alegra mucho que te gustara.',
  'Agradecemos tu comentario, lo tendremos muy en cuenta.',
  'Lamentamos el inconveniente, te contactaremos para ayudarte.',
  'Gracias por tu retroalimentación, seguimos mejorando cada día.',
];

// Seeds denormalized reviews referencing the admin's own products, plus some
// admin responses (approved) and moderation records (rejected) for testing.
async function sembrarReviews(admins, productos) {
  let creadas = 0;
  let respuestas = 0;
  let moderaciones = 0;
  let n = 0;

  for (let p = 0; p < productos.length; p++) {
    const { product } = productos[p];
    for (let r = 0; r < REVIEWS_PER_PRODUCT; r++) {
      const status = REVIEW_STATUSES[(p + r) % REVIEW_STATUSES.length];
      const rating = 1 + ((p + r) % 5);
      const clientName = `${FIRST_NAMES[n % FIRST_NAMES.length]} ${LAST_NAMES[(n + 3) % LAST_NAMES.length]}`;

      const review = await prisma.review.create({
        data: {
          externalId: `ext-review-${product.id}-${r}`,
          productId: String(product.id),
          productName: product.name,
          clientId: `client-${1000 + n}`,
          clientName,
          clientEmail: `cliente${n + 1}@example.com`,
          rating,
          comment: REVIEW_COMMENTS[n % REVIEW_COMMENTS.length],
          edited: n % 5 === 0,
          helpfulVotes: (p + r) * 2,
          unhelpfulVotes: r % 3,
          isPriority: rating <= 2,
          status,
          createdAt: daysAgo(n % 30),
        },
      });
      creadas++;

      if (status === 'approved' && r % 2 === 0) {
        const admin = admins[n % admins.length];
        await prisma.adminResponse.create({
          data: {
            reviewId: review.id,
            adminId: admin.id,
            text: RESPONSE_TEXTS[n % RESPONSE_TEXTS.length],
          },
        });
        respuestas++;
      }

      if (status === 'rejected') {
        const admin = admins[n % admins.length];
        await prisma.moderationRecord.create({
          data: {
            reviewId: review.id,
            adminId: admin.id,
            action: 'rejected',
            reason: MODERATION_REASONS[n % MODERATION_REASONS.length],
            notes: n % 2 === 0 ? 'Rechazada durante el seed por incumplir las pautas.' : null,
            productName: product.name,
            clientName,
          },
        });
        moderaciones++;
      }
      n++;
    }
  }

  return { creadas, respuestas, moderaciones };
}

async function main() {
  console.log('Iniciando seed administrativo...');

  await limpiarBaseDeDatos();
  console.log('- Base de datos limpia');

  const { role } = await sembrarRolYPermisos();
  console.log(`- Rol '${ROLE_NAME}' y ${PERMISSIONS.length} permisos`);

  const admins = await sembrarAdmins(role);
  console.log(`- ${admins.length} usuarios admin (incluye ${TEST_ADMIN.email})`);

  await sembrarRecoveryTokens(admins);
  console.log('- Tokens de recuperacion');

  const supplies = await sembrarInsumos();
  console.log(`- ${supplies.length} insumos`);

  await sembrarMovimientosInventario(supplies, admins);
  console.log('- Movimientos de inventario');

  await sembrarAlertasInsumos(supplies);
  console.log('- Alertas de insumos');

  const productos = await sembrarProductos();
  console.log(`- ${productos.length} productos con variantes`);

  const ventas = await sembrarVentasYFacturas(admins, productos);
  console.log(`- ${ventas.length} ventas + facturas`);

  await sembrarStockMovements(ventas, admins, productos);
  console.log('- Movimientos de stock');

  await sembrarPedidosPersonalizados(admins, productos);
  console.log('- Pedidos personalizados');

  await sembrarAdminNotifications(admins);
  console.log('- Notificaciones administrativas');

  const reviewsStats = await sembrarReviews(admins, productos);
  console.log(
    `- ${reviewsStats.creadas} reseñas (${reviewsStats.respuestas} respuestas, ${reviewsStats.moderaciones} registros de moderación)`,
  );

  await sembrarAuthSecurity(admins);
  console.log('- Tokens de seguridad');

  console.log(`\nSeed completado. Credenciales de prueba: ${TEST_ADMIN.email} / ${TEST_ADMIN.password}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('Error al ejecutar el seed:', error);
    prisma.$disconnect();
    process.exit(1);
  });
