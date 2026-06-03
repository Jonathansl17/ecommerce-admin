// ──────────────────────────────────────────────────────────────────────────────
// Database seed — populates every table with realistic data for local development.
//
// Test credentials seeded by this script:
//   email:    admin@gmail.com
//   password: Admin12345
// ──────────────────────────────────────────────────────────────────────────────

import 'dotenv/config';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Seed must not run in production. Set NODE_ENV != production or use a dedicated migration script.');
}

import bcrypt from 'bcrypt';
import pkg from '@prisma/client';
import { NOTIFICATION_CONFIG, NOTIFICATION_REVIEW_TITLES, NOTIFICATION_TYPE } from '../features/notifications/notifications.constants.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const CLIENT_ID_BASE = 1000n;
const SEED_INVOICE_NUMBER_BASE = 10001;
const SEED_PREVIOUS_STOCK = 30;
const SEED_NEW_STOCK = 28;
const MS_PER_DAY = 86_400_000;
const MS_PER_WEEK = 7 * 86_400_000;
const BASE_PRODUCT_PRICE = 15000;
const VARIANT_PRICE_INCREMENT = 2500;
const SUPPLY_MIN_THRESHOLD = 10;
const SUPPLY_INITIAL_STOCK = 100;
const SKELETON_LOADERS = 3;

