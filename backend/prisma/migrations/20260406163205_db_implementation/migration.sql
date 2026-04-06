/*
  Warnings:

  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'inactive', 'deleted');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('supply');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('grams', 'kilograms', 'milliliters', 'liters', 'units');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('entry', 'consumption');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('low_stock', 'out_of_stock');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('SINPE', 'cash', 'card', 'other');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('issued', 'voided');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('sale', 'manual_adjustment');

-- CreateEnum
CREATE TYPE "StockMovementReason" AS ENUM ('manual_adjustment', 'error_correction', 'damaged_product', 'return');

-- CreateEnum
CREATE TYPE "CustomOrderStatus" AS ENUM ('received', 'in_process', 'ready', 'sold', 'rejected');

-- CreateEnum
CREATE TYPE "ModerationReason" AS ENUM ('offensive_content', 'spam', 'false_information', 'off_topic', 'other');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('internal', 'email', 'both');

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_client_id_fkey";

-- DropTable
DROP TABLE "clients";

-- DropTable
DROP TABLE "products";

-- CreateTable
CREATE TABLE "admin_users" (
    "id" BIGSERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "account_status" "AccountStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_recovery_tokens" (
    "id" BIGSERIAL NOT NULL,
    "admin_user_id" BIGINT NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_recovery_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" BIGINT NOT NULL,
    "permission_id" BIGINT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "admins" (
    "admin_user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_user_id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "status" "ItemStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplies" (
    "item_id" BIGINT NOT NULL,
    "unit_of_measure" "UnitOfMeasure" NOT NULL,
    "current_stock" DECIMAL(10,2) NOT NULL,
    "min_threshold" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "supplies_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" BIGSERIAL NOT NULL,
    "supply_id" BIGINT NOT NULL,
    "admin_user_id" BIGINT NOT NULL,
    "type" "InventoryMovementType" NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "previous_stock" DECIMAL(10,2) NOT NULL,
    "new_stock" DECIMAL(10,2) NOT NULL,
    "reference" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_alerts" (
    "id" BIGSERIAL NOT NULL,
    "supply_id" BIGINT NOT NULL,
    "type" "AlertType" NOT NULL,
    "threshold" DECIMAL(10,2) NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "supply_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT NOT NULL,
    "admin_user_id" BIGINT NOT NULL,
    "order_id" BIGINT NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_items" (
    "id" BIGSERIAL NOT NULL,
    "sale_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" BIGSERIAL NOT NULL,
    "sale_id" BIGINT NOT NULL,
    "invoice_number" VARCHAR(30) NOT NULL,
    "client_id" BIGINT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "taxes" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "pdf_path" VARCHAR(300),
    "status" "InvoiceStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" BIGSERIAL NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "admin_user_id" BIGINT NOT NULL,
    "sale_id" BIGINT,
    "type" "StockMovementType" NOT NULL,
    "previous_quantity" INTEGER NOT NULL,
    "new_quantity" INTEGER NOT NULL,
    "reason" "StockMovementReason" NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_alerts" (
    "id" BIGSERIAL NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "type" "AlertType" NOT NULL,
    "threshold" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "variant_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_orders" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "admin_user_id" BIGINT NOT NULL,
    "customization_details" JSONB NOT NULL,
    "status" "CustomOrderStatus" NOT NULL,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_responses" (
    "id" BIGSERIAL NOT NULL,
    "review_id" BIGINT NOT NULL,
    "admin_user_id" BIGINT NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_records" (
    "id" BIGSERIAL NOT NULL,
    "review_id" BIGINT NOT NULL,
    "admin_user_id" BIGINT NOT NULL,
    "reason" "ModerationReason" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_notifications" (
    "id" BIGSERIAL NOT NULL,
    "admin_user_id" BIGINT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT,
    "entity_type" VARCHAR(50),
    "entity_id" BIGINT,
    "read" BOOLEAN NOT NULL,
    "sent_at" TIMESTAMP(3),
    "send_attempts" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_recovery_tokens_admin_user_id_idx" ON "admin_recovery_tokens"("admin_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "admins_role_id_idx" ON "admins"("role_id");

-- CreateIndex
CREATE INDEX "inventory_movements_supply_id_idx" ON "inventory_movements"("supply_id");

-- CreateIndex
CREATE INDEX "inventory_movements_admin_user_id_idx" ON "inventory_movements"("admin_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "supply_alerts_supply_id_key" ON "supply_alerts"("supply_id");

-- CreateIndex
CREATE INDEX "sales_client_id_idx" ON "sales"("client_id");

-- CreateIndex
CREATE INDEX "sales_admin_user_id_idx" ON "sales"("admin_user_id");

-- CreateIndex
CREATE INDEX "sales_order_id_idx" ON "sales"("order_id");

-- CreateIndex
CREATE INDEX "sale_items_sale_id_idx" ON "sale_items"("sale_id");

-- CreateIndex
CREATE INDEX "sale_items_variant_id_idx" ON "sale_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_sale_id_idx" ON "invoices"("sale_id");

-- CreateIndex
CREATE INDEX "invoices_client_id_idx" ON "invoices"("client_id");

-- CreateIndex
CREATE INDEX "stock_movements_variant_id_idx" ON "stock_movements"("variant_id");

-- CreateIndex
CREATE INDEX "stock_movements_admin_user_id_idx" ON "stock_movements"("admin_user_id");

-- CreateIndex
CREATE INDEX "stock_movements_sale_id_idx" ON "stock_movements"("sale_id");

-- CreateIndex
CREATE INDEX "variant_alerts_variant_id_idx" ON "variant_alerts"("variant_id");

-- CreateIndex
CREATE INDEX "custom_orders_client_id_idx" ON "custom_orders"("client_id");

-- CreateIndex
CREATE INDEX "custom_orders_product_id_idx" ON "custom_orders"("product_id");

-- CreateIndex
CREATE INDEX "custom_orders_admin_user_id_idx" ON "custom_orders"("admin_user_id");

-- CreateIndex
CREATE INDEX "admin_responses_review_id_idx" ON "admin_responses"("review_id");

-- CreateIndex
CREATE INDEX "admin_responses_admin_user_id_idx" ON "admin_responses"("admin_user_id");

-- CreateIndex
CREATE INDEX "moderation_records_review_id_idx" ON "moderation_records"("review_id");

-- CreateIndex
CREATE INDEX "moderation_records_admin_user_id_idx" ON "moderation_records"("admin_user_id");

-- CreateIndex
CREATE INDEX "admin_notifications_admin_user_id_idx" ON "admin_notifications"("admin_user_id");

-- CreateIndex
CREATE INDEX "admin_notifications_entity_type_entity_id_idx" ON "admin_notifications"("entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "admin_recovery_tokens" ADD CONSTRAINT "admin_recovery_tokens_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplies" ADD CONSTRAINT "supplies_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supply_alerts" ADD CONSTRAINT "supply_alerts_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_orders" ADD CONSTRAINT "custom_orders_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_responses" ADD CONSTRAINT "admin_responses_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_records" ADD CONSTRAINT "moderation_records_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_notifications" ADD CONSTRAINT "admin_notifications_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