const TEST_ADMIN = {
  email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
  password: process.env.SEED_ADMIN_PASSWORD || 'ChangeThisPassword123',
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
const INVENTORY_MOVEMENT_TYPES = { ENTRY: 'entry', CONSUMPTION: 'consumption' };
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

const daysAgo = (n) => new Date(Date.now() - n * MS_PER_DAY);

async function limpiarBaseDeDatos() {
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
      data: { name, itemType: 'supply', status: i === RECORDS_PER_TABLE - 1 ? 'inactive' : 'active' },
    });
    const supply = await prisma.supply.create({
      data: {
        itemId: item.id,
        unitOfMeasure: UNITS[i % UNITS.length],
        currentStock: 50 + i * 5,
        minThreshold: SUPPLY_MIN_THRESHOLD,
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
    const previousStock = SUPPLY_INITIAL_STOCK;
    const quantity = 10 + (i % 7);
    const isEntry = i % 2 === 0;
    const newStock = isEntry ? previousStock + quantity : previousStock - quantity;

    await prisma.inventoryMovement.create({
      data: {
        supplyId: supply.itemId,
        adminId: admin.id,
        type: isEntry ? INVENTORY_MOVEMENT_TYPES.ENTRY : INVENTORY_MOVEMENT_TYPES.CONSUMPTION,
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
        threshold: SUPPLY_MIN_THRESHOLD,
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
        price: BASE_PRODUCT_PRICE + i * 1500,
        status: i === RECORDS_PER_TABLE - 1 ? 'inactive' : 'active',
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
          priceOverride: v === 0 ? null : BASE_PRODUCT_PRICE + i * 1500 + v * VARIANT_PRICE_INCREMENT,
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
        clientId: CLIENT_ID_BASE + BigInt(i),
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
        invoiceNumber: `INV-${String(SEED_INVOICE_NUMBER_BASE + i).padStart(5, '0')}`,
        clientId: CLIENT_ID_BASE + BigInt(i),
        issueDate: daysAgo(i + 2),
        subtotal,
        taxes,
        total,
        pdfPath: `/invoices/INV-${SEED_INVOICE_NUMBER_BASE + i}.pdf`,
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
    const previousQuantity = SEED_PREVIOUS_STOCK;
    const newQuantity = SEED_NEW_STOCK;

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

const CUSTOM_DETAILS_PRESETS = [
  { material: 'Cuero genuino', color: 'Marrón oscuro', alto: '35 cm', ancho: '28 cm', profundidad: '12 cm', herrajes: 'Dorados', 'fecha de entrega': '20 jun 2026', notas: 'Para regalo de cumpleaños' },
  { material: 'Cuero vegano', color: 'Negro mate', alto: '22 cm', ancho: '30 cm', profundidad: '8 cm', forma: 'Rectangular', 'fecha de entrega': '15 jun 2026', notas: 'Sin costuras visibles por fuera' },
  { material: 'Lona reforzada', color: 'Verde oliva', alto: '40 cm', ancho: '35 cm', profundidad: '15 cm', cierre: 'Cremallera YKK', 'fecha de entrega': '10 jul 2026' },
  { material: 'Cuero curtido café', color: 'Camel', alto: '18 cm', ancho: '22 cm', profundidad: '5 cm', herrajes: 'Plateados', 'fecha de entrega': '5 jun 2026', notas: 'Iniciales "A.V." grabadas en la tapa' },
  { material: 'Cuero genuino', color: 'Azul marino', alto: '25 cm', ancho: '20 cm', profundidad: '7 cm', forma: 'Bandolera', 'fecha de entrega': '25 jun 2026' },
  { material: 'Tela de yute', color: 'Natural beige', alto: '38 cm', ancho: '32 cm', profundidad: '10 cm', 'fecha de entrega': '18 jun 2026', notas: 'Forro interior de lino crudo' },
  { material: 'Cuero vegano', color: 'Rojo carmín', alto: '16 cm', ancho: '20 cm', profundidad: '4 cm', herrajes: 'Dorados', 'fecha de entrega': '30 jun 2026', notas: 'Bolsillo exterior con cierre' },
  { material: 'Cuero genuino', color: 'Gris marengo', alto: '30 cm', ancho: '40 cm', profundidad: '8 cm', forma: 'Maletín', cierre: 'Magnético', 'fecha de entrega': '12 jul 2026', notas: 'Compartimento para laptop 15"' },
];

async function sembrarPedidosPersonalizados(admins, productos) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const admin = admins[i % admins.length];
    const { product } = productos[i % productos.length];
    const status = CUSTOM_ORDER_STATUSES[i % CUSTOM_ORDER_STATUSES.length];
    await prisma.customOrder.create({
      data: {
        clientId: CLIENT_ID_BASE + BigInt(i),
        productId: product.id,
        adminId: admin.id,
        customizationDetails: CUSTOM_DETAILS_PRESETS[i % CUSTOM_DETAILS_PRESETS.length],
        status,
        rejectionReason: status === 'rejected' ? 'No se puede cumplir con la fecha solicitada.' : null,
      },
    });
  }
}

async function sembrarNotificacionesPedidos(admins) {
  const CUSTOM_NOTIFICATION_ORDERS = [
    {
      orderId: 'ORD-2026-001', clientName: 'Mariana Solís', clientEmail: 'mariana.solis@gmail.com',
      products: [
        { name: 'Bolso artesanal de cuero café', quantity: 1, unitPrice: 35000, isCustomizable: true, customizationDetails: CUSTOM_DETAILS_PRESETS[0] },
      ],
      total: 35000, shippingAddress: 'San José, Costa Rica',
      daysBack: 0, read: false, customizationStatus: null,
    },
    {
      orderId: 'ORD-2026-002', clientName: 'Carlos Rojas', clientEmail: 'carlos.rojas@outlook.com',
      products: [
        { name: 'Maletín de cuero negro', quantity: 1, unitPrice: 58000, isCustomizable: true, customizationDetails: CUSTOM_DETAILS_PRESETS[7] },
        { name: 'Cartera elegante negra', quantity: 1, unitPrice: 18000, isCustomizable: true, customizationDetails: CUSTOM_DETAILS_PRESETS[3] },
      ],
      total: 76000, shippingAddress: 'Heredia, Costa Rica',
      daysBack: 1, read: false, customizationStatus: null,
    },
    {
      orderId: 'ORD-2026-003', clientName: 'Sofía Castro', clientEmail: 'sofia.castro@gmail.com',
      products: [
        { name: 'Cartera de mano gris perla', quantity: 2, unitPrice: 22000, isCustomizable: true, customizationDetails: CUSTOM_DETAILS_PRESETS[1] },
      ],
      total: 44000, shippingAddress: 'Alajuela, Costa Rica',
      daysBack: 2, read: true, customizationStatus: 'accepted',
    },
    {
      orderId: 'ORD-2026-004', clientName: 'Andrés Vargas', clientEmail: 'andres.vargas@hotmail.com',
      products: [
        { name: 'Bandolera de cuero camel', quantity: 1, unitPrice: 29000, isCustomizable: true, customizationDetails: CUSTOM_DETAILS_PRESETS[4] },
      ],
      total: 29000, shippingAddress: 'Cartago, Costa Rica',
      daysBack: 3, read: true, customizationStatus: 'rejected', customizationRejectionReason: 'No contamos con el material solicitado en esa fecha.',
    },
    {
      orderId: 'ORD-2026-005', clientName: 'Valentina Jiménez', clientEmail: 'vjimenez@gmail.com',
      products: [
        { name: 'Tote bag minimalista beige', quantity: 1, unitPrice: 19500, isCustomizable: true, customizationDetails: CUSTOM_DETAILS_PRESETS[5] },
        { name: 'Bolso de noche dorado', quantity: 1, unitPrice: 32000, isCustomizable: true, customizationDetails: CUSTOM_DETAILS_PRESETS[2] },
      ],
      total: 51500, shippingAddress: 'Liberia, Guanacaste',
      daysBack: 0, read: false, customizationStatus: null,
    },
    {
      orderId: 'ORD-2026-006', clientName: 'Luis Mora', clientEmail: 'luis.mora@empresa.cr',
      products: [
        { name: 'Bolso vintage rojo', quantity: 1, unitPrice: 27000, isCustomizable: true, customizationDetails: CUSTOM_DETAILS_PRESETS[6] },
      ],
      total: 27000, shippingAddress: 'Pérez Zeledón, San José',
      daysBack: 1, read: false, customizationStatus: null,
    },
  ];

  const admin = admins[0];

  for (const order of CUSTOM_NOTIFICATION_ORDERS) {
    const content = {
      orderId: order.orderId,
      clientName: order.clientName,
      ...(order.clientEmail ? { clientEmail: order.clientEmail } : {}),
      products: order.products,
      total: order.total,
      shippingAddress: order.shippingAddress,
      hasCustomization: true,
      ...(order.customizationStatus ? { customizationStatus: order.customizationStatus } : {}),
      ...(order.customizationRejectionReason ? { customizationRejectionReason: order.customizationRejectionReason } : {}),
    };

    await prisma.adminNotification.create({
      data: {
        adminId: admin.id,
        type: NOTIFICATION_TYPE.INTERNAL,
        title: NOTIFICATION_CONFIG.DEFAULT_ORDER_TITLE,
        content: JSON.stringify(content),
        entityType: 'order',
        entityId: null,
        read: order.read,
        sentAt: daysAgo(order.daysBack),
        createdAt: daysAgo(order.daysBack),
      },
    });
  }
}


async function sembrarNotificacionesPedidosRegulares(admins) {
  const admin = admins[0];

  const REGULAR_ORDERS = [
    {
      orderId: 'ORD-2026-007', clientName: 'Diana Fonseca', clientEmail: 'diana.fonseca@gmail.com',
      products: [
        { name: 'Bolso tejido natural', quantity: 1, unitPrice: 24500, isCustomizable: false },
        { name: 'Clutch metalizado', quantity: 2, unitPrice: 18000, isCustomizable: false },
      ],
      total: 60500, shippingAddress: 'Pérez Zeledón, San José',
      daysBack: 0, read: false,
    },
    {
      orderId: 'ORD-2026-008', clientName: 'Roberto Calderón', clientEmail: 'rcalderon@outlook.com',
      products: [
        { name: 'Mochila vintage marrón', quantity: 1, unitPrice: 38000, isCustomizable: false },
      ],
      total: 38000, shippingAddress: 'Escazú, San José',
      daysBack: 1, read: false,
    },
    {
      orderId: 'ORD-2026-009', clientName: 'Pamela Brenes', clientEmail: 'pamela.brenes@gmail.com',
      products: [
        { name: 'Bolso de fiesta plateado', quantity: 1, unitPrice: 29000, isCustomizable: false },
        { name: 'Cartera elegante negra', quantity: 1, unitPrice: 18000, isCustomizable: false },
        { name: 'Bolso minimalista blanco', quantity: 1, unitPrice: 21000, isCustomizable: false },
      ],
      total: 68000, shippingAddress: 'Santa Ana, San José',
      daysBack: 2, read: true,
    },
  ];

  for (const order of REGULAR_ORDERS) {
    await prisma.adminNotification.create({
      data: {
        adminId: admin.id,
        type: NOTIFICATION_TYPE.INTERNAL,
        title: NOTIFICATION_CONFIG.DEFAULT_ORDER_TITLE,
        content: JSON.stringify({
          orderId: order.orderId,
          clientName: order.clientName,
          clientEmail: order.clientEmail,
          products: order.products,
          total: order.total,
          shippingAddress: order.shippingAddress,
          hasCustomization: false,
        }),
        entityType: 'order',
        entityId: null,
        read: order.read,
        sentAt: daysAgo(order.daysBack),
        createdAt: daysAgo(order.daysBack),
      },
    });
  }
}

async function sembrarNotificacionesReseniasEstandar(admins) {
  const admin = admins[0];

  const STANDARD_REVIEWS = [
    {
      productName: 'Bolso artesanal de cuero café', productId: '1',
      clientName: 'Laura Soto', rating: 5,
      reviewText: 'Excelente calidad, el cuero es suave y resistente. Lo recomiendo totalmente.',
      isPriority: false, daysBack: 0, read: false,
    },
    {
      productName: 'Mochila vintage marrón', productId: '3',
      clientName: 'Sebastián Arce', rating: 4,
      reviewText: 'Muy bonita y espaciosa, las costuras son perfectas. Le falta un bolsillo externo.',
      isPriority: false, daysBack: 1, read: false,
    },
    {
      productName: 'Tote bag minimalista beige', productId: '7',
      clientName: 'Renata Loría', rating: 5,
      reviewText: 'Llegó rápido y bien empacado. El diseño es hermoso y original.',
      isPriority: false, daysBack: 3, read: true,
    },
  ];

  for (const review of STANDARD_REVIEWS) {
    await prisma.adminNotification.create({
      data: {
        adminId: admin.id,
        type: NOTIFICATION_TYPE.INTERNAL,
        title: NOTIFICATION_REVIEW_TITLES.STANDARD,
        content: JSON.stringify({
          productName: review.productName,
          productId: review.productId,
          clientName: review.clientName,
          rating: review.rating,
          reviewText: review.reviewText,
          isPriority: review.isPriority,
        }),
        entityType: 'review',
        entityId: null,
        read: review.read,
        sentAt: daysAgo(review.daysBack),
        createdAt: daysAgo(review.daysBack),
      },
    });
  }
}

async function sembrarNotificacionesReseniasNegativas(admins) {
  const admin = admins[0];

  const NEGATIVE_REVIEWS = [
    {
      productName: 'Cartera elegante negra', productId: '2',
      clientName: 'Esteban Granados', rating: 1,
      reviewText: 'El color es completamente diferente al de la foto. Muy decepcionante.',
      isPriority: true, daysBack: 0, read: false,
    },
    {
      productName: 'Riñonera urbana azul', productId: '4',
      clientName: 'Gabriela Murillo', rating: 2,
      reviewText: 'El cierre se rompió a la semana de uso. Calidad muy pobre para el precio.',
      isPriority: true, daysBack: 1, read: false,
    },
    {
      productName: 'Bolso de viaje verde oliva', productId: '8',
      clientName: 'Joaquín Salas', rating: 1,
      reviewText: 'La entrega tardó tres semanas y llegó con el forro roto. Pésimo servicio.',
      isPriority: true, daysBack: 2, read: true,
    },
  ];

  for (const review of NEGATIVE_REVIEWS) {
    await prisma.adminNotification.create({
      data: {
        adminId: admin.id,
        type: NOTIFICATION_TYPE.INTERNAL,
        title: NOTIFICATION_REVIEW_TITLES.PRIORITY,
        content: JSON.stringify({
          productName: review.productName,
          productId: review.productId,
          clientName: review.clientName,
          rating: review.rating,
          reviewText: review.reviewText,
          isPriority: review.isPriority,
        }),
        entityType: 'review',
        entityId: null,
        read: review.read,
        sentAt: daysAgo(review.daysBack),
        createdAt: daysAgo(review.daysBack),
      },
    });
  }
}

async function sembrarRefreshTokens(admins) {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const admin = admins[i % admins.length];
    await prisma.refreshToken.create({
      data: {
        userId: admin.id,
        tokenHash: `admin-refresh-hash-${i}-${admin.id}`.padEnd(64, '0').slice(0, 64),
        jti: `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
        expiresAt: new Date(Date.now() + MS_PER_WEEK),
        lastUsedAt: i % 2 === 0 ? daysAgo(i) : null,
      },
    });
  }
}

async function sembrarRevokedTokens() {
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    await prisma.revokedToken.create({
      data: {
        jti: `revoked-${String(i).padStart(8, '0')}-0000-0000-0000-000000000000`.slice(0, 36),
        expiresAt: new Date(Date.now() + MS_PER_DAY),
      },
    });
  }
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

  await sembrarNotificacionesPedidos(admins);
  console.log('- Notificaciones de pedidos personalizados');

  await sembrarNotificacionesPedidosRegulares(admins);
  console.log('- Notificaciones de pedidos regulares');

  await sembrarNotificacionesReseniasEstandar(admins);
  console.log('- Notificaciones de reseñas estándar');

  await sembrarNotificacionesReseniasNegativas(admins);
  console.log('- Notificaciones de reseñas negativas');

  await sembrarRefreshTokens(admins);
  console.log('- Refresh tokens');

  await sembrarRevokedTokens();
  console.log('- Revoked tokens');

  console.log(`\nSeed completado. Credenciales de prueba: ${TEST_ADMIN.email} / ${TEST_ADMIN.password}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('Error al ejecutar el seed:', error);
    prisma.$disconnect();
    process.exit(1);
  });
